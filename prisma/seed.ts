/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient, Produk_Status } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('adminapp', 10);
  await prisma.user.upsert({
    where: { username: 'adminapp' },
    update: {},
    create: {
      name: 'Hery Setiawan',
      username: 'adminappkeuangan',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  const hashedPasswordBackup = await bcrypt.hash('adminbackup', 10);
  await prisma.user.upsert({
    where: { username: 'adminbackup' },
    update: {},
    create: {
      name: 'Hery Setiawan',
      username: 'adminbackup',
      password: hashedPasswordBackup,
      role: 'ADMIN',
    },
  });
  const products = Array.from({ length: 100 }).map((_, i) => ({
    nama: `Produk ${i + 1}`,
    harga: Math.floor(Math.random() * 100000) + 1000, // harga acak 1.000 - 100.000
    stock: Math.floor(Math.random() * 100), // stok acak 0 - 99
    status: Produk_Status.TERSEDIA,
  }));

  await prisma.produk.createMany({
    data: products,
  });

  // console.log({ admin, adminBackup });
  console.log('data sudah dimasukan');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
