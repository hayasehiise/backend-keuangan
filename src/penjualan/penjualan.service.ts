/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const produk = await this.prisma.produk.findUnique({
      where: { id: rawData.produkId },
    });

    if (!produk) throw new NotFoundException('Produk Tidak Ditemukan');
    if (produk.stock < rawData.quantity)
      throw new BadRequestException('Stock Produk anda tidak cukup');

    const harga = produk.harga;
    const total = this.hitungTotal(harga, rawData.quantity, rawData.diskon);

    const sisaProduk = produk.stock - rawData.quantity;
    const updateStatus = sisaProduk <= 0 ? 'HABIS' : produk.status;

    return this.prisma.$transaction(async (tx) => {
      await tx.produk.update({
        where: { id: produk.id },
        data: {
          stock: sisaProduk,
          status: updateStatus,
        },
      });
      await tx.penjualan.create({
        data: {
          ...rawData,
          harga,
          total,
        },
      });

      return {
        message: 'data penjualan berhasil diinput',
        statusCode: 200,
      };
    });
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

    const quantity = rawData.quantity ?? existing.quantity;
    const tempQuantity = quantity - existing.quantity;
    const diskon = rawData.diskon ?? existing.diskon;
    const produkId = rawData.produkId ?? existing.produkId;

    const produk = await this.prisma.produk.findUnique({
      where: { id: produkId },
    });

    if (!produk) throw new NotFoundException('Produk tidak ditemukan');
    const harga = produk.harga;
    const total = this.hitungTotal(harga, tempQuantity, diskon);

    const sisaStock = produk.stock - tempQuantity;
    const updateStatus = sisaStock <= 0 ? 'HABIS' : produk.status;

    return this.prisma.$transaction(async (tx) => {
      await tx.penjualan.update({
        where: { id },
        data: {
          ...rawData,
          harga,
          total,
        },
      });
      await tx.produk.update({
        where: { id: produk.id },
        data: {
          stock: sisaStock,
          status: updateStatus,
        },
      });

      return {
        message: 'Data penjualan berhasil diupdate',
        statusCode: 200,
      };
    });
  }

  async remove(id: string) {
    const penjualan = await this.prisma.penjualan.findUnique({
      where: { id },
      include: { produk: true },
    });
    if (!penjualan)
      throw new NotFoundException('Data penjualan tidak ditemukan');
    const produk = penjualan.produk;
    const updateStock = produk.stock + penjualan.quantity;

    const updateStatus =
      produk.status === 'HABIS' && updateStock > 0 ? 'TERSEDIA' : produk.status;

    return this.prisma.$transaction(async (tx) => {
      await tx.produk.update({
        where: { id: produk.id },
        data: {
          stock: updateStock,
          status: updateStatus,
        },
      });
      await tx.penjualan.delete({
        where: { id },
      });
      return {
        message: 'data penjualan berhasil dihapus',
        statusCode: 200,
      };
    });
  }
}
