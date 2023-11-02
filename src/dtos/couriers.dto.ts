import { Type } from 'class-transformer';
import { IsBoolean, IsDecimal, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { CourierStatuses } from '@/enums/courier-statuses.enum';

export class CreateCourierDto {
  @IsOptional()
  @IsEnum(CourierStatuses)
  public status: boolean;

  @IsDecimal()
  @IsOptional()
  public latitude: number;

  @IsDecimal()
  @IsOptional()
  public longitude: number;

  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}

export class UpdateCourierDto {
  @IsOptional()
  @IsEnum(CourierStatuses)
  public status: boolean;

  @IsOptional()
  @IsDecimal()
  public latitude: number;

  @IsOptional()
  @IsDecimal()
  public longitude: number;

  @ValidateNested()
  @Type(() => UpdateUserDto)
  user: UpdateUserDto;
}
