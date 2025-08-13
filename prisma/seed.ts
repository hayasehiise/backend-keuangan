import { PrismaClient } from '@prisma/client';
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
