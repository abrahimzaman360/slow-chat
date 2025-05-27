import { IsString, IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber(undefined, { message: 'Invalid phone number' })
  phoneNumber: string;

  @IsString()
  @MinLength(6)
  password: string;
}
