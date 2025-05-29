import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '@/users/users/users.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  private readonly logger = new Logger(GitHubStrategy.name);
  
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
      scope: ['user:email', 'read:user'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    try {
      this.logger.log(`GitHub OAuth profile: ${JSON.stringify(profile)}`);
      
      const { username, emails, id, displayName, photos } = profile;
      
      const user = await this.usersService.createOrUpdateOAuthUser({
        name: displayName || username,
        username: username || `github_${id}`,
        email: emails?.[0]?.value,
        provider: 'github',
        providerId: id,
        avatarUrl: photos?.[0]?.value,
      });
      
      this.logger.log(`GitHub OAuth user created/found: ${user.id}`);
      done(null, user);
    } catch (err) {
      this.logger.error(`GitHub OAuth validation error: ${err.message}`);
      done(err, null);
    }
  }
}
