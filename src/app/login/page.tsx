'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al iniciar sesión');
        return;
      }

      window.location.href = '/';
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 gradient-surface" />
      
      <div className="absolute top-0 left-0 right-0 h-96 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] animate-pulse-slow">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full bg-orange-400/15 blur-3xl" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-sm px-4">
        <div className="text-center mb-10 animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-5 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl flex items-center justify-center ring-1 ring-sky-100">
            <span className="text-5xl">💧</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Sodería</h1>
          <p className="text-slate-500 mt-2 font-medium">Sistema de Presupuestos</p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl ring-1 ring-slate-200/50 p-7 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl text-red-600 text-sm font-medium animate-scale-in">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="h-12 text-base bg-white/80 backdrop-blur-sm border-slate-200 input-glow rounded-xl"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Contraseña
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 text-base bg-white/80 backdrop-blur-sm border-slate-200 input-glow rounded-xl"
                required
                autoComplete="current-password"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base btn-primary rounded-xl shadow-md hover:shadow-lg" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Ingresando...
                </span>
              ) : 'Iniciar sesión'}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 font-medium">
          Ingresa tus credenciales para continuar
        </p>
      </div>
    </div>
  );
}