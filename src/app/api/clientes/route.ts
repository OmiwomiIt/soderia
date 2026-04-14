import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const clientes = await prisma.cliente.findMany({
    where: { usuarioId: user.id },
    orderBy: { nombre: 'asc' },
  });
  return NextResponse.json(clientes);
}

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const data = await request.json();
  const cliente = await prisma.cliente.create({
    data: {
      nombre: data.nombre,
      email: data.email || null,
      telefono: data.telefono || null,
      direccion: data.direccion || null,
      usuarioId: user.id,
    },
  });
  return NextResponse.json(cliente, { status: 201 });
}
