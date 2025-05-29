import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '@/users/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);
  
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      this.logger.log(`Google OAuth profile: ${JSON.stringify(profile)}`);
      
      const { id, displayName, emails, photos } = profile;
      
      const user = await this.usersService.createOrUpdateOAuthUser({
        provider: 'google',
        providerId: id,
        name: displayName,
        email: emails?.[0]?.value,
        username: emails?.[0]?.value?.split('@')[0] || `google_${id}`,
        avatarUrl: photos?.[0]?.value,
      });
      
      this.logger.log(`Google OAuth user created/found: ${user.id}`);
      done(null, user);
    } catch (error) {
      this.logger.error(`Google OAuth validation error: ${error.message}`);
      done(error, false);
    }
  }
}
