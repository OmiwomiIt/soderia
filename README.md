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

- Next.js 14 (App Router) + React + TypeScript
- Tailwind CSS
- Prisma ORM + SQLite
- jsPDF para generación de PDF

## Ejecutar localmente

```bash
cd soderia
npm install
npm run dev
```

Abrir http://localhost:3000

## Datos de ejemplo

- Cliente: "Empresa Demo"
- Productos: Agua (500ml-20L) y Soda (500ml-2L)