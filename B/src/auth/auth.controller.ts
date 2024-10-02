import { Controller, Post, Body, Get, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { UserRoles } from './dto/user-role.enum';
import { UserProvider } from './dto/user-provider.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const { provider, role } = registerDto;

    if (!Object.values(UserRoles).includes(role)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid role' });
    }

    if (!Object.values(UserProvider).includes(provider)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid provider' });
    }
    try {
      const result = await this.authService.register(registerDto);
      if (result.error) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Registration failed ' + result.message });
      }
      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'Registration successful' });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get('oauth/google')
  async googleLogin() {
    return { message: 'Redirect to Google OAuth' };
  }
}
