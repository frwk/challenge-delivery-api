import { DeliveryStatuses } from '@/enums/delivery-statuses.enum';
import { IsNotEmpty, IsString, IsNumber, IsDate, Length, IsEnum } from 'class-validator';

export class CreateDeliveryDto {
  @IsString()
  @IsNotEmpty()
  pickup: string;

  @IsString()
  @IsNotEmpty()
  dropoff: string;

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
  pickup: string;

  @IsString()
  @IsNotEmpty()
  dropoff: string;

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
