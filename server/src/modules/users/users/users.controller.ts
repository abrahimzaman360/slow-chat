import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.ACCEPTED)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.createUser(createUserDto);
      return { success: true, user };
    } catch (error) {
      switch (error.code) {
        case 11000:
          return { success: false, message: "  User already exists!" };
        default:
          return { success: false, message: 'Internal server error!' };
      }
    }
  }
}
