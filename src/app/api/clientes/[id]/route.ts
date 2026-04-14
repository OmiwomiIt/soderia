import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  const cliente = await prisma.cliente.findFirst({
    where: { id: parseInt(id), usuarioId: user.id },
  });
  if (!cliente) {
    return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
  }
  return NextResponse.json(cliente);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  const data = await request.json();
  const cliente = await prisma.cliente.update({
    where: { id: parseInt(id), usuarioId: user.id },
    data: {
      nombre: data.nombre,
      email: data.email || null,
      telefono: data.telefono || null,
      direccion: data.direccion || null,
    },
  });
  return NextResponse.json(cliente);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  await prisma.cliente.delete({
    where: { id: parseInt(id), usuarioId: user.id },
  });
  return NextResponse.json({ success: true });
}