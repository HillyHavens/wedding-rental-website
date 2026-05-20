import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto';

@Injectable()
export class BookingsService {
  private readonly log = new Logger(BookingsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookingDto) {
    const eventDate = parseDate(dto.eventDate);
    const itemIds = Array.from(new Set(dto.rentalItemIds));

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await this.prisma.$transaction(
          async (tx) => {
            const items = await tx.rentalItem.findMany({
              where: { id: { in: itemIds }, isActive: true },
              select: {
                id: true,
                name: true,
                quantity: true,
                pricePerEvent: true,
              },
            });

            if (items.length !== itemIds.length) {
              throw new BadRequestException('One or more items not found');
            }

            const booked = await tx.bookingItem.groupBy({
              by: ['rentalItemId'],
              where: {
                rentalItemId: { in: itemIds },
                booking: {
                  eventDate,
                  status: { in: ['PENDING', 'CONFIRMED'] },
                },
              },
              _count: { rentalItemId: true },
            });
            const bookedMap = new Map(
              booked.map((b) => [b.rentalItemId, b._count.rentalItemId]),
            );

            const unavailable = items.filter(
              (i) => (bookedMap.get(i.id) ?? 0) + 1 > i.quantity,
            );
            if (unavailable.length) {
              throw new ConflictException({
                message: 'Some items are not available on this date',
                unavailable: unavailable.map((i) => ({
                  id: i.id,
                  name: i.name,
                })),
              });
            }

            const totalPrice = items.reduce(
              (sum, i) => sum + i.pricePerEvent,
              0,
            );

            return tx.booking.create({
              data: {
                userId,
                eventDate,
                eventType: dto.eventType,
                notes: dto.notes,
                totalPrice,
                items: {
                  create: items.map((i) => ({
                    rentalItemId: i.id,
                    priceAtBooking: i.pricePerEvent,
                  })),
                },
              },
              include: {
                items: { include: { rentalItem: { include: { category: true } } } },
              },
            });
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
      } catch (err) {
        if (isSerializationConflict(err) && attempt < 2) {
          this.log.warn(
            `Serialization conflict booking attempt ${attempt + 1}, retrying`,
          );
          continue;
        }
        throw err;
      }
    }
    throw new ConflictException('Booking conflicted — please try again');
  }

  listMine(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        items: { include: { rentalItem: { include: { category: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  listAll(status?: string) {
    return this.prisma.booking.findMany({
      where: status
        ? { status: status as 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' }
        : {},
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: { include: { rentalItem: { include: { category: true } } } },
      },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async updateStatus(id: string, dto: UpdateBookingStatusDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    return this.prisma.booking.update({
      where: { id },
      data: { status: dto.status },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { rentalItem: true } },
      },
    });
  }
}

function parseDate(str: string): Date {
  const dateOnly = str.length === 10 ? str : str.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
    throw new BadRequestException('eventDate must be YYYY-MM-DD');
  }
  const d = new Date(`${dateOnly}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) {
    throw new BadRequestException('invalid eventDate');
  }
  return d;
}

function isSerializationConflict(err: unknown): boolean {
  if (err && typeof err === 'object' && 'code' in err) {
    return (err as { code: string }).code === 'P2034';
  }
  return false;
}
