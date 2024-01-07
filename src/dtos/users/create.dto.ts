import { Type } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, IsOptional, ValidateNested, IsEnum, IsDecimal } from 'class-validator';
import { Roles } from '@/enums/roles.enum';
import { CourierStatuses } from '@/enums/courier-statuses.enum';
import { SignupDto } from '../auth.dto';
import { VehicleEnum } from '@/enums/vehicle.enum';

export class CreateUserAsAdminDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(32)
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(32)
  public lastName: string;

  @IsOptional()
  @IsEnum(Roles)
  public role: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;

  @IsString()
  @IsOptional()
  public notificationToken: string;
}

export class CreateCourierDto {
  @IsOptional()
  @IsEnum(CourierStatuses)
  public status: string;

  @IsOptional()
  @Type(() => String)
  @IsDecimal()
  public latitude: string;

  @IsOptional()
  @Type(() => String)
  @IsDecimal()
  public longitude: string;

  @IsEnum(VehicleEnum)
  public vehicle: string;

  @ValidateNested()
  @Type(() => SignupDto)
  user: SignupDto;
}
