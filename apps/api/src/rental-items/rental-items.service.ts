import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRentalItemDto, UpdateRentalItemDto } from './dto';

interface FindAllOptions {
  featured?: boolean;
  categorySlug?: string;
  limit?: number;
}

export interface AvailabilityRow {
  id: string;
  quantity: number;
  bookedCount: number;
  available: number;
}

@Injectable()
export class RentalItemsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(opts: FindAllOptions = {}) {
    return this.prisma.rentalItem.findMany({
      where: {
        isActive: true,
        ...(opts.featured ? { isFeatured: true } : {}),
        ...(opts.categorySlug
          ? { category: { slug: opts.categorySlug } }
          : {}),
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: opts.limit,
    });
  }

  findById(id: string) {
    return this.prisma.rentalItem.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async availabilityOn(
    dateStr: string,
    ids?: string[],
  ): Promise<AvailabilityRow[]> {
    const date = parseDate(dateStr);
    const items = await this.prisma.rentalItem.findMany({
      where: {
        isActive: true,
        ...(ids && ids.length ? { id: { in: ids } } : {}),
      },
      select: { id: true, quantity: true },
    });

    if (items.length === 0) return [];

    const booked = await this.prisma.bookingItem.groupBy({
      by: ['rentalItemId'],
      where: {
        rentalItemId: { in: items.map((i) => i.id) },
        booking: {
          eventDate: date,
          status: { in: ['PENDING', 'CONFIRMED'] },
        },
      },
      _count: { rentalItemId: true },
    });

    const bookedMap = new Map(
      booked.map((b) => [b.rentalItemId, b._count.rentalItemId]),
    );

    return items.map((i) => {
      const bookedCount = bookedMap.get(i.id) ?? 0;
      return {
        id: i.id,
        quantity: i.quantity,
        bookedCount,
        available: Math.max(0, i.quantity - bookedCount),
      };
    });
  }

  create(dto: CreateRentalItemDto) {
    return this.prisma.rentalItem.create({
      data: { ...dto, images: dto.images ?? [] },
      include: { category: true },
    });
  }

  update(id: string, dto: UpdateRentalItemDto) {
    return this.prisma.rentalItem.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
  }

  softDelete(id: string) {
    return this.prisma.rentalItem.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

function parseDate(str: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    throw new BadRequestException('date must be YYYY-MM-DD');
  }
  const d = new Date(`${str}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) {
    throw new BadRequestException('invalid date');
  }
  return d;
}
