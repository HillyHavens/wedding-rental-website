import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGalleryPhotoDto, UpdateGalleryPhotoDto } from './dto';

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(publishedOnly = true) {
    return this.prisma.galleryPhoto.findMany({
      where: publishedOnly ? { isPublished: true } : undefined,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async create(imageUrl: string, dto: CreateGalleryPhotoDto) {
    return this.prisma.galleryPhoto.create({
      data: { imageUrl, ...dto },
    });
  }

  async update(id: string, dto: UpdateGalleryPhotoDto) {
    await this.findOneOrFail(id);
    return this.prisma.galleryPhoto.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOneOrFail(id);
    return this.prisma.galleryPhoto.delete({ where: { id } });
  }

  private async findOneOrFail(id: string) {
    const photo = await this.prisma.galleryPhoto.findUnique({ where: { id } });
    if (!photo) throw new NotFoundException('Gallery photo not found');
    return photo;
  }
}
