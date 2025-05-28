import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  ValidateIf,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'AtLeastOneUsernameOrEmail', async: false })
class AtLeastOneUsernameOrEmail implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    return !!(obj.username || obj.email);
  }

  defaultMessage(_: ValidationArguments) {
    return 'Either username or email must be provided';
  }
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe' })
  name: string;
  
  @IsString()
  @ValidateIf((o) => o.username !== undefined)
  @IsNotEmpty()
  @ApiProperty({ example: 'mrtux360' })
  username: string;

  @IsString()
  @ValidateIf((o) => o.email !== undefined)
  @IsNotEmpty()
  @ApiProperty({ example: 'mrtux360@gmail.com' })
  email: string;

  @IsPhoneNumber(undefined, { message: 'Invalid phone number' })
  @IsNotEmpty()
  @ApiProperty({ example: '+1234567890' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @Validate(AtLeastOneUsernameOrEmail)
  _atLeastOne: string; // dummy property just to trigger class-level validation
}
