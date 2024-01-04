import { IsString, IsEmail, MinLength, MaxLength, IsOptional, ValidateNested, IsEnum, IsDecimal } from 'class-validator';
import { Roles } from '@/enums/roles.enum';
import { CourierStatuses } from '@/enums/courier-statuses.enum';

export class VerifyPasswordDto {
  @IsString()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}
