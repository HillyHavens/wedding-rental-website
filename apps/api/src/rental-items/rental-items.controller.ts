import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RentalItemsService } from './rental-items.service';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/roles.decorator';
import { CreateRentalItemDto, UpdateRentalItemDto } from './dto';

@Controller('items')
export class RentalItemsController {
  constructor(private readonly items: RentalItemsService) {}

  @Public()
  @Get()
  list(
    @Query('featured') featured?: string,
    @Query('category') categorySlug?: string,
    @Query('limit') limit?: string,
  ) {
    return this.items.findAll({
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      categorySlug,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Public()
  @Get('availability')
  availability(
    @Query('date') date: string,
    @Query('ids') ids?: string,
  ) {
    const itemIds = ids ? ids.split(',').filter(Boolean) : undefined;
    return this.items.availabilityOn(date, itemIds);
  }

  @Public()
  @Get(':id')
  async getById(@Param('id') id: string) {
    const item = await this.items.findById(id);
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateRentalItemDto) {
    return this.items.create(dto);
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRentalItemDto) {
    return this.items.update(id, dto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.items.softDelete(id);
  }
}
