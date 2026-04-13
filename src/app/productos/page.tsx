'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Droplets, Wine } from 'lucide-react';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  tipo: 'AGUA' | 'SODA';
  presentacion: string;
  precio: number;
  activo: boolean;
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'AGUA' | 'SODA'>('ALL');
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

  const filtered = filter === 'ALL' ? productos : productos.filter(p => p.tipo === filter);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Productos</h1>
          <p className="text-slate-500">Catálogo de productos</p>
        </div>
        <Button onClick={() => { setEditId(null); setForm({ nombre: '', descripcion: '', tipo: 'AGUA', presentacion: '', precio: '' }); setShowModal(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Nuevo Producto
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant={filter === 'ALL' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('ALL')}>
          Todos
        </Button>
        <Button variant={filter === 'AGUA' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('AGUA')}>
          <Droplets className="h-4 w-4 mr-1" /> Agua
        </Button>
        <Button variant={filter === 'SODA' ? 'secondary' : 'outline'} size="sm" onClick={() => setFilter('SODA')}>
          <Wine className="h-4 w-4 mr-1" /> Soda
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Presentación</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400">
                    No hay productos
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(producto => (
                  <TableRow key={producto.id}>
                    <TableCell className="font-medium">
                      {producto.nombre}
                      {producto.descripcion && <p className="text-xs text-slate-400">{producto.descripcion}</p>}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${producto.tipo === 'AGUA' ? 'bg-cyan-100 text-cyan-700' : 'bg-orange-100 text-orange-700'}`}>
                        {producto.tipo}
                      </span>
                    </TableCell>
                    <TableCell>{producto.presentacion}</TableCell>
                    <TableCell>$AR {producto.precio.toFixed(2)}</TableCell>
                    <TableCell>
                      <button onClick={() => handleToggle(producto.id, !producto.activo)} className={`text-xs ${producto.activo ? 'text-green-600' : 'text-red-500'}`}>
                        {producto.activo ? 'Activo' : 'Inactivo'}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(producto)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(producto.id)}>
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
        <div className="space-y-4">
          <div>
            <Label>Nombre *</Label>
            <Input
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              placeholder="Nombre del producto"
            />
          </div>
          <div>
            <Label>Tipo *</Label>
            <Select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value as 'AGUA' | 'SODA' })}>
              <option value="AGUA">Agua</option>
              <option value="SODA">Soda</option>
            </Select>
          </div>
          <div>
            <Label>Presentación *</Label>
            <Input
              value={form.presentacion}
              onChange={e => setForm({ ...form, presentacion: e.target.value })}
              placeholder="500ml, 1L, 20L, etc."
            />
          </div>
          <div>
            <Label>Precio *</Label>
            <Input
              type="number"
              step="0.01"
              value={form.precio}
              onChange={e => setForm({ ...form, precio: e.target.value })}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label>Descripción</Label>
            <Input
              value={form.descripcion}
              onChange={e => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Descripción opcional"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !form.nombre.trim() || !form.presentacion.trim() || !form.precio}>
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}