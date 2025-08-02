import { Module } from '@nestjs/common';
import { PenjualanService } from './penjualan.service';
import { PenjualanController } from './penjualan.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [PenjualanController],
  providers: [PrismaService, PenjualanService],
})
export class PenjualanModule {}
