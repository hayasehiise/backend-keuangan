/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    // super({
    //   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //   secretOrKey: process.env.JWT_SECRET || 'RAHASIA_JWT',
    // });
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req.cookies?.access_token,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'RAHASIA_JWT',
    });
  }

  async validate(payload: { sub: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    };
  }
}
