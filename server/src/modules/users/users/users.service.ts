import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schema/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const createdUser = new this.userModel({
        ...rest,
        password: hashedPassword,
      });

      // Log the successful creation of the user
      this.logger.log(`User created: ${JSON.stringify(createdUser)}`);

      return createdUser.save();
    } catch (error) {
      this.logger.error(`Error creating user: ${error}`);
      throw error;
    }
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.userModel.findOne({ phoneNumber }).exec();
  }

  // add more user-related methods as needed
}
