/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('adminapp', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'adminapp' },
    update: {},
    create: {
      name: 'Hery Setiawan',
      username: 'adminappkeuangan',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log(admin);
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
