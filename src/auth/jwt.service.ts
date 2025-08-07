import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}
  async register(data: RegisterDto) {
    const exist = await this.prisma.user.findUnique({
      where: {
        username: data.username,
      },
    });
    if (exist) throw new Error('username telah digunakan');

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        password: hashed,
        role: data.role,
      },
    });

    return {
      message: 'Berhasil Register',
      user: { id: user.id, usernname: user.username, role: user.role },
    };
  }
  async login(data: LoginDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { username: data.username },
    });
    if (!user) throw new UnauthorizedException('Akun tidak ditemukan');

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) throw new UnauthorizedException('Akun tidak ditemukan');

    const token = this.jwt.sign({
      sub: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: this.configService.get<boolean>('APP_PRODUCTION'),
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return {
      // accessToken: token,
      message: 'Berhasil Login',
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    };
  }
}
