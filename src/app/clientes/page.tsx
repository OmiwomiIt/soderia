'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Edit, Trash2, User, Phone, Mail, MapPin } from 'lucide-react';

interface Cliente {
  id: number;
  nombre: string;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
}

export default function ClientesPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', direccion: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/clientes').then(res => res.json()).then(data => {
      setClientes(data);
      setLoading(false);
    });
  }, []);

  const filtered = clientes.filter(c => 
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.telefono?.includes(search)
  );

  async function handleSave() {
    if (!form.nombre.trim()) return;
    setSaving(true);
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/clientes/${editId}` : '/api/clientes';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const res = await fetch('/api/clientes');
    setClientes(await res.json());
    setShowModal(false);
    setForm({ nombre: '', email: '', telefono: '', direccion: '' });
    setEditId(null);
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar cliente?')) return;
    await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
    const res = await fetch('/api/clientes');
    setClientes(await res.json());
  }

  function openEdit(cliente: Cliente) {
    setEditId(cliente.id);
    setForm({
      nombre: cliente.nombre,
      email: cliente.email || '',
      telefono: cliente.telefono || '',
      direccion: cliente.direccion || '',
    });
    setShowModal(true);
  }

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
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Clientes</h1>
          <p className="text-slate-500 mt-1">Gestiona tus clientes</p>
        </div>
        <Button onClick={() => { setEditId(null); setForm({ nombre: '', email: '', telefono: '', direccion: '' }); setShowModal(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Nuevo Cliente
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar clientes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">Cliente</TableHead>
                <TableHead className="font-semibold">Contacto</TableHead>
                <TableHead className="font-semibold">Dirección</TableHead>
                <TableHead className="text-right font-semibold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12">
                    <User className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium">No hay clientes</p>
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
                filtered.map((cliente, idx) => (
                  <TableRow 
                    key={cliente.id} 
                    className="hover:bg-slate-50 transition-colors"
                    style={{ animationDelay: `${idx * 20}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-sky-600" />
                        </div>
                        <span className="font-semibold text-slate-700">{cliente.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {cliente.email && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            <span>{cliente.email}</span>
                          </div>
                        )}
                        {cliente.telefono && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            <span>{cliente.telefono}</span>
                          </div>
                        )}
                        {!cliente.email && !cliente.telefono && (
                          <span className="text-slate-400 text-sm">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {cliente.direccion ? (
                        <div className="flex items-center gap-2 text-sm text-slate-600 max-w-[200px]">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{cliente.direccion}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => openEdit(cliente)}
                          className="hover:bg-slate-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(cliente.id)}
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

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editId ? 'Editar Cliente' : 'Nuevo Cliente'}>
        <div className="space-y-5">
          <div>
            <Label className="text-slate-700 font-medium">Nombre *</Label>
            <Input
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              placeholder="Nombre del cliente"
              className="mt-1.5 bg-white"
            />
          </div>
          
          <div>
            <Label className="text-slate-700 font-medium">Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="email@ejemplo.com"
              className="mt-1.5 bg-white"
            />
          </div>
          
          <div>
            <Label className="text-slate-700 font-medium">Teléfono</Label>
            <Input
              value={form.telefono}
              onChange={e => setForm({ ...form, telefono: e.target.value })}
              placeholder="Teléfono"
              className="mt-1.5 bg-white"
            />
          </div>
          
          <div>
            <Label className="text-slate-700 font-medium">Dirección</Label>
            <Input
              value={form.direccion}
              onChange={e => setForm({ ...form, direccion: e.target.value })}
              placeholder="Dirección"
              className="mt-1.5 bg-white"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button 
              onClick={handleSave} 
              disabled={saving || !form.nombre.trim()}
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