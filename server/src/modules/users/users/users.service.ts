// src/users/users/users.service.ts
import { Injectable, Logger, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '@/schema/user.entity';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;

    const exists = await this.userRepository.findOne({
      where: [{ email: rest.email }, { username: rest.username }],
    });

    if (exists) {
      throw new ConflictException('User already exists');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = this.userRepository.create({
        ...rest,
        password: hashedPassword,
      });

      const savedUser = await this.userRepository.save(newUser);
      this.logger.log(`User created: ${savedUser.username}`);
      return savedUser;
    } catch (error) {
      this.logger.error(`Error creating user: ${error}`);
      throw error;
    }
  }

  async createOrUpdateOAuthUser(profile: {
    name?: string;
    email?: string;
    username?: string;
    provider: 'google' | 'github';
    providerId: string;
    avatarUrl?: string;
  }): Promise<User> {
    try {
      this.logger.log(
        `Creating/updating OAuth user: ${JSON.stringify(profile)}`,
      );

      // First try to find by OAuth provider and ID
      let existing = await this.userRepository.findOne({
        where: {
          oauthProvider: profile.provider,
          oauthProviderId: profile.providerId,
        },
      });

      if (existing) {
        this.logger.log(`Found existing OAuth user: ${existing.id}`);
        // Update avatar URL if provided
        if (profile.avatarUrl && !existing.avatarUrl) {
          existing.avatarUrl = profile.avatarUrl;
          await this.userRepository.save(existing);
        }
        return existing;
      }

      // If not found by OAuth, try by email
      if (profile.email) {
        existing = await this.userRepository.findOne({
          where: { email: profile.email },
        });

        if (existing) {
          this.logger.log(
            `Found existing user by email, linking OAuth: ${existing.id}`,
          );
          // Link OAuth to existing account
          existing.oauthProvider = profile.provider;
          existing.oauthProviderId = profile.providerId;
          if (profile.avatarUrl) {
            existing.avatarUrl = profile.avatarUrl;
          }
          return await this.userRepository.save(existing);
        }
      }

      // Create a unique username if needed
      let username = profile.username;
      if (!username) {
        username = profile.email
          ? profile.email.split('@')[0]
          : `${profile.provider}_${profile.providerId}`;
      }

      // Check if username exists and make it unique if needed
      const usernameExists = await this.userRepository.findOne({
        where: { username },
      });

      if (usernameExists) {
        username = `${username}_${Math.floor(Math.random() * 1000)}`;
      }

      // Create new user
      this.logger.log(`Creating new OAuth user with username: ${username}`);
      const newUser = this.userRepository.create({
        name: profile.name,
        email: profile.email,
        username,
        password: null, // OAuth users don't have passwords
        oauthProvider: profile.provider,
        oauthProviderId: profile.providerId,
        avatarUrl: profile.avatarUrl,
      });

      const savedUser = await this.userRepository.save(newUser);
      this.logger.log(`New OAuth user created: ${savedUser.id}`);
      return savedUser;
    } catch (error) {
      this.logger.error(`Error creating/updating OAuth user: ${error.message}`);
      throw error;
    }
  }

  async findByIdentity(identity: string): Promise<User | null> {
    this.logger.log(`Finding user by identity: ${identity}`);
    return this.userRepository.findOne({
      where: [{ email: identity }, { username: identity }],
    })
  }

  async findByPhoneNumber(phone: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { phone },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async validateUser(identity: string, password: string): Promise<User | null> {
    const user = await this.findByIdentity(identity);
    if (!user || !user.password) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  async findByRememberMeToken(token: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { rememberMeToken: token },
    });
  }

  async generateRememberMeToken(userId: string): Promise<string> {
    const token = uuidv7();
    await this.userRepository.update(userId, { rememberMeToken: token });
    return token;
  }

  async updateRememberMeToken(
    userId: string,
    token: string | null,
  ): Promise<void> {
    await this.userRepository.update(userId, {
      rememberMeToken: token ?? undefined,
    });
  }

  async updateTwoFactor(
    id: string,
    secret: string | null,
    enabled: boolean,
  ): Promise<void> {
    await this.userRepository.update(id, {
      twoFactorSecret: secret!,
      twoFactorEnabled: enabled,
    });
  }
}
