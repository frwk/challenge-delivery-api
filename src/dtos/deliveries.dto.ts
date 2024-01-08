import { DeliveryStatuses } from '@/enums/delivery-statuses.enum';
import { VehicleEnum } from '@/enums/vehicle.enum';
import { DeliveryUrgencyEnum } from '@/enums/delivery-urgency.enum';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsInt,
  Length,
  IsEnum,
  IsDateString,
  IsLatitude,
  IsLongitude,
  ValidateIf,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

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

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  notation: number;

  @IsNumber()
  clientId: number;

  @IsNumber()
  @IsOptional()
  courierId: number;

  @IsNumber()
  pricingId: number;

  @IsNumber()
  total: number;

  @IsEnum(VehicleEnum)
  vehicle: VehicleEnum;

  @IsEnum(DeliveryUrgencyEnum)
  urgency: DeliveryUrgencyEnum;
}

export class CreateDeliveryAsClientDto {
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
  @IsNotEmpty()
  pickupAddress: string;

  @IsString()
  @IsNotEmpty()
  dropoffAddress: string;

  @IsNumber()
  clientId: number;

  @IsEnum(VehicleEnum)
  vehicle: VehicleEnum;

  @IsEnum(DeliveryUrgencyEnum)
  urgency: DeliveryUrgencyEnum;
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

  @IsNotEmpty()
  vehicle: VehicleEnum;

  @IsNotEmpty()
  urgency: DeliveryUrgencyEnum;
}

export class DeliveryTotalDto {
  @IsString()
  @IsOptional()
  pickupAddress: string;

  @IsString()
  @IsOptional()
  dropoffAddress: string;

  @IsNotEmpty()
  vehicle: VehicleEnum;

  @IsNotEmpty()
  urgency: DeliveryUrgencyEnum;

  @IsNumber()
  @IsOptional()
  total: number;

  @IsNumber()
  @IsOptional()
  distance: number;

  @IsNumber()
  @IsOptional()
  duration: number;
}
