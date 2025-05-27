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

@Module({
  imports: [
    UsersModule, 
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([User])
  ],
  providers: [AuthService, LocalStrategy, SessionSerializer, AuthenticatedGuard],
  controllers: [AuthController],
  exports: [AuthenticatedGuard], // Export if used in other modules
})
export class AuthModule {}