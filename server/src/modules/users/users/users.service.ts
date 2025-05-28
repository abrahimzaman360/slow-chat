import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '@/schema/user.entity'; // adjust path if needed

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
      throw new Error('User already exists');
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
    email?: string;
    username?: string;
    provider: 'google' | 'github';
    providerId: string;
  }): Promise<User> {
    // First check if user exists by providerId + provider
    let existing = await this.userRepository.findOne({
      where: {
        oauthProvider: profile.provider,
        oauthProviderId: profile.providerId,
      },
    });

    if (!existing) {
      // Try find by email or username as fallback
      existing = await this.userRepository.findOne({
        where: [{ email: profile.email }, { username: profile.username }],
      });
    }

    if (existing) {
      // Update provider info if missing
      if (!existing.oauthProvider || !existing.oauthProviderId) {
        existing.oauthProvider = profile.provider;
        existing.oauthProviderId = profile.providerId;
        await this.userRepository.save(existing);
      }
      return existing;
    }

    // Create new user with OAuth info
    const newUser = this.userRepository.create({
      email: profile.email,
      username: profile.username || `user-${profile.providerId}`,
      password: null,
      oauthProvider: profile.provider,
      oauthProviderId: profile.providerId,
    });

    return this.userRepository.save(newUser);
  }

  // Find by Email or Username
  async findByIdentity(identity: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: [{ email: identity }, { username: identity }],
    });
  }

  // Find by Phone Number
  async findByPhoneNumber(phone: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { phone },
    });
  }

  // Find by Unique UiD
  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  // Validate User
  async validateUser(identity: string, password: string): Promise<User | null> {
    const user = await this.findByIdentity(identity);
    if (!user || !user.password) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }
}
