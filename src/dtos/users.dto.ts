import { Type } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, IsOptional, ValidateNested, IsEnum } from 'class-validator';
import { UpdateCourierDto } from './couriers.dto';
import { Roles } from '@/enums/roles.enum';

export class SignupDto {
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

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}

export class LoginUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}

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
  @Type(() => UpdateCourierDto)
  courier: UpdateCourierDto;
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
  @Type(() => UpdateCourierDto)
  courier: UpdateCourierDto;
}
