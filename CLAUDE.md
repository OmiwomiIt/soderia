# CLAUDE.md - Proyecto Sodería

## Información del Proyecto

- **Nombre**: Sodería - Sistema de Presupuestos
- **Tipo**: Aplicación web fullstack Next.js
- **URL Producción**: https://soderia.vercel.app/
- **Repositorio**: https://github.com/OmiwomiIt/soderia

## Tech Stack

- Next.js 16 (App Router) + React + TypeScript
- Tailwind CSS
- Prisma ORM
- Neon PostgreSQL
- jsPDF + jspdf-autotable
- shadcn/ui

## Estructura del Proyecto

```
soderia/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard
│   │   ├── clientes/             # Gestión clientes
│   │   ├── productos/           # Gestión productos
│   │   ├── presupuestos/       # Gestión presupuestos
│   │   └── api/                # Endpoints API
│   ├── lib/
│   │   └── prisma.ts           # Cliente Prisma
│   └── components/             # Componentes UI
├── prisma/
│   ├── schema.prisma          # Modelos de datos
│   └── seed.ts               # Datos de ejemplo
├── .env                      # Variables locales
├── package.json              # Dependencias y scripts
├── vercel.json              # Config Vercel
└── tailwind.config.ts        # Config Tailwind
```

## Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build producción
npm run build

# Sincronizar DB
npm run db:push

# Poblar datos ejemplo
npm run db:seed

# Regenerar Prisma client
npm run postinstall
```

## Configuración Requerida

### Variables de Entorno (.env local)
```
DATABASE_URL="postgresql://neondb_owner:npg_QcaTsu1POCr9@ep-aged-cloud-anjztkxc.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### Vercel
Agregar en Settings → Environment Variables:
- `DATABASE_URL`: conexión PostgreSQL de Neon

## Modelos de Datos

- **Cliente**: nombre, email, telefono, direccion
- **Producto**: nombre, descripcion, tipo (AGUA/SODA), presentacion, precio, activo
- **Presupuesto**: numero, cliente, subtotal, iva, total, observaciones, estado
- **DetallePresupuesto**: presupuesto, producto, cantidad, precioUnitario, total

## Notas Importantes

1. **Prisma Client**: El script `postinstall` regenera el cliente después de `npm install`
2. **Vercel**: Requiere DATABASE_URL configurada para funcionar
3. **Moneda**: Pesos Argentinos ($AR) - precios incluye IVA
4. **Estados Presupuesto**: BORRADOR, ENVIADO, ACEPTADO, RECHAZADO