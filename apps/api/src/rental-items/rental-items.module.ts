import { Module } from '@nestjs/common';
import { RentalItemsController } from './rental-items.controller';
import { RentalItemsService } from './rental-items.service';

@Module({
  controllers: [RentalItemsController],
  providers: [RentalItemsService],
})
export class RentalItemsModule {}
