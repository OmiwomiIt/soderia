'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, FileText, ArrowRight } from 'lucide-react';

interface Stats {
  clientes: number;
  productos: number;
  presupuestos: number;
  presupuestosMes: number;
  pendientes: number;
  enviados: number;
}

interface Recent {
  numero: string;
  cliente: { nombre: string };
  total: number;
  createdAt: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    clientes: 0,
    productos: 0,
    presupuestos: 0,
    presupuestosMes: 0,
    pendientes: 0,
    enviados: 0,
  });
  const [recent, setRecent] = useState<Recent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [clientesRes, productosRes, presupuestosRes] = await Promise.all([
        fetch('/api/clientes'),
        fetch('/api/productos?activo=true'),
        fetch('/api/presupuestos'),
      ]);
      const clientes = await clientesRes.json();
      const productos = await productosRes.json();
      const presupuestos = await presupuestosRes.json();

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      setStats({
        clientes: clientes.length,
        productos: productos.length,
        presupuestos: presupuestos.length,
        presupuestosMes: presupuestos.filter((p: any) => new Date(p.createdAt) >= startOfMonth).length,
        pendientes: presupuestos.filter((p: any) => p.estado === 'BORRADOR').length,
        enviados: presupuestos.filter((p: any) => p.estado === 'ENVIADO').length,
      });
      
      setRecent(presupuestos.slice(0, 5));
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Resumen de tu negocio</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Clientes</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clientes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Productos</CardTitle>
            <Package className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Presupuestos</CardTitle>
            <FileText className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.presupuestos}</div>
            <p className="text-xs text-slate-400">{stats.presupuestosMes} este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pendientes</CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendientes}</div>
            <p className="text-xs text-slate-400">{stats.enviados} enviados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Presupuestos Recientes</CardTitle>
            <Link href="/presupuestos" className="text-sm text-cyan-600 hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="text-slate-400 text-center py-4">No hay presupuestos aún</p>
            ) : (
              <div className="space-y-3">
                {recent.map((p) => (
                  <Link
                    key={p.numero}
                    href={`/presupuestos/${p.numero.replace('PRE-', '')}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{p.numero}</p>
                      <p className="text-sm text-slate-500">{p.cliente.nombre}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">$AR {p.total.toFixed(2)}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(p.createdAt).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/presupuestos/nuevo"
              className="flex items-center justify-between p-4 rounded-lg bg-cyan-50 hover:bg-cyan-100 transition-colors"
            >
              <span className="font-medium text-cyan-700">Nuevo Presupuesto</span>
              <ArrowRight className="h-5 w-5 text-cyan-600" />
            </Link>
            <Link
              href="/clientes/nuevo"
              className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <span className="font-medium">Agregar Cliente</span>
              <ArrowRight className="h-5 w-5 text-slate-400" />
            </Link>
            <Link
              href="/productos/nuevo"
              className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <span className="font-medium">Agregar Producto</span>
              <ArrowRight className="h-5 w-5 text-slate-400" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}