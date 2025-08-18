/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateUserScheme,
  CreateUserDto,
  UpdateUserDto,
  QueryUserDto,
  UpdateUserScheme,
} from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const parsed = CreateUserScheme.safeParse(data);
    if (!parsed.success) throw new BadRequestException(parsed.error.issues);

    if (['OWNER', 'KASIR'].includes(data.role) && !data.tokoId) {
      throw new BadRequestException(`Role ${data.role} wajib mengisi Toko`);
    }

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
    // Validasi Zod
    const parsed = UpdateUserScheme.safeParse(data);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    // cek apakah username ada atau tidak
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Akun tidak ditemukan');

    //validasi toko
    if (
      parsed.data.role &&
      ['OWNER', 'KASIR'].includes(parsed.data.role) &&
      !parsed.data.tokoId
    ) {
      throw new BadRequestException(`Role ${data.role} wajib mengisi Toko`);
    }

    const updateData = {
      ...parsed.data,
    };

    if (parsed.data.password) {
      const hashed = await bcrypt.hash(parsed.data.password, 10);
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
        tokoId: true,
        createdAt: true,
      },
    });
  }

  async getUsers(query: QueryUserDto, currentUser: any) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    // untuk select getUser
    const baseSelect = {
      id: true,
      name: true,
      username: true,
      role: true,
      createdAt: true,
    };
    const select =
      currentUser.role === 'OWNER' || currentUser.role === 'ADMIN'
        ? {
            ...baseSelect,
            toko: {
              select: {
                id: true,
                nama: true,
              },
            },
          }
        : baseSelect;

    // Promise Fetch Data User
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select,
        where: search
          ? {
              name: { contains: search },
              NOT: { id: currentUser.id },
            }
          : { NOT: { id: currentUser.id } },
      }),
      this.prisma.user.count({ where: { NOT: { id: currentUser.id } } }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    };
  }
}
