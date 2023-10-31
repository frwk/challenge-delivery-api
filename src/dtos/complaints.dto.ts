import { ComplaintStatuses } from '@/enums/complaint-statuses.enum';
import { IsEnum, IsNumber } from 'class-validator';

export class CreateComplaintDto {
  @IsNumber()
  public deliveryId: number;

  @IsNumber()
  public userId: number;
}

export class UpdateComplaintDto {
  @IsNumber()
  public deliveryId: number;

  @IsNumber()
  public userId: number;

  @IsEnum(ComplaintStatuses)
  public status: ComplaintStatuses;
}
