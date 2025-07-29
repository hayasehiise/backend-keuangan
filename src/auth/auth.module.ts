import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthController } from './jwt.controller';
import { AuthService } from './jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'RAHASIA_JWT',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy],
})
export class AuthModule {}
