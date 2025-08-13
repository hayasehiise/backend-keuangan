/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTokoDto, UpdateTokoDto, QueryTokoDto } from './dto/toko.dto';

@Injectable()
export class TokoService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTokoDto) {
    await this.prisma.toko.create({
      data,
    });

    return {
      message: 'Data Toko Berhasil Ditambahkan',
      statusCode: 200,
    };
  }

  async update(id: string, data: UpdateTokoDto) {
    await this.prisma.toko.update({
      where: { id },
      data,
    });

    return {
      message: 'Data Toko Berhasil Diupdate',
      statusCode: 200,
    };
  }

  async remove(id: string) {
    await this.prisma.toko.delete({
      where: { id },
    });

    return {
      message: 'Data Toko Berhasil Dihapus',
      statusCode: 200,
    };
  }

  async getToko(query: QueryTokoDto) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.toko.findMany({
        where: search ? { nama: { contains: search } } : {},
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.toko.count(),
    ]);
    return {
      data,
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    };
  }

  async getTokoList() {
    const data = await this.prisma.toko.findMany();
    return data;
  }
}
