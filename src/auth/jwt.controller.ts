/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './jwt.service';
import {
  LoginScheme,
  // RegisterScheme
} from './dto/auth.dto';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('register')
  // async register(@Body() body: any) {
  //   const parsed = RegisterScheme.safeParse(body);
  //   if (!parsed.success) throw parsed.error;
  //   return this.authService.register(parsed.data);
  // }

  @Post('login')
  async login(@Body() body: any) {
    const parsed = LoginScheme.safeParse(body);
    if (!parsed.success) throw parsed.error;
    const result = await this.authService.login(parsed.data);
    return result;
  }

  @Get('active')
  @UseGuards(JwtAuthGuard)
  getActive(@Request() req: any) {
    return req.user;
  }
}
