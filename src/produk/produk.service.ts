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

  create(data: CreateProdukDto) {
    return this.prisma.produk.create({ data });
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
      this.prisma.user.count(),
    ]);
    return {
      data,
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    };
  }

  //   getProduk(query: QueryProdukDto) {
  //     const { page, limit, search } = query;
  //     const skip = (page - 1) * limit;

  //     return this.prisma.produk.findMany({
  //       where: search ? { nama: { contains: search } } : {},
  //       skip,
  //       take: limit,
  //       orderBy: { createdAt: 'desc' },
  //     });
  //   }

  //   async countAll(query: QueryProdukDto) {
  //     const { search } = query;
  //     return this.prisma.produk.count({
  //       where: search ? { nama: { contains: search } } : {},
  //     });
  //   }

  findOne(id: string) {
    return this.prisma.produk.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateProdukDto) {
    return this.prisma.produk.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.produk.delete({ where: { id } });
  }
}
