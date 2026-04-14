import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super-secret-key-change-in-production'
);

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuario) {
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  }

  if (!usuario.activo) {
    return NextResponse.json({ error: 'Usuario inactivo' }, { status: 401 });
  }

  const validPassword = await bcrypt.compare(password, usuario.password);
  if (!validPassword) {
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  }

  const token = await new SignJWT({
    id: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre,
    rol: usuario.rol,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);

  const response = NextResponse.json({
    id: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre,
    rol: usuario.rol,
  });

  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}

export async function GET() {
  const cookiesData = await cookies();
  const token = cookiesData.get('auth-token')?.value || '';

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const payload = await jwtVerify(token, secret);
    return NextResponse.json({
      authenticated: true,
      user: payload.payload,
    });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}