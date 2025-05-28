import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { UsersService } from '@/users/users/users.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
      scope: ['user:email', 'read:user'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    const { username, emails, id } = profile;
    try {
      const user = await this.usersService.createOrUpdateOAuthUser({
        username,
        email: emails?.[0]?.value,
        provider: 'github',
        providerId: id,
      });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
}
