import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import * as Prisma from '@prisma/client';
import ws from 'ws';

declare global {
  var prisma: Prisma.PrismaClient | undefined;
}

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL || '';
const adapter = new PrismaNeon({ connectionString });

const prisma = global.prisma || new Prisma.PrismaClient({ adapter });

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;