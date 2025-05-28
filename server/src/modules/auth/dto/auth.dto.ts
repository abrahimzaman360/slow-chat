// auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from '@/users/dto/create-user.dto';

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

export class RegisterDto extends CreateUserDto {
  constructor(partial: Partial<RegisterDto>) {
    super();
    Object.assign(this, partial);
    this._atLeastOne = this.username || this.email || '';
  }
}
