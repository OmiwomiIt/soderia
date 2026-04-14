<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md - Sodería

## Proyecto Info

- **App**: https://soderia.vercel.app/
- **Repo**: https://github.com/OmiwomiIt/soderia
- **Stack**: Next.js 16 + React + TypeScript + Tailwind + Prisma + Neon PostgreSQL

## Tech Stack Versions

- Next.js 16.x (App Router)
- React 19.x
- TypeScript 5.x
- Tailwind CSS 4.x
- Prisma 7.x
- shadcn/ui

## Base de Datos

- **Proveedor**: Neon PostgreSQL
- **Connection String**: 
  ```
  postgresql://neondb_owner:npg_QcaTsu1POCr9@ep-aged-cloud-anjztkxc.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require
  ```
- **Esquema**: en `prisma/schema.prisma`

## Scripts npm

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "postinstall": "prisma generate",
  "db:push": "prisma db push",
  "db:seed": "npx tsx prisma/seed.ts"
}
```

## Errores Comunes y Soluciones

### Prisma Client no encontrado en Vercel

**Error**: `ReferenceError: PrismaClient is not defined`

**Causa**: Prisma 7.x no exporta correctamente en builds de Vercel.

**Solución**:
1. Ensure `package.json` tiene `"postinstall": "prisma generate"`
2. Ensure `vercel.json` tiene `"postInstallPatchPrisma": true`
3. Regenerar: `npm run postinstall`

### Error 500 en producción

**Causa**: DATABASE_URL no configurada en Vercel.

**Solución**: Agregar en Vercel Settings → Environment Variables.

## Diseño UI

- **Colores**: cyan-600 (#0891b2) para agua, orange-500 (#f97316) para soda
- **Font**: Inter
- **Moneda**: Pesos Argentinos ($AR)

## Estructura Pages

```
/                     → Dashboard
/clientes             → Lista clientes
/clientes/nuevo       → Crear cliente
/productos           → Lista productos
/presupuestos        → Lista presupuestos
/presupuestos/nuevo → Nuevo presupuesto
```

## Estructura API

```
/api/clientes         → GET, POST
/api/clientes/[id]    → GET, PUT, DELETE
/api/productos        → GET, POST
/api/productos/[id]   → GET, PUT, DELETE
/api/presupuestos     → GET, POST
/api/presupuestos/[id]→ GET, PUT, DELETE
/api/presupuestos/[id]/pdf → GET
```