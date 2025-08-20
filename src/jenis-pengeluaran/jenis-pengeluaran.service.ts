import {
  Injectable,
  //   BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateJenisPengeluaranDto,
  QueryJenisPengeluaranDto,
} from './dto/jenis-pengeluaran.dto';

@Injectable()
export class JenisPengeluaranService {
  constructor(private prisma: PrismaService) {}

  async create(rawData: CreateJenisPengeluaranDto) {
    await this.prisma.jenisPengeluaran.create({
      data: { ...rawData },
    });

    return {
      message: 'Data pengeluaran berhasil ditambahkan',
      statusCode: 200,
    };
  }

  async remove(id: string) {
    const jenisPengeluaran = await this.prisma.jenisPengeluaran.findUnique({
      where: { id },
    });
    if (!jenisPengeluaran) throw new NotFoundException('data tidak ditemukan');

    await this.prisma.jenisPengeluaran.delete({
      where: { id },
    });

    return {
      message: 'Data berhasil dihapus',
      statusCode: 200,
    };
  }

  async getData(query: QueryJenisPengeluaranDto) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;
    const where = {
      ...(search ? { name: { contains: search } } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.jenisPengeluaran.findMany({
        skip,
        where,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.jenisPengeluaran.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    };
  }

  async getList() {
    const data = await this.prisma.jenisPengeluaran.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return {
      data,
    };
  }
}
