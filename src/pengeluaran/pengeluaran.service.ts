/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreatePengeluaranDto,
  UpdatePengeluaranDto,
  QueryPengeluaranDto,
  CreatePengeluaranScheme,
  UpdatePengeluaranScheme,
} from './dto/pengeluaran.dto';

@Injectable()
export class PengeluaranService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePengeluaranDto, user: any) {
    const parsed = CreatePengeluaranScheme.safeParse(data);
    if (!parsed.success) throw new BadRequestException(parsed.error.issues);

    return this.prisma.pengeluaran.create({
      data: {
        ...data,
        createdBy: user.id,
        detailPencatatan: data.detailPencatatan ?? '',
      },
    });
  }

  async getPengeluaran(query: QueryPengeluaranDto, user: any) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;
    const where = {
      ...(search ? { jenisPengeluaran: { name: { contains: search } } } : {}),
      ...(user.role !== 'ADMIN' ? { createdBy: user.id } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.pengeluaran.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          jenisPengeluaran: {
            select: {
              name: true,
            },
          },
          user: {
            select: {
              name: true,
            },
          },
        },
      }),
      this.prisma.pengeluaran.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    };
  }

  async update(id: string, data: UpdatePengeluaranDto) {
    const parsed = UpdatePengeluaranScheme.safeParse(data);
    if (!parsed.success) throw new BadRequestException(parsed.error.issues);

    return this.prisma.pengeluaran.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.pengeluaran.delete({ where: { id } });
  }
}
