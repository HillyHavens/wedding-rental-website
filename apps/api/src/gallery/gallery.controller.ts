import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { GalleryService } from './gallery.service';
import { CreateGalleryPhotoDto, UpdateGalleryPhotoDto } from './dto';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/roles.decorator';

const imageStorage = diskStorage({
  destination: './uploads/gallery',
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});

@Controller('gallery')
export class GalleryController {
  constructor(private readonly gallery: GalleryService) {}

  @Public()
  @Get()
  list() {
    return this.gallery.findAll(true);
  }

  @Roles('ADMIN')
  @Get('all')
  listAll() {
    return this.gallery.findAll(false);
  }

  @Roles('ADMIN')
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: imageStorage,
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new BadRequestException('Only image files are allowed'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateGalleryPhotoDto,
  ) {
    if (!file) throw new BadRequestException('Image file is required');
    const imageUrl = `/uploads/gallery/${file.filename}`;
    return this.gallery.create(imageUrl, dto);
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGalleryPhotoDto) {
    return this.gallery.update(id, dto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gallery.remove(id);
  }
}
