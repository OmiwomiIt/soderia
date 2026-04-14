import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL || '';
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = '$2b$10$bQ/6covQUszrzXrTTuPCLufJ4mC1IFixKNTJPmkbMYAQepQcSxpxq';
  
  const existing = await prisma.usuario.findUnique({
    where: { email: 'admin@soderia.com' },
  });
  
  if (!existing) {
    await prisma.usuario.create({
      data: {
        email: 'admin@soderia.com',
        password: hashedPassword,
        nombre: 'Admin Principal',
        rol: 'ADMIN',
      }
    });
    console.log('Admin user created: admin@soderia.com / admin123');
  } else {
    console.log('Admin user already exists');
  }
  
  await prisma.$disconnect();
}

main();