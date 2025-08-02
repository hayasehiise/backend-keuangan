/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
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
  async login(data: LoginDto) {
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

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    };
  }
}
