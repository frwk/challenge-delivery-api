import { DeliveryStatuses } from '@/enums/delivery-statuses.enum';
import { IsNotEmpty, IsString, IsNumber, IsDate, Length, IsEnum } from 'class-validator';

export class CreateDeliveryDto {
  @IsString()
  @IsNotEmpty()
  pickupLongitude: number;

  @IsString()
  @IsNotEmpty()
  pickupLatitude: number;

  @IsString()
  @IsNotEmpty()
  dropoffLongitude: number;

  @IsString()
  @IsNotEmpty()
  dropoffLatitude: number;

  @IsDate()
  pickupDate: Date;

  @IsDate()
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
  @IsString()
  @IsNotEmpty()
  pickupLongitude: string;

  @IsString()
  @IsNotEmpty()
  pickupLatitude: string;

  @IsString()
  @IsNotEmpty()
  dropoffLongitude: string;

  @IsString()
  @IsNotEmpty()
  dropoffLatitude: string;

  @IsDate()
  pickupDate: Date;

  @IsDate()
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
