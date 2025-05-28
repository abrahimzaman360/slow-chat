import { Injectable } from '@nestjs/common';
import { UsersService } from '@/users/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { User } from '@/schema/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {
    console.log('AuthService initialized');
  }

  async validateUser(data: LoginDto): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByIdentity(data.identity);
    if (user && user.password && await bcrypt.compare(data.password, user.password)) {
      // exclude password from returned user object
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async createUser(data: RegisterDto): Promise<User> {
    return this.usersService.createUser(data);
  }

  async login(user: User) {
    return {
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }
}
