'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { useAuth } from '@/components/auth/provider';
import { Plus, Edit, Trash2, ArrowLeft, UserCog, Shield, User } from 'lucide-react';

interface Usuario {
  id: number;
  email: string;
  nombre: string;
  rol: 'ADMIN' | 'USUARIO';
  activo: boolean;
  createdAt: string;
}

export default function UsuariosPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [form, setForm] = useState<{ nombre: string; email: string; password: string; rol: 'ADMIN' | 'USUARIO' }>({ nombre: '', email: '', password: '', rol: 'USUARIO' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user?.rol !== 'ADMIN') {
      router.push('/');
    } else {
      fetchUsuarios();
    }
  }, [user, authLoading, router]);

  const fetchUsuarios = async () => {
    const res = await fetch('/api/usuarios');
    if (res.ok) {
      const data = await res.json();
      setUsuarios(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const url = editando ? `/api/usuarios/${editando.id}` : '/api/usuarios';
    const res = await fetch(url, {
      method: editando ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setShowModal(false);
      setEditando(null);
      setForm({ nombre: '', email: '', password: '', rol: 'USUARIO' });
      fetchUsuarios();
    } else {
      const data = await res.json();
      setError(data.error || 'Error al guardar');
    }
    setSaving(false);
  };

  const handleEdit = (u: Usuario) => {
    setEditando(u);
    setForm({ nombre: u.nombre, email: u.email, password: '', rol: u.rol });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    const res = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
    if (res.ok) fetchUsuarios();
  };

  const openNew = () => {
    setEditando(null);
    setForm({ nombre: '', email: '', password: '', rol: 'USUARIO' });
    setError('');
    setShowModal(true);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Usuarios</h1>
            <p className="text-slate-500 mt-1">Gestión de usuarios del sistema</p>
          </div>
        </div>
        <Button onClick={openNew} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Usuario
        </Button>
      </div>

      <Card className="animate-slide-up">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">Usuario</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Rol</TableHead>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableHead className="text-right font-semibold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <UserCog className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium">No hay usuarios</p>
                    <Button variant="link" onClick={openNew} className="text-sky-600 mt-2">
                      Crear el primero
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                usuarios.map((u, idx) => (
                  <TableRow 
                    key={u.id} 
                    className="hover:bg-slate-50 transition-colors"
                    style={{ animationDelay: `${idx * 20}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          u.rol === 'ADMIN' ? 'bg-purple-100' : 'bg-slate-100'
                        }`}>
                          {u.rol === 'ADMIN' ? (
                            <Shield className="h-5 w-5 text-purple-600" />
                          ) : (
                            <User className="h-5 w-5 text-slate-600" />
                          )}
                        </div>
                        <span className="font-semibold text-slate-700">{u.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-600">{u.email}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        u.rol === 'ADMIN' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.rol === 'ADMIN' ? 'Administrador' : 'Usuario'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        u.activo 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(u)}
                          className="hover:bg-slate-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(u.id)}
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

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editando ? 'Editar Usuario' : 'Nuevo Usuario'}>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl text-red-600 text-sm font-medium animate-scale-in">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Nombre</label>
            <Input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Nombre del usuario"
              className="mt-1.5 bg-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@ejemplo.com"
              className="mt-1.5 bg-white"
              required
              disabled={!!editando}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Contraseña {editando && <span className="text-slate-400">(dejar vacío para mantener)</span>}
            </label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="mt-1.5 bg-white"
              required={!editando}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Rol</label>
            <select
              value={form.rol}
              onChange={(e) => setForm({ ...form, rol: e.target.value as 'ADMIN' | 'USUARIO' })}
              className="w-full h-12 rounded-xl border border-slate-200 px-3 mt-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="USUARIO">Usuario</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={saving} className="flex-1 btn-primary">
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}