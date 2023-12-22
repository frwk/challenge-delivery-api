import { DeliveryStatuses } from '@/enums/delivery-statuses.enum';
import { IsNotEmpty, IsString, IsNumber, Length, IsEnum, IsDateString, IsLatitude, IsLongitude, ValidateIf, IsOptional } from 'class-validator';

export class CreateDeliveryDto {
  @IsLongitude()
  @IsNotEmpty()
  @ValidateIf(o => !o.pickupAddress)
  pickupLongitude: number;

  @IsLatitude()
  @IsNotEmpty()
  @ValidateIf(o => !o.pickupAddress)
  pickupLatitude: number;

  @IsLongitude()
  @IsNotEmpty()
  @ValidateIf(o => !o.dropoffAddress)
  dropoffLongitude: number;

  @IsLatitude()
  @IsNotEmpty()
  @ValidateIf(o => !o.dropoffAddress)
  dropoffLatitude: number;

  @IsString()
  @IsOptional()
  pickupAddress: string;

  @IsString()
  @IsOptional()
  dropoffAddress: string;

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
  @IsOptional()
  pickupLongitude: number;

  @IsLatitude()
  @IsOptional()
  pickupLatitude: number;

  @IsLongitude()
  @IsOptional()
  dropoffLongitude: number;

  @IsLatitude()
  @IsOptional()
  dropoffLatitude: number;

  @IsDateString()
  @IsOptional()
  pickupDate: Date;

  @IsDateString()
  @IsOptional()
  dropoffDate: Date;

  @IsString()
  @Length(4, 4)
  @IsOptional()
  confirmationCode: string;

  @IsEnum(DeliveryStatuses)
  @IsOptional()
  status: string;

  @IsNumber()
  @IsOptional()
  clientId: number;

  @IsNumber()
  @IsOptional()
  courierId: number;
}
