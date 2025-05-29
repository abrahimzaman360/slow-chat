// src/auth/auth.service.ts
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/users/users/users.service';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { User } from '@/schema/user.entity';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
  ) {
    console.log('AuthService initialized');
  }

  async validateOAuthUser(profile: {
    provider: 'google' | 'github';
    providerId: string;
    email?: string;
    username?: string;
    name?: string;
  }): Promise<User> {
    return this.usersService.createOrUpdateOAuthUser(profile);
  }

  async createUser(data: RegisterDto): Promise<User> {
    return this.usersService.createUser(data);
  }

  async findById(id: string): Promise<User | null> {
    return this.usersService.findById(id);
  }

  async validateUser(data: LoginDto): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.validateUser(data.identity, data.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(
    user: User,
    rememberMe: boolean = false,
  ): Promise<{ requires2FA?: boolean; message: string; user: Partial<User> }> {
    if (user.twoFactorEnabled) {
      return {
        requires2FA: true,
        message: '2FA required',
        user: { id: user.id, username: user.username, email: user.email },
      };
    }
    if (rememberMe) {
      const token = uuidv7();
      await this.usersService.updateRememberMeToken(user.id, token);
    }
    return {
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email },
    };
  }

  async updateTwoFactor(
    userId: string,
    secret: string | null,
    enabled: boolean,
  ): Promise<void> {
    return this.usersService.updateTwoFactor(userId, secret, enabled);
  }
}
