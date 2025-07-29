import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './jwt.service';
import { LoginScheme, RegisterScheme } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    const parsed = RegisterScheme.safeParse(body);
    if (!parsed.success) throw parsed.error;
    return this.authService.register(parsed.data);
  }

  @Post('login')
  async login(@Body() body: any) {
    const parsed = LoginScheme.safeParse(body);
    if (!parsed.success) throw parsed.error;
    return this.authService.login(parsed.data);
  }
}
