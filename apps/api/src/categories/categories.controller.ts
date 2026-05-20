import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Public } from '../auth/public.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Public()
  @Get()
  list() {
    return this.categories.findAll();
  }

  @Public()
  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    const category = await this.categories.findBySlug(slug);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }
}
