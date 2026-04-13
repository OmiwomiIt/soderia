import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const clientes = await prisma.cliente.findMany({
    orderBy: { nombre: 'asc' },
  });
  return NextResponse.json(clientes);
}

export async function POST(request: Request) {
  const data = await request.json();
  const cliente = await prisma.cliente.create({
    data: {
      nombre: data.nombre,
      email: data.email || null,
      telefono: data.telefono || null,
      direccion: data.direccion || null,
    },
  });
  return NextResponse.json(cliente, { status: 201 });
}
