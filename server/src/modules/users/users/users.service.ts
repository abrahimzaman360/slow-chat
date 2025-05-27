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

  async findByIdentity(identity: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: [
        { email: identity },
        { username: identity },
      ],
    });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { phoneNumber },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async validateUser(identity: string, password: string): Promise<User | null> {
    const user = await this.findByIdentity(identity);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }
}