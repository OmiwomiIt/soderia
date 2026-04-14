# Sodería - Sistema de Presupuestos

Aplicación web para gestión de presupuestos de distribución de agua embotellada y soda.

## Características

- Dashboard con estadísticas del negocio
- CRUD de clientes
- Catálogo de productos (agua/soda)
- Creación de presupuestos con cálculo automático
- Exportación a PDF
- Moneda: Pesos Argentinos ($AR)

## Tech Stack

- Next.js 16 (App Router) + React + TypeScript
- Tailwind CSS
- Prisma ORM
- Neon PostgreSQL (base de datoscloud)
- jsPDF para generación de PDF
- shadcn/ui

## Deploy

- **Producción**: https://soderia.vercel.app/
- **Repositorio**: https://github.com/OmiwomiIt/soderia

## Variables de Entorno

### Desarrollo Local

Crear archivo `.env`:
```
DATABASE_URL="postgresql://neondb_owner:npg_QcaTsu1POCr9@ep-aged-cloud-anjztkxc.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### Vercel

Agregar en Settings → Environment Variables:
- `DATABASE_URL`: `postgresql://neondb_owner:npg_QcaTsu1POCr9@ep-aged-cloud-anjztkxc.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require`

## Ejecutar localmente

```bash
cd soderia
npm install
npm run postinstall
npm run dev
```

Abrir http://localhost:3000

## Datos de ejemplo (seed)

- Cliente: "Empresa Demo"
- Productos: Agua (500ml-20L) y Soda (500ml-2L)

## Scripts Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Compilar para producción
- `npm run postinstall` - Generar cliente Prisma
- `npm run db:push` - Sincronizar schema a la base de datos
- `npm run db:seed` - Poblar base de datos con datos de ejemplo