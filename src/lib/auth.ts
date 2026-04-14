import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super-secret-key-change-in-production'
);

export async function getUserFromRequest(request: Request) {
  const token = request.headers.get('cookie')?.split('auth-token=')[1]?.split(';')[0];
  if (!token) return null;
  
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { id: number; email: string; nombre: string; rol: 'ADMIN' | 'USUARIO' };
  } catch {
    return null;
  }
}