import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import {
  JwtAuthGuard,
  CurrentUser,
  AuthRegisterDto,
  AuthLoginDto,
  AuthRefreshTokenDto,
  AuthForgotPasswordDto,
  AuthForgotPasswordPhoneDto,
  AuthChangePasswordDto,
  AuthVerifyPhoneDto,
} from '@app/common';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  async register(@Body() dto: AuthRegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'User login' })
  async login(@Body() dto: AuthLoginDto, @Req() req: any) {
    return this.authService.login(dto, req.ip, req.headers['user-agent']);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  async logout(@CurrentUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() dto: AuthRefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('forgot-password')
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'Request password reset via email' })
  async forgotPassword(@Body() dto: AuthForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('forgot-password-phone')
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'Request password reset via phone' })
  async forgotPasswordPhone(@Body() dto: AuthForgotPasswordPhoneDto) {
    return this.authService.forgotPasswordPhone(dto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password' })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: AuthChangePasswordDto,
  ) {
    return this.authService.changePassword(userId, dto);
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'Verify email address' })
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('verify-phone')
  @ApiOperation({ summary: 'Verify phone number' })
  async verifyPhone(@Body() dto: AuthVerifyPhoneDto) {
    return this.authService.verifyPhone(dto);
  }
}
