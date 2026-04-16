# Sodería - Design System

## Project Info

- **Name**: Sodería
- **Type**: Web App (Mobile-first)
- **Stack**: Next.js 16 + Tailwind CSS 4 + shadcn/ui
- **Database**: Neon PostgreSQL
- **Purpose**: Sistema de presupuestos para distribución de agua embotellada y soda

---

## Color Palette

| Token | Role | Hex |
|:---|:---|:---|
| primary | Agua/Distribución | #0ea5e9 (sky-500) |
| primary-dark | Hover states | #0284c7 (sky-600) |
| primary-light | Backgrounds | #e0f2fe (sky-100) |
| secondary | Soda/Bebidas | #f97316 (orange-500) |
| secondary-dark | Hover states | #ea580c (orange-600) |
| secondary-light | Backgrounds | #ffedd5 (orange-100) |
| background | Page background | #f8fafc (slate-50) |
| surface | Cards/Modals | #ffffff |
| text-primary | Headings | #1e293b (slate-800) |
| text-secondary | Body text | #475569 (slate-600) |
| text-muted | Captions | #94a3b8 (slate-400) |
| border | Borders | #e2e8f0 (slate-200) |
| success | Success states | #22c55e |
| error | Error states | #ef4444 |
| warning | Warning states | #f59e0b |

---

## Typography

- **Font**: Inter (Google Fonts)
- **Scale**: 12px base
- **Headings**:
  - H1: 2.25rem (36px), font-bold
  - H2: 1.875rem (30px), font-semibold
  - H3: 1.5rem (24px), font-semibold
- **Body**: 1rem (16px), font-normal
- **Small**: 0.875rem (14px)
- **Caption**: 0.75rem (12px)

---

## Spacing

- **Base unit**: 4px
- **Scale**: 1(4px), 2(8px), 3(12px), 4(16px), 5(20px), 6(24px), 8(32px), 10(40px), 12(48px)
- **Container max-width**: 1280px
- **Content padding**: 16px (móvil), 24px (tablet+)

---

## Border Radius

| Token | Value | Usage |
|:---|:---|:---|
| sm | 4px | Inputs, small buttons |
| md | 8px | Cards, tables |
| lg | 12px | Modals, dialogs |
| xl | 16px | Main containers |
| full | 9999px | Avatars, badges |

---

## Shadows

| Token | Value | Usage |
|:---|:---|:---|
| sm | 0 1px 2px rgba(0,0,0,0.05) | Subtle elevation |
| md | 0 4px 6px -1px rgba(0,0,0,0.1) | Cards, dropdowns |
| lg | 0 10px 15px -3px rgba(0,0,0,0.1) | Modals, hero sections |
| xl | 0 20px 25px -5px rgba(0,0,0,0.1) | Floating elements |

---

## Components

### Buttons

- **Primary**: bg-sky-500, text-white, h-11 (44px touch), rounded-lg
- **Secondary**: bg-slate-100, text-slate-700, h-11, rounded-lg
- **Ghost**: bg-transparent, text-slate-600, h-10
- **Danger**: bg-red-500, text-white, h-11, rounded-lg

### Inputs

- **Height**: 48px (h-12) for touch-friendly
- **Border**: 1px solid slate-200
- **Focus**: ring-2 ring-sky-500/20
- **Border radius**: rounded-lg

### Cards

- **Background**: white
- **Border**: 1px slate-200
- **Border radius**: rounded-xl
- **Shadow**: shadow-sm
- **Padding**: p-6

### Modals

- **Overlay**: bg-black/50
- **Surface**: white, rounded-xl, shadow-lg
- **Width**: max-w-md (mobile), max-w-lg (desktop)
- **Animation**: fade-in + scale-up

### Tables

- **Header**: bg-slate-50, text-sm font-medium
- **Rows**: border-b slate-100
- **Hover**: bg-slate-50

---

## Layout

### Mobile (< 1024px)

- **Bottom Navigation**: Fixed, 64px height, 4 items
- **Header**: Fixed top, 56px height
- **Content**: p-4, pb-20 (for bottom nav)

### Desktop (≥ 1024px)

- **Top Navigation**: Fixed, 56px height, horizontal tabs
- **Sidebar**: None (tabs instead)
- **Content**: p-6, pl-64 (for nav width)

---

## Animations

- **Transitions**: 150ms ease-out
- **Hover**: scale(1.02) on cards
- **Modals**: animate-in fade-in zoom-in
- **Loading**: spin animation, sky-500

---

## Currency

- **Symbol**: $AR
- **Format**: $AR 1,234.56
- **Locale**: es-MX (Argentine pesos)

---

## States

| Entity | States |
|:---|:---|
| Cliente | activo (boolean) |
| Producto | activo (boolean) |
| Presupuesto | BORRADOR, ENVIADO, ACEPTADO, RECHAZADO |
| Usuario | activo (boolean), rol (ADMIN/USUARIO) |