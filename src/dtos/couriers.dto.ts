import { Type } from 'class-transformer';
import { IsBoolean, IsDecimal, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { SignupDto, UpdateUserDto } from './users.dto';
import { CourierStatuses } from '@/enums/courier-statuses.enum';

export class CreateCourierDto {
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

  @ValidateNested()
  @Type(() => SignupDto)
  user: SignupDto;
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
  @Type(() => UpdateUserDto)
  user: UpdateUserDto;
}
