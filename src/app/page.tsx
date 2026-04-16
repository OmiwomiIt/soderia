'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, FileText, ArrowRight, TrendingUp, Clock, Send, Plus } from 'lucide-react';

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
  estado: string;
  createdAt: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(value);
};

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Clientes',
      value: stats.clientes,
      icon: Users,
      color: 'text-sky-500',
      bgColor: 'bg-sky-50',
    },
    {
      title: 'Productos',
      value: stats.productos,
      icon: Package,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Presupuestos',
      value: stats.presupuestos,
      subtitle: `${stats.presupuestosMes} este mes`,
      icon: FileText,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
    },
    {
      title: 'Pendientes',
      value: stats.pendientes,
      subtitle: `${stats.enviados} enviados`,
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 mt-1">Resumen de tu negocio</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.title} 
              className="card-hover animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
                {stat.subtitle && (
                  <p className="text-xs text-slate-400 mt-1">{stat.subtitle}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Presupuestos Recientes</CardTitle>
            <Link href="/presupuestos" className="text-sm text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1 font-medium transition-colors">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400">No hay presupuestos aún</p>
                <Link 
                  href="/presupuestos/nuevo" 
                  className="text-sm text-sky-600 hover:text-sky-700 font-medium mt-2 inline-block"
                >
                  Crear el primero
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recent.map((p) => (
                  <Link
                    key={p.numero}
                    href={`/presupuestos/${p.numero.replace('PRE-', '')}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        p.estado === 'ENVIADO' ? 'bg-sky-50' : 
                        p.estado === 'ACEPTADO' ? 'bg-green-50' :
                        p.estado === 'RECHAZADO' ? 'bg-red-50' :
                        'bg-slate-50'
                      }`}>
                        <FileText className={`h-5 w-5 ${
                          p.estado === 'ENVIADO' ? 'text-sky-500' : 
                          p.estado === 'ACEPTADO' ? 'text-green-500' :
                          p.estado === 'RECHAZADO' ? 'text-red-500' :
                          'text-slate-400'
                        }`} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-700">{p.numero}</p>
                        <p className="text-sm text-slate-500">{p.cliente.nombre}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">{formatCurrency(p.total)}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(p.createdAt).toLocaleDateString('es-AR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="animate-slide-up" style={{ animationDelay: '250ms' }}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/presupuestos/nuevo"
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/20">
                  <Plus className="h-5 w-5" />
                </div>
                <span className="font-semibold">Nuevo Presupuesto</span>
              </div>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/clientes?new=true"
              className="flex items-center justify-between p-4 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-100 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white">
                  <Users className="h-5 w-5 text-orange-500" />
                </div>
                <span className="font-medium text-slate-700">Agregar Cliente</span>
              </div>
              <ArrowRight className="h-5 w-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/productos?new=true"
              className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white">
                  <Package className="h-5 w-5 text-slate-500" />
                </div>
                <span className="font-medium text-slate-700">Agregar Producto</span>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}