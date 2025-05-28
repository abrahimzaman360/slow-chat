// auth/auth.controller.ts
import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Logger,
  UseGuards,
  Get,
  Req,
  Res,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from '../dto/auth.dto';
import {
  AuthenticatedGuard,
  LocalAuthGuard,
  NotLoggedInGuard,
} from '../utility/auth.guard';
import { Request, Response } from 'express';
import { User } from '@/schema/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  signIn(@Req() req: Request) {
    const user = req.user as User;

    if (!user) {
      throw new UnauthorizedException('Login failed');
    }

    return new Promise((resolve, reject) => {
      req.logIn(user, (err) => {
        if (err) {
          return reject(new UnauthorizedException('Login failed'));
        }

        this.logger.log(`User ${user.username} logged in successfully`);
        return resolve({
          message: 'Login successful',
          user,
          timestamp: new Date().toISOString(),
        });
      });
    });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log(`Register attempt with username: ${registerDto.username}`);

    try {
      const user = await this.authService.createUser(registerDto);
      return {
        message: 'User registered successfully',
        user: {
          username: user.username,
          email: user.email,
          phone: user.phone,
        },
      };
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`);

      switch (error.message) {
        case 'User already exists':
          throw new HttpException(
            'User already exists',
            HttpStatus.BAD_REQUEST,
          );
        default:
          throw new HttpException(
            'Registration failed',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }

  @Get('me')
  @UseGuards(AuthenticatedGuard)
  getMe(@Req() req: Request) {
    const user = req.user as User;
    this.logger.log(`Get me request for user: ${user.username}`);
    return {
      user,
      authenticated: true,
      timestamp: new Date().toISOString(),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    req.logout((err) => {
      if (err) return res.status(500).json({ message: 'Logout failed' });

      req.session.destroy((err) => {
        if (err)
          return res.status(500).json({ message: 'Session cleanup failed' });

        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
      });
    });
  }

  @Get('status')
  checkStatus(@Req() req: Request) {
    this.logger.log(`Status check - Session ID: ${req.sessionID}`);
    this.logger.log(
      `Status check - Is authenticated: ${req.isAuthenticated()}`,
    );
    return {
      authenticated: req.isAuthenticated(),
      user: req.isAuthenticated() ? req.user : null,
      sessionId: req.sessionID,
    };
  }

  // OAuth Routes:
  @Get('google')
  @UseGuards(NotLoggedInGuard, AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(NotLoggedInGuard, AuthGuard('google'))
  googleCallback(@Req() req: Request, @Res() res: Response) {
    // You can save user info to DB here or return a JWT
    return res.redirect('http://localhost:3001');
  }

  @Get('github')
  @UseGuards(NotLoggedInGuard, AuthGuard('github'))
  async githubAuth() {}

  @Get('github/callback')
  @UseGuards(NotLoggedInGuard, AuthGuard('github'))
  githubCallback(@Req() req: Request, @Res() res: Response) {
    return res.redirect('http://localhost:3001');
  }
}
