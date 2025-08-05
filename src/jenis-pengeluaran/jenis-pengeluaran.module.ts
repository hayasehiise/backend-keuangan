import { Module } from '@nestjs/common';
import { JenisPengeluaranController } from './jenis-pengeluaran.controller';
import { PrismaService } from 'prisma/prisma.service';
import { JenisPengeluaranService } from './jenis-pengeluaran.service';

@Module({
  controllers: [JenisPengeluaranController],
  providers: [PrismaService, JenisPengeluaranService],
})
export class JenisPengeluaranModule {}
