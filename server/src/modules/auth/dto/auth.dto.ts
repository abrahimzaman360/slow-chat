// auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'mrtux360' })
  identity: string; // username or email

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  @ApiProperty({ example: 'mrtux360' })
  password: string;
}

export  class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'mrtux360' })
  username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'abrahimzaman3@gmail.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '07033672000' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  @ApiProperty({ example: 'mrtux360' })
  password: string;
}
