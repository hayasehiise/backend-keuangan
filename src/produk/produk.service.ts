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

  async create(rawData: CreateProdukDto) {
    const status = rawData.stock <= 0 ? 'HABIS' : 'TERSEDIA';
    await this.prisma.produk.create({ data: { ...rawData, status } });

    return {
      message: 'data produk berhasil diinput',
      statusCode: 200,
    };
  }

  async getProduk(query: QueryProdukDto) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.produk.findMany({
        where: search ? { nama: { contains: search } } : {},
        skip,
        take: limit,
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

  findOne(id: string) {
    return this.prisma.produk.findUnique({ where: { id } });
  }

  async update(id: string, rawData: UpdateProdukDto) {
    await this.prisma.produk.update({
      where: { id },
      data: rawData,
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
