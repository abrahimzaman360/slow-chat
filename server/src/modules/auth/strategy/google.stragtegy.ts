import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { UsersService } from '@/users/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
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
    const { id, displayName, emails } = profile;
    try {
      const user = await this.usersService.createOrUpdateOAuthUser({
        provider: 'google',
        providerId: id,
        email: emails?.[0]?.value,
        username: displayName || emails?.[0]?.value?.split('@')[0],
      });
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
