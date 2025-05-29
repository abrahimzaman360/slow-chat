import { Injectable, Logger } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@/schema/user.entity';
import { UsersService } from '@/users/users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  private readonly logger = new Logger(SessionSerializer.name);
  constructor(private usersService: UsersService) {
    super();
  }

  serializeUser(user: User, done: (err: Error | null, user: any) => void): void {
    // Store only user id in session
    done(null, user.id);
  }

  async deserializeUser(
    id: string,
    done: (err: Error | null, user: any) => void,
  ): Promise<void> {
    try {
      const user = await this.usersService.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
}
