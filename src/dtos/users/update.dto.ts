import { Type } from 'class-transformer';
import { IsString, IsEmail, MinLength, MaxLength, IsOptional, ValidateNested, IsEnum, IsDecimal } from 'class-validator';
import { Roles } from '@/enums/roles.enum';
import { CourierStatuses } from '@/enums/courier-statuses.enum';
import { VehicleEnum } from '@/enums/vehicle.enum';

export class UpdateUserNestedCourierDto {
  @IsOptional()
  @IsEnum(CourierStatuses)
  public status: boolean;

  @IsOptional()
  @Type(() => String)
  @IsDecimal()
  public latitude: string;

  @IsOptional()
  @Type(() => String)
  @IsDecimal()
  public longitude: string;

  @IsOptional()
  @IsEnum(VehicleEnum)
  public vehicle: string;
}

export class UpdateUserAsAdminDto {
  @IsEmail()
  @IsOptional()
  public email: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(32)
  public firstName: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(32)
  public lastName: string;

  @IsOptional()
  @IsEnum(Roles)
  public role: string;

  @IsString()
  @IsOptional()
  @MinLength(9)
  @MaxLength(32)
  public password: string;

  @IsString()
  @IsOptional()
  public notificationToken: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserNestedCourierDto)
  courier: UpdateUserNestedCourierDto;
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  public email: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(32)
  public firstName: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(32)
  public lastName: string;

  @IsString()
  @IsOptional()
  @MinLength(9)
  @MaxLength(32)
  public password: string;

  @IsString()
  @IsOptional()
  public notificationToken: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserNestedCourierDto)
  courier: UpdateUserNestedCourierDto;
}

export class UpdateCourierNestedUserDto {
  @IsEmail()
  @IsOptional()
  public email: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(32)
  public firstName: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(32)
  public lastName: string;

  @IsString()
  @IsOptional()
  @MinLength(9)
  @MaxLength(32)
  public password: string;

  @IsString()
  @IsOptional()
  public notificationToken: string;
}

export class UpdateCourierDto {
  @IsOptional()
  @IsEnum(CourierStatuses)
  public status: boolean;

  @IsOptional()
  @Type(() => String)
  @IsDecimal()
  public latitude: string;

  @IsOptional()
  @Type(() => String)
  @IsDecimal()
  public longitude: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateCourierNestedUserDto)
  user: UpdateCourierNestedUserDto;
}
