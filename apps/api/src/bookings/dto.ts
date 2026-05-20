import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

const EVENT_TYPES = [
  'GUSABA',
  'GUKWA',
  'CIVIL',
  'RELIGIOUS',
  'RECEPTION',
  'OTHER',
] as const;
type EventType = (typeof EVENT_TYPES)[number];

const STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] as const;
type BookingStatus = (typeof STATUSES)[number];

export class CreateBookingDto {
  @IsDateString()
  eventDate!: string;

  @IsEnum(EVENT_TYPES)
  eventType!: EventType;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  rentalItemIds!: string[];

  @IsOptional()
  @IsString()
  @MinLength(1)
  notes?: string;
}

export class UpdateBookingStatusDto {
  @IsIn(STATUSES)
  status!: BookingStatus;
}
