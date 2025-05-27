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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from '../dto/auth.dto';
import { AuthenticatedGuard, LocalAuthGuard } from '../utility/auth.guard';
import { Request, Response } from 'express';
import { User } from '@/schema/user.entity';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  signIn(@Req() req: Request, @Body() loginDto: LoginDto) {
    
    this.logger.log(`Login attempt for username: ${loginDto.identity}`);

    // Login
    req.logIn(req.user as User, (err: any) => {
      if (err) {
        this.logger.error(`Error logging in: ${err.message}`);
        throw err;
      }
      this.logger.log(`User ${req.user} logged in successfully`);
    }); 

    return { 
      message: 'Login successful', 
      user: req.user,
      timestamp: new Date().toISOString()
    };
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
          phoneNumber: user.phoneNumber
        }
      };
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    const user = req.user as User;
    this.logger.log(`Get me request for user: ${user.username}`);
    return {
      user,
      authenticated: true,
      timestamp: new Date().toISOString()
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    req.logout((err) => {
      if (err) {
        this.logger.error('Logout error:', err);
        return res.status(500).json({ message: 'Logout failed' });
      }
      
      req.session.destroy((err) => {
        if (err) {
          this.logger.error('Session destruction error:', err);
          return res.status(500).json({ message: 'Session cleanup failed' });
        }
        res.clearCookie('connect.sid');
        this.logger.log('User logged out successfully');
        res.json({ message: 'Logged out successfully' });
      });
    });
  }

  @Get('status')
  checkStatus(@Req() req: Request) {
    this.logger.log(`Status check - Session ID: ${req.sessionID}`);
    this.logger.log(`Status check - Is authenticated: ${req.isAuthenticated()}`);
    return {
      authenticated: req.isAuthenticated(),
      user: req.isAuthenticated() ? req.user : null,
      sessionId: req.sessionID
    };
  }
}