'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Droplets, Wine, Package, Search } from 'lucide-react';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  tipo: 'AGUA' | 'SODA';
  presentacion: string;
  precio: number;
  activo: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(value);
};

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'AGUA' | 'SODA'>('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', tipo: 'AGUA' as 'AGUA' | 'SODA', presentacion: '', precio: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/productos').then(res => res.json()).then(data => {
      setProductos(data);
      setLoading(false);
    });
  }, []);

  const filtered = productos.filter(p => {
    const matchesType = filter === 'ALL' || p.tipo === filter;
    const matchesSearch = !search || 
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.presentacion.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  async function handleSave() {
    if (!form.nombre.trim() || !form.presentacion.trim() || !form.precio) return;
    setSaving(true);
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/productos/${editId}` : '/api/productos';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, precio: parseFloat(form.precio) }),
    });
    const res = await fetch('/api/productos');
    setProductos(await res.json());
    setShowModal(false);
    setForm({ nombre: '', descripcion: '', tipo: 'AGUA', presentacion: '', precio: '' });
    setEditId(null);
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar producto?')) return;
    await fetch(`/api/productos/${id}`, { method: 'DELETE' });
    const res = await fetch('/api/productos');
    setProductos(await res.json());
  }

  async function handleToggle(id: number, activo: boolean) {
    await fetch(`/api/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo }),
    });
    const res = await fetch('/api/productos');
    setProductos(await res.json());
  }

  function openEdit(producto: Producto) {
    setEditId(producto.id);
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      tipo: producto.tipo,
      presentacion: producto.presentacion,
      precio: producto.precio.toString(),
    });
    setShowModal(true);
  }

  const filtros = [
    { value: 'ALL', label: 'Todos', icon: Search },
    { value: 'AGUA', label: 'Agua', icon: Droplets },
    { value: 'SODA', label: 'Soda', icon: Wine },
  ] as const;

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
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Productos</h1>
          <p className="text-slate-500 mt-1">Catálogo de productos</p>
        </div>
        <Button onClick={() => { setEditId(null); setForm({ nombre: '', descripcion: '', tipo: 'AGUA', presentacion: '', precio: '' }); setShowModal(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Nuevo Producto
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar productos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
        <div className="flex gap-2">
          {filtros.map((f) => {
            const Icon = f.icon;
            return (
              <Button
                key={f.value}
                variant={filter === f.value ? (f.value === 'AGUA' ? 'default' : f.value === 'SODA' ? 'secondary' : 'default') : 'outline'}
                size="sm"
                onClick={() => setFilter(f.value)}
              >
                <Icon className="h-4 w-4 mr-1" /> {f.label}
              </Button>
            );
          })}
        </div>
      </div>

      <Card className="animate-slide-up">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">Producto</TableHead>
                <TableHead className="font-semibold">Tipo</TableHead>
                <TableHead className="font-semibold">Presentación</TableHead>
                <TableHead className="font-semibold">Precio</TableHead>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableHead className="text-right font-semibold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <Package className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium">No hay productos</p>
                    <Button 
                      variant="link" 
                      onClick={() => setShowModal(true)}
                      className="text-sky-600 mt-2"
                    >
                      Agregar el primero
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((producto, idx) => (
                  <TableRow 
                    key={producto.id} 
                    className="hover:bg-slate-50 transition-colors"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          producto.tipo === 'AGUA' ? 'bg-sky-100' : 'bg-orange-100'
                        }`}>
                          {producto.tipo === 'AGUA' ? (
                            <Droplets className="h-5 w-5 text-sky-600" />
                          ) : (
                            <Wine className="h-5 w-5 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700">{producto.nombre}</p>
                          {producto.descripcion && (
                            <p className="text-xs text-slate-400">{producto.descripcion}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        producto.tipo === 'AGUA' 
                          ? 'bg-sky-100 text-sky-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {producto.tipo}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-600">{producto.presentacion}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-slate-800">{formatCurrency(producto.precio)}</span>
                    </TableCell>
                    <TableCell>
                      <button 
                        onClick={() => handleToggle(producto.id, !producto.activo)} 
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          producto.activo 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {producto.activo ? 'Activo' : 'Inactivo'}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => openEdit(producto)}
                          className="hover:bg-slate-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(producto.id)}
                          className="hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editId ? 'Editar Producto' : 'Nuevo Producto'}>
        <div className="space-y-5">
          <div>
            <Label className="text-slate-700 font-medium">Nombre *</Label>
            <Input
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              placeholder="Nombre del producto"
              className="mt-1.5 bg-white"
            />
          </div>
          
          <div>
            <Label className="text-slate-700 font-medium">Tipo *</Label>
            <Select 
              value={form.tipo} 
              onChange={e => setForm({ ...form, tipo: e.target.value as 'AGUA' | 'SODA' })}
              className="mt-1.5 bg-white"
            >
              <option value="AGUA">💧 Agua</option>
              <option value="SODA">🥤 Soda</option>
            </Select>
          </div>
          
          <div>
            <Label className="text-slate-700 font-medium">Presentación *</Label>
            <Input
              value={form.presentacion}
              onChange={e => setForm({ ...form, presentacion: e.target.value })}
              placeholder="500ml, 1L, 20L, etc."
              className="mt-1.5 bg-white"
            />
          </div>
          
          <div>
            <Label className="text-slate-700 font-medium">Precio *</Label>
            <Input
              type="number"
              step="0.01"
              value={form.precio}
              onChange={e => setForm({ ...form, precio: e.target.value })}
              placeholder="0.00"
              className="mt-1.5 bg-white"
            />
          </div>
          
          <div>
            <Label className="text-slate-700 font-medium">Descripción</Label>
            <Input
              value={form.descripcion}
              onChange={e => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Descripción opcional"
              className="mt-1.5 bg-white"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button 
              onClick={handleSave} 
              disabled={saving || !form.nombre.trim() || !form.presentacion.trim() || !form.precio}
              className="btn-primary"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}