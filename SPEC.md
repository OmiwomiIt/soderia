# SPEC.md - Sistema de Presupuestos Sodería

## 1. Project Overview

- **Project name**: Soderia - Sistema de Presupuestos
- **Type**: Aplicación web fullstack
- **Core functionality**: Generación de presupuestos para empresa de distribución de agua embotellada y soda, con exportación a PDF y almacenamiento para consultas futuras
- **Target users**: Empresa de distribución de agua embotellada y soda

## 2. Tech Stack

- **Frontend**: Next.js 14 (App Router) + React + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: API Routes de Next.js
- **Base de datos**: SQLite con Prisma ORM
- **PDF**: jsPDF + jspdf-autotable
- **UI Components**: shadcn/ui

## 3. UI/UX Specification

### Layout Structure

- **Header**: Logo + Navigation + Empresa nombre
- **Sidebar** (desktop): Menú de navegación
- **Main content**: Área de trabajo
- **Responsive**: Mobile-first, breakpoints: sm (640px), md (768px), lg (1024px)

### Visual Design

**Paleta de colores**:
- Primary: `#0891b2` (cyan-600) - Color institucional agua
- Primary dark: `#0e7490` (cyan-700)
- Secondary: `#f97316` (orange-500) - Soda
- Secondary dark: `#ea580c` (orange-600)
- Background: `#f8fafc` (slate-50)
- Surface: `#ffffff`
- Text primary: `#0f172a` (slate-900)
- Text secondary: `#64748b` (slate-500)
- Success: `#22c55e` (green-500)
- Error: `#ef4444` (red-500)

**Tipografía**:
- Font family: `Inter` (Google Fonts)
- Headings: 700 weight
  - H1: 2.5rem (40px)
  - H2: 2rem (32px)
  - H3: 1.5rem (24px)
- Body: 400 weight, 1rem (16px)
- Small: 0.875rem (14px)

**Spacing**: Escala base 4px (0.25rem)

**Border radius**:
- Small: 4px
- Medium: 8px
- Large: 12px
- XL: 16px

**Sombras**:
- sm: `0 1px 2px rgba(0,0,0,0.05)`
- md: `0 4px 6px rgba(0,0,0,0.1)`
- lg: `0 10px 15px rgba(0,0,0,0.1)`

### Components

**Buttons**:
- Primary: Background cyan-600, white text, hover cyan-700
- Secondary: Background orange-500, white text, hover orange-600
- Outline: Border 2px, transparent background
- Ghost: Sin background, hover slate-100
- Estados: hover, active, disabled

**Cards**:
- Background white
- Border radius 12px
- Shadow md
- Padding 24px

**Forms**:
- Labels above inputs
- Input: border slate-300, focus ring cyan-600
- Error: border red-500, mensaje rojo

**Tables**:
- Header: bg slate-100, font-semibold
- Rows: hover bg slate-50
- Border bottom

**Modals**:
- Overlay: bg-black/50
- Card centered
- Close button top-right

## 4. Data Models

### Cliente
```prisma
model Cliente {
  id          Int         @id @default(autoincrement())
  nombre      String
  email       String?
  telefono    String?
  direccion   String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  presupuestos Presupuesto[]
}
```

### Producto
```prisma
model Producto {
  id          Int         @id @default(autoincrement())
  nombre      String
  descripcion String?
  tipo        TipoProducto // AGUA o SODA
  presentacion String    // 500ml, 1L, 5L, etc.
  precio      Float
  activo      Boolean     @default(true)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  detalle     DetallePresupuesto[]
}

enum TipoProducto {
  AGUA
  SODA
}
```

### Presupuesto
```prisma
model Presupuesto {
  id            Int         @id @default(autoincrement())
  numero        String      @unique
  clienteId     Int
  cliente       Cliente     @relation(fields: [clienteId], references: [id])
  subtotal      Float      // = total (sin IVA)
  iva          Float      // = 0 (IVA incluido en precio)
  total        Float
  observaciones String?
  estado       EstadoPresupuesto @default(BORRADOR)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  detalles     DetallePresupuesto[]
}

enum EstadoPresupuesto {
  BORRADOR
  ENVIADO
  ACEPTADO
  RECHAZADO
}
```

### DetallePresupuesto
```prisma
model DetallePresupuesto {
  id             Int         @id @default(autoincrement())
  presupuestoId Int
  presupuesto   Presupuesto @relation(fields: [presupuestoId], references: [id])
  productoId     Int
  producto       Producto    @relation(fields: [productoId], references: [id])
  cantidad       Int
  precioUnitario Float
  total          Float
}
```

## 5. Funcionalidades

### 5.1 Dashboard
- Resumen de presupuestos del mes
- Recent presupuestos rápido acceso
- Stats: Total presupuestos, pendientes, enviados

### 5.2 Gestión de Clientes
- **Listar**: Tabla con búsqueda y filtros
- **Crear**: Modal formulario con validación
- **Editar**: Mismo formulario
- **Eliminar**: Confirmación

### 5.3 Gestión de Productos
- **Listar**: Filtrar por tipo (Agua/Soda)
- **Crear/Editar**: Nombre, tipo, presentación, precio
- **Activar/Desactivar**: Soft delete

### 5.4 Generación de Presupuestos
- **Nuevo presupuesto**:
  1. Seleccionar cliente (buscador)
  2. Agregar productos (buscador + cantidad)
  3. Sistema calcula subtotal, IVA (16%), total
  4. Agregar observaciones
  5. Guardar como borrador o enviar

- **Editar presupuesto** (solo estados BORRADOR o RECHAZADO)
- **Cambiar estado**: Con historial

### 5.5 Exportar a PDF
- **Formato PDF profesional**:
  - Logo empresa
  - Datos presupuesto número y fecha
  - Datos cliente
  - Tabla productos con precios
  - Subtotal, IVA, Total
  - Observaciones
  - Pie de página

### 5.6 Historial y Consultas
- Lista de todos los presupuestos
- Filtrar por estado, cliente, fecha
- Ver detalle completo
- Re-enviar PDF

## 6. Pages Structure

```
/                       -> Dashboard
/clientes               -> Lista clientes
/clientes/nuevo         -> Crear cliente
/clientes/[id]          -> Editar cliente
/productos              -> Lista productos
/productos/nuevo        -> Crear producto
/productos/[id]         -> Editar producto
/presupuestos           -> Lista presupuestos
/presupuestos/nuevo     -> Nuevo presupuesto
/presupuestos/[id]      -> Ver presupuesto
/presupuestos/[id]/edit -> Editar presupuesto
```

## 7. API Endpoints

```
GET    /api/clientes           -> Listar clientes
POST   /api/clientes          -> Crear cliente
GET    /api/clientes/[id]      -> Get cliente
PUT    /api/clientes/[id]     -> Actualizar cliente
DELETE /api/clientes/[id]     -> Eliminar cliente

GET    /api/productos         -> Listar productos
POST   /api/productos         -> Crear producto
GET    /api/productos/[id]   -> Get producto
PUT    /api/productos/[id]    -> Actualizar producto
DELETE /api/productos/[id]   -> Eliminar producto

GET    /api/presupuestos      -> Listar presupuestos
POST   /api/presupuestos      -> Crear presupuesto
GET    /api/presupuestos/[id] -> Get presupuesto
PUT    /api/presupuestos/[id]-> Actualizar presupuesto
DELETE /api/presupuestos/[id]-> Eliminar presupuesto

GET    /api/presupuestos/[id]/pdf -> Generar PDF
```

## 8. Acceptance Criteria

1. ✅ Dashboard muestra estadísticas del negocio
2. ✅ CRUD completo de clientes con validación
3. ✅ CRUD completo de productos (agua/soda)
4. ✅ Crear presupuesto con cálculo automático de totales
5. ✅ Exportar presupuesto a PDF descargable
6. ✅ Lista de presupuestos con filtros
7. ✅ Historial de cambios de estado
8. ✅ Diseño responsive (mobile y desktop)
9. ✅ Interfaz intuitiva y profesional
10. ✅ Datos persistidos en SQLite

## 9. Seed Data

### Productos iniciales (precios en Pesos Argentinos - $AR)
- Agua purificada 500ml - $AR 500
- Agua purificada 1L - $AR 800
- Agua purificada 5L - $AR 2,500
- Agua purificada 20L - $AR 6,000
- Soda de sabores 500ml - $AR 600
- Soda de sabores 1L - $AR 1,000
- Soda de sabores 2L - $AR 1,800

### Notas técnicas
- Moneda: Pesos Argentinos ($AR)
- IVA: Incluido en precios (no se muestra separately)
- Base de datos: SQLite local