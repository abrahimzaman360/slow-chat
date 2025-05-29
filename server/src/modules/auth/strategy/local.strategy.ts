import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);
  constructor(private authService: AuthService) {
    super({
      usernameField: 'identity', // Use 'identity' instead of 'username'
      passwordField: 'password',
    });
  }

  async validate(identity: string, password: string): Promise<any> {
    const user = await this.authService.validateUser({ identity, password });

    this.logger.debug(`Validating user: ${identity}`);

    if (!user) {
      throw new UnauthorizedException('User credentials are not valid!');
    }
    return user;
  }
}
