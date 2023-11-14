import { DeliveryStatuses } from '@/enums/delivery-statuses.enum';
import { IsNotEmpty, IsString, IsNumber, Length, IsEnum, IsDateString, IsDecimal, IsLatitude, IsLongitude } from 'class-validator';

export class CreateDeliveryDto {
  @IsLongitude()
  @IsNotEmpty()
  pickupLongitude: number;

  @IsLatitude()
  @IsNotEmpty()
  pickupLatitude: number;

  @IsLongitude()
  @IsNotEmpty()
  dropoffLongitude: number;

  @IsLatitude()
  @IsNotEmpty()
  dropoffLatitude: number;

  @IsDateString()
  pickupDate: Date;

  @IsDateString()
  dropoffDate: Date;

  @IsString()
  @Length(4, 4)
  confirmationCode: string;

  @IsEnum(DeliveryStatuses)
  status: string;

  @IsNumber()
  clientId: number;

  @IsNumber()
  courierId: number;
}

export class UpdateDeliveryDto {
  @IsLongitude()
  @IsNotEmpty()
  pickupLongitude: number;

  @IsLatitude()
  @IsNotEmpty()
  pickupLatitude: number;

  @IsLongitude()
  @IsNotEmpty()
  dropoffLongitude: number;

  @IsLatitude()
  @IsNotEmpty()
  dropoffLatitude: number;

  @IsDateString()
  pickupDate: Date;

  @IsDateString()
  dropoffDate: Date;

  @IsString()
  @Length(4, 4)
  confirmationCode: string;

  @IsEnum(DeliveryStatuses)
  status: string;

  @IsNumber()
  clientId: number;

  @IsNumber()
  courierId: number;
}
