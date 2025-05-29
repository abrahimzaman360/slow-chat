// src/auth/auth.controller.ts
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
  Session,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../dto/auth.dto';
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
      throw new UnauthorizedException('Unauthorized Access Failed!');
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
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      authenticated: true,
      timestamp: new Date().toISOString(),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      this.logger.log('Logout attempt');

      // Check if authenticated
      if (!req.isAuthenticated()) {
        this.logger.log('Logout: Not authenticated');
        return res.status(200).json({ message: 'Not authenticated' });
      }

      const username = (req.user as User)?.username;

      req.logout((err) => {
        if (err) {
          this.logger.error(`Logout error: ${err.message}`);
          return res.status(500).json({ message: 'Logout failed' });
        }

        req.session.destroy((err) => {
          if (err) {
            this.logger.error(`Session destroy error: ${err.message}`);
            return res.status(500).json({ message: 'Session cleanup failed' });
          }

          res.clearCookie('connect.sid');
          this.logger.log(`User ${username} logged out successfully`);
          return res.json({ message: 'Logged out successfully' });
        });
      });
    } catch (error) {
      this.logger.error(`Logout error: ${error.message}`);
      return res.status(500).json({ message: 'Logout failed' });
    }
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

  @Get('google')
  @UseGuards(NotLoggedInGuard, AuthGuard('google'))
  async googleAuth() {}

  @Get('github')
  @UseGuards(NotLoggedInGuard, AuthGuard('github'))
  async githubAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Session() session: any,
  ) {
    try {
      const user = req.user as User;

      if (!user) {
        this.logger.error('Google OAuth callback: No user found');
        return res.redirect(
          `${process.env.CLIENT_URL || 'http://localhost:3001'}/auth/login?error_code=oauth_failed_404`,
        );
      }

      this.logger.log(`Google OAuth callback for user: ${user.username}`);

      const result = await this.authService.login(user, false);
      if (result.requires2FA) {
        session.pending2FA = true;
        session.userId = user.id;
        return res.redirect(
          `${process.env.CLIENT_URL || 'http://localhost:3001'}/2fa`,
        );
      }

      session.pending2FA = false;

      // Use a promise to handle the async login
      await new Promise<void>((resolve, reject) => {
        req.login(user, (err) => {
          if (err) {
            this.logger.error(`Google OAuth login error: ${err.message}`);
            reject(err);
            return;
          }
          resolve();
        });
      });

      this.logger.log(
        `Google OAuth login successful for user: ${user.username}`,
      );
      return res.redirect(
        `${process.env.CLIENT_URL || 'http://localhost:3001'}/messages`,
      );
    } catch (error) {
      this.logger.error(`Google OAuth callback error: ${error.message}`);
      return res.redirect(
        `${process.env.CLIENT_URL || 'http://localhost:3001'}/auth/login?error_code=oauth_failed`,
      );
    }
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Session() session: any,
  ) {
    try {
      const user = req.user as User;
      if (!user) {
        this.logger.error('GitHub OAuth callback: No user found');
        return res.redirect(
          `${process.env.CLIENT_URL || 'http://localhost:3001'}/auth/login?error_code=oauth_failed_404`,
        );
      }

      this.logger.log(`GitHub OAuth callback for user: ${user.username}`);

      const result = await this.authService.login(user, false);
      if (result.requires2FA) {
        session.pending2FA = true;
        session.userId = user.id;
        return res.redirect(
          `${process.env.CLIENT_URL || 'http://localhost:3001'}/2fa`,
        );
      }

      session.pending2FA = false;

      // Use a promise to handle the async login
      await new Promise<void>((resolve, reject) => {
        req.login(user, (err) => {
          if (err) {
            this.logger.error(`GitHub OAuth login error: ${err.message}`);
            reject(err);
            return;
          }
          resolve();
        });
      });

      this.logger.log(
        `GitHub OAuth login successful for user: ${user.username}`,
      );
      return res.redirect(
        `${process.env.CLIENT_URL || 'http://localhost:3001'}/messages`,
      );
    } catch (error) {
      this.logger.error(`GitHub OAuth callback error: ${error.message}`);
      return res.redirect(
        `${process.env.CLIENT_URL || 'http://localhost:3001'}/auth/login?error_code=oauth_failed`,
      );
    }
  }
}
