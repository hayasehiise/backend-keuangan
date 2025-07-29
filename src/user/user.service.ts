/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserScheme, CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const parsed = CreateUserScheme.safeParse(data);
    if (!parsed.success) throw new BadRequestException(parsed.error.issues);

    const existing = await this.prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existing) throw new BadRequestException('Username sudah terpakai');

    const hashed = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashed,
      },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Akun Tidak Ditemukan');
    return user;
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Akun tidak ditemukan');

    const updateData = {
      ...data,
      ...(data.password && {
        password: await bcrypt.hash(data.password, 10),
      }),
    };

    if (data.password) {
      const hashed = await bcrypt.hash(data.password, 10);
      updateData.password = hashed;
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        password: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async getUsersPaginate(page: number, limit: number, currentUser: any) {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          username: true,
          role: true,
          createdAt: true,
        },
        where: {
          NOT: { id: currentUser.id },
        },
      }),
      this.prisma.user.count({ where: { NOT: { id: currentUser.id } } }),
    ]);

    return {
      data,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPage: Math.ceil(total / take),
      },
    };
  }
}
