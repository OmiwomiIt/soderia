import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

declare global {
  var prisma: any;
}

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL || '';
const adapter = new PrismaNeon({ connectionString });

const { PrismaClient } = require('@prisma/client');
const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;