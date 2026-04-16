'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, FileText, Eye, Trash2, Download, Search, ClipboardList, Send, Check, X } from 'lucide-react';

interface Presupuesto {
  id: number;
  numero: string;
  estado: 'BORRADOR' | 'ENVIADO' | 'ACEPTADO' | 'RECHAZADO';
  total: number;
  createdAt: string;
  cliente: { nombre: string };
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(value);
};

const estadoConfig: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  BORRADOR: { 
    bg: 'bg-slate-100', 
    text: 'text-slate-700',
    icon: ClipboardList,
    label: 'Borrador'
  },
  ENVIADO: { 
    bg: 'bg-sky-100', 
    text: 'text-sky-700',
    icon: Send,
    label: 'Enviado'
  },
  ACEPTADO: { 
    bg: 'bg-green-100', 
    text: 'text-green-700',
    icon: Check,
    label: 'Aceptado'
  },
  RECHAZADO: { 
    bg: 'bg-red-100', 
    text: 'text-red-700',
    icon: X,
    label: 'Rechazado'
  },
};

export default function PresupuestosPage() {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [filter]);

  async function fetchData() {
    try {
      const url = filter === 'ALL' ? '/api/presupuestos' : `/api/presupuestos?estado=${filter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPresupuestos(data);
      } else {
        setPresupuestos([]);
      }
    } catch (err) {
      console.error('Error:', err);
      setPresupuestos([]);
    }
    setLoading(false);
  }

  const filtered = search
    ? presupuestos.filter(p => 
        p.numero.toLowerCase().includes(search.toLowerCase()) ||
        p.cliente.nombre.toLowerCase().includes(search.toLowerCase())
      )
    : presupuestos;

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar presupuesto?')) return;
    try {
      const res = await fetch(`/api/presupuestos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al eliminar');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  }

  async function handleDownload(presupuesto: Presupuesto) {
    window.open(`/api/presupuestos/${presupuesto.id}/pdf`, '_blank');
  }

  const filtros = [
    { value: 'ALL', label: 'Todos' },
    { value: 'BORRADOR', label: 'Borrador' },
    { value: 'ENVIADO', label: 'Enviados' },
    { value: 'ACEPTADO', label: 'Aceptados' },
    { value: 'RECHAZADO', label: 'Rechazados' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Presupuestos</h1>
          <p className="text-slate-500 mt-1">Gestión de presupuestos</p>
        </div>
        <Link href="/presupuestos/nuevo">
          <Button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" /> Nuevo Presupuesto
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar presupuestos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filtros.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      <Card className="animate-slide-up">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">Número</TableHead>
                <TableHead className="font-semibold">Cliente</TableHead>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableHead className="font-semibold">Total</TableHead>
                <TableHead className="font-semibold">Fecha</TableHead>
                <TableHead className="text-right font-semibold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <FileText className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium">No hay presupuestos</p>
                    <Link href="/presupuestos/nuevo">
                      <Button variant="link" className="text-sky-600 mt-2">
                        Crear el primero
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p, idx) => {
                  const config = estadoConfig[p.estado];
                  const Icon = config.icon;
                  return (
                    <TableRow 
                      key={p.id} 
                      className="hover:bg-slate-50 transition-colors"
                      style={{ animationDelay: `${idx * 20}ms` }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bg}`}>
                            <FileText className={`h-5 w-5 ${config.text}`} />
                          </div>
                          <span className="font-semibold text-slate-700">{p.numero}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-600">{p.cliente.nombre}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                          <Icon className="h-3.5 w-3.5" />
                          {config.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-slate-800">{formatCurrency(p.total)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-500">
                          {new Date(p.createdAt).toLocaleDateString('es-AR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Link href={`/presupuestos/${p.id}`}>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="hover:bg-sky-50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDownload(p)}
                            className="hover:bg-slate-100"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {(p.estado === 'BORRADOR' || p.estado === 'RECHAZADO') && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDelete(p.id)}
                              className="hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}