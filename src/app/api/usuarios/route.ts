import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super-secret-key-change-in-production'
);

async function getUser(request: Request) {
  const token = request.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0];
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as any;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const user = await getUser(request);
  if (!user || user.rol !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const usuarios = await prisma.usuario.findMany({
    select: { id: true, email: true, nombre: true, rol: true, activo: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(usuarios);
}

export async function POST(request: Request) {
  const user = await getUser(request);
  if (!user || user.rol !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const data = await request.json();
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const existing = await prisma.usuario.findUnique({
    where: { email: data.email },
  });
  if (existing) {
    return NextResponse.json({ error: 'El email ya está en uso' }, { status: 400 });
  }

  const usuario = await prisma.usuario.create({
    data: {
      email: data.email,
      password: hashedPassword,
      nombre: data.nombre,
      rol: data.rol || 'USUARIO',
    },
  });

  return NextResponse.json({
    id: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre,
    rol: usuario.rol,
  }, { status: 201 });
}