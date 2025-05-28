import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UsersModule } from '@/users/users.module';
import { LocalStrategy } from './strategy/local.strategy';
import { SessionSerializer } from './utility/session.serializer';
import { PassportModule } from '@nestjs/passport';
import { User } from '@/schema/user.entity';
import { AuthenticatedGuard } from './utility/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleStrategy } from './strategy/google.stragtegy';
import { GitHubStrategy } from './strategy/github.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    SessionSerializer,
    AuthenticatedGuard,
    GoogleStrategy,
    GitHubStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthenticatedGuard], // Export if used in other modules
})
export class AuthModule {}
