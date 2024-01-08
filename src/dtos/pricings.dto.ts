import { DeliveryUrgencyEnum } from '@/enums/delivery-urgency.enum';
import { VehicleEnum } from '@/enums/vehicle.enum';
import { IsEnum, IsNumber } from 'class-validator';

export class CreatePricingDto {
  @IsEnum(VehicleEnum)
  public vehicle: VehicleEnum;

  @IsEnum(DeliveryUrgencyEnum)
  public urgency: DeliveryUrgencyEnum;

  @IsNumber()
  public units: number;
}
