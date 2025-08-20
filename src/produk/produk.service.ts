/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateProdukDto,
  UpdateProdukDto,
  QueryProdukDto,
} from './dto/produk.dto';

@Injectable()
export class ProdukService {
  constructor(private prisma: PrismaService) {}

  async create(rawData: CreateProdukDto, user: any) {
    const status = rawData.stock <= 0 ? 'HABIS' : 'TERSEDIA';
    const tokoId = user.tokoId;
    await this.prisma.produk.create({ data: { ...rawData, status, tokoId } });

    return {
      message: 'data produk berhasil diinput',
      statusCode: 200,
    };
  }

  async getProduk(query: QueryProdukDto, user: any) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;
    const where = {
      ...(search && {
        nama: {
          contains: search,
        },
      }),
      ...(user.role !== 'ADMIN' && user.tokoId && { tokoId: user.tokoId }),
    };

    const [data, total] = await Promise.all([
      this.prisma.produk.findMany({
        where,
        skip,
        take: limit,
        include: {
          toko: {
            select: {
              nama: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.produk.count(),
    ]);
    return {
      data,
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    };
  }

  async getByTokoId(tokoId: string) {
    const where = tokoId ? { tokoId } : {};
    const data = await this.prisma.produk.findMany({
      where,
      select: {
        id: true,
        nama: true,
        harga: true,
        stock: true,
        status: true,
      },
      orderBy: { nama: 'asc' },
    });

    return {
      data,
    };
  }

  findOne(id: string) {
    return this.prisma.produk.findUnique({ where: { id } });
  }

  async update(id: string, rawData: UpdateProdukDto) {
    const updateData: any = { ...rawData };

    // Hanya update status jika stock ada di rawData
    if (rawData.stock !== undefined) {
      const status = rawData.stock <= 0 ? 'HABIS' : 'TERSEDIA';
      updateData.status = status;
    }

    await this.prisma.produk.update({
      where: { id },
      data: updateData,
    });

    return {
      message: 'Data Produk berhasil diupdate',
      statusCode: 200,
    };
  }

  async remove(id: string) {
    await this.prisma.produk.delete({ where: { id } });
    return {
      message: 'Data Produk berhasil dihapus',
      statusCode: 200,
    };
  }
}
