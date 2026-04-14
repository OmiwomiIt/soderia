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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser(request);
  if (!user || user.rol !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const { id } = await params;
  const usuario = await prisma.usuario.findUnique({
    where: { id: parseInt(id) },
    select: { id: true, email: true, nombre: true, rol: true, activo: true, createdAt: true },
  });

  if (!usuario) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  return NextResponse.json(usuario);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser(request);
  if (!user || user.rol !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const { id } = await params;
  const data = await request.json();

  const updateData: any = {};
  if (data.nombre) updateData.nombre = data.nombre;
  if (data.rol) updateData.rol = data.rol;
  if (data.activo !== undefined) updateData.activo = data.activo;
  if (data.password) updateData.password = await bcrypt.hash(data.password, 10);

  const usuario = await prisma.usuario.update({
    where: { id: parseInt(id) },
    data: updateData,
  });

  return NextResponse.json({
    id: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre,
    rol: usuario.rol,
  });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser(request);
  if (!user || user.rol !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const { id } = await params;

  await prisma.usuario.delete({
    where: { id: parseInt(id) },
  });

  return NextResponse.json({ message: 'Usuario eliminado' });
}