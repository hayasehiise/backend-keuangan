import { Module } from '@nestjs/common';
import { TokoService } from './toko.service';
import { TokoController } from './toko.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [TokoController],
  providers: [TokoService, PrismaService],
})
export class TokoModule {}
