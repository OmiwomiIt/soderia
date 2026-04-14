import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

async function generateNumero(usuarioId: number) {
  // Buscar el último número del mismo usuario
  const last = await prisma.presupuesto.findFirst({
    where: { usuarioId },
    orderBy: { numero: 'desc' },
  });
  let num = 1;
  if (last) {
    const lastNum = parseInt(last.numero.replace('PRE-', ''));
    if (!isNaN(lastNum)) {
      num = lastNum + 1;
    }
  }
  // Verificar que no existe y buscar uno libre si es necesario
  let nuevoNumero = `PRE-${num.toString().padStart(5, '0')}`;
  let existing = await prisma.presupuesto.findUnique({ where: { numero: nuevoNumero } });
  let attempts = 0;
  while (existing && attempts < 100) {
    num++;
    nuevoNumero = `PRE-${num.toString().padStart(5, '0')}`;
    existing = await prisma.presupuesto.findUnique({ where: { numero: nuevoNumero } });
    attempts++;
  }
  return nuevoNumero;
}

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const estado = searchParams.get('estado');
  const clienteId = searchParams.get('clienteId');
  
  const where: any = { usuarioId: user.id };
  if (estado) where.estado = estado;
  if (clienteId) where.clienteId = parseInt(clienteId);

  const presupuestos = await prisma.presupuesto.findMany({
    where,
    include: {
      cliente: true,
      detalles: {
        include: { producto: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(presupuestos);
}

export async function POST(request: Request) {
  let user;
  try {
    user = await getUserFromRequest(request);
  } catch (err) {
    console.error('Auth error:', err);
    return NextResponse.json({ error: 'Error de autenticación' }, { status: 401 });
  }
  
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
  
  if (!data.clienteId || !data.detalles || data.detalles.length === 0) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
  }

  const numero = await generateNumero(user.id);
  
  let total = 0;
  for (const item of data.detalles) {
    total += item.cantidad * item.precioUnitario;
  }

  try {
    console.log('Creating presupuesto:', { numero, clienteId: data.clienteId, usuarioId: user.id });
    
    // Verificar que el cliente pertenece al usuario
    const cliente = await prisma.cliente.findFirst({
      where: { id: data.clienteId, usuarioId: user.id }
    });
    console.log('Cliente:', cliente);
    
    if (!cliente) {
      return NextResponse.json({ error: 'Cliente no encontrado o no pertenece al usuario' }, { status: 400 });
    }

    const presupuesto = await prisma.presupuesto.create({
      data: {
        numero,
        clienteId: data.clienteId,
        usuarioId: user.id,
        subtotal: total,
        iva: 0,
        total,
        observaciones: data.observaciones || null,
        estado: data.estado || 'BORRADOR',
        detalles: {
          create: data.detalles.map((item: any) => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            total: item.cantidad * item.precioUnitario,
          })),
        },
      },
      include: {
        cliente: true,
        detalles: { include: { producto: true } },
      },
    });
    console.log('Presupuesto creado:', presupuesto.id);
    return NextResponse.json(presupuesto, { status: 201 });
  } catch (err: any) {
    console.error('DB error:', err);
    return NextResponse.json({ error: 'Error al guardar: ' + err.message }, { status: 500 });
  }
}