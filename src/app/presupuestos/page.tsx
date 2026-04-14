'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, FileText, Eye, Trash2, Download } from 'lucide-react';

interface Presupuesto {
  id: number;
  numero: string;
  estado: 'BORRADOR' | 'ENVIADO' | 'ACEPTADO' | 'RECHAZADO';
  total: number;
  createdAt: string;
  cliente: { nombre: string };
}

export default function PresupuestosPage() {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
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
        console.error('Error fetching presupuestos');
        setPresupuestos([]);
      }
    } catch (err) {
      console.error('Error:', err);
      setPresupuestos([]);
    }
    setLoading(false);
  }

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

  const estadoColors: Record<string, string> = {
    BORRADOR: 'bg-slate-100 text-slate-700',
    ENVIADO: 'bg-blue-100 text-blue-700',
    ACEPTADO: 'bg-green-100 text-green-700',
    RECHAZADO: 'bg-red-100 text-red-700',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Presupuestos</h1>
          <p className="text-slate-500">Gestión de presupuestos</p>
        </div>
        <Link href="/presupuestos/nuevo">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Nuevo Presupuesto
          </Button>
        </Link>
      </div>

      <div className="flex gap-2">
        <Button variant={filter === 'ALL' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('ALL')}>
          Todos
        </Button>
        <Button variant={filter === 'BORRADOR' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('BORRADOR')}>
          Borrador
        </Button>
        <Button variant={filter === 'ENVIADO' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('ENVIADO')}>
          Enviados
        </Button>
        <Button variant={filter === 'ACEPTADO' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('ACEPTADO')}>
          Aceptados
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {presupuestos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400">
                    No hay presupuestos
                  </TableCell>
                </TableRow>
              ) : (
                presupuestos.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.numero}</TableCell>
                    <TableCell>{p.cliente.nombre}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${estadoColors[p.estado]}`}>
                        {p.estado}
                      </span>
                    </TableCell>
                    <TableCell>$AR {p.total.toFixed(2)}</TableCell>
                    <TableCell>{new Date(p.createdAt).toLocaleDateString('es-MX')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/presupuestos/${p.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => handleDownload(p)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        {(p.estado === 'BORRADOR' || p.estado === 'RECHAZADO') && (
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}