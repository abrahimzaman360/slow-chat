import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  private readonly logger = new Logger(LocalAuthGuard.name);

  handleRequest(err: any, user: any, info: any, context: any) {
    this.logger.log(`LocalAuthGuard - Error: ${JSON.stringify(err)}`);
    this.logger.log(`LocalAuthGuard - User: ${JSON.stringify(user)}`);
    this.logger.log(`LocalAuthGuard - Info: ${JSON.stringify(info)}`);

    if (err || !user) {
      this.logger.error(`Authentication failed: ${err?.message || info?.message || 'Unknown error'}`);
      throw err || new Error(info?.message || 'Authentication failed');
    }

    this.logger.log(`Authentication successful for user: ${user.username}`);
    return user;
  }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated();
  }
}
