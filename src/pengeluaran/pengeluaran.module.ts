import { Module } from '@nestjs/common';
import { PengeluaranService } from './pengeluaran.service';
import { PengeluaranController } from './pengeluaran.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [PengeluaranController],
  providers: [PengeluaranService, PrismaService],
})
export class PengeluaranModule {}
