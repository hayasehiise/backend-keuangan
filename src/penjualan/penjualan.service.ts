/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreatePenjualanDto,
  QueryPenjualanDto,
  UpdatePenjualanDto,
} from './dto/penjualan.dto';

@Injectable()
export class PenjualanService {
  constructor(private prisma: PrismaService) {}

  private hitungTotal(harga: number, quantity: number, diskon: number): number {
    const hargaTotal = harga * quantity;
    const potongan = Math.floor((diskon / 100) * hargaTotal);
    return hargaTotal - potongan;
  }

  async create(rawData: CreatePenjualanDto) {
    const total = this.hitungTotal(
      rawData.harga,
      rawData.quantity,
      rawData.diskon,
    );
    await this.prisma.penjualan.create({
      data: { ...rawData, total },
    });

    return {
      message: 'Data Penjualan berhasil ditambahkan',
      statusCode: 200,
    };
  }

  async getPenjualan(query: QueryPenjualanDto) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.penjualan.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: {
              name: true,
              role: true,
            },
          },
          produk: {
            select: {
              nama: true,
              harga: true,
              stock: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),

      this.prisma.penjualan.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    };
  }

  async update(id: string, rawData: UpdatePenjualanDto) {
    const existing = await this.prisma.penjualan.findUnique({
      where: { id },
      include: { user: { select: { name: true, role: true } } },
    });
    if (!existing) {
      throw new NotFoundException('Data tidak ditemukan');
    }

    const harga = rawData.harga ?? existing?.harga;
    const quantity = rawData.quantity ?? existing?.quantity;
    const diskon = rawData.diskon ?? existing?.diskon;
    const total = this.hitungTotal(harga, quantity, diskon);
    await this.prisma.penjualan.update({
      where: { id },
      data: { ...rawData, total },
    });

    return {
      message: 'Data berhasil diupdate',
      statusCode: 200,
    };
  }

  async remove(id: string) {
    await this.prisma.penjualan.delete({
      where: { id },
    });

    return {
      message: 'Data berhasil dihapus',
      statucCOde: 200,
    };
  }
}
