# Kiwi — Plataforma de Acciones Fraccionadas

Kiwi es una plataforma web para comprar y vender acciones fraccionadas de empresas americanas (USA). Permite invertir desde $1 USD en empresas como Apple, Tesla, NVIDIA y más, con soporte para Dollar-Cost Averaging automático, gráficos en tiempo real y un hub educacional integrado.

> **Paper Trading**: Por defecto usa Alpaca Paper Trading, lo que significa que toda la operatoria es con dinero simulado — ideal para aprender sin riesgo real.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Estilos | Tailwind CSS + shadcn/ui |
| Base de datos | Prisma + PostgreSQL (Supabase) |
| Autenticación | Clerk |
| Órdenes | Alpaca Markets API (Paper Trading) |
| Datos de mercado | Polygon.io (WebSocket + REST) |
| Gráficos | TradingView Lightweight Charts |
| Email | Resend |
| Deploy | Vercel |

## Funcionalidades del MVP

### Acciones fraccionadas
- Búsqueda en tiempo real de tickers (AAPL, TSLA, NVDA...)
- Vista de detalle con precio live via WebSocket
- Formulario de compra/venta por monto en USD o cantidad de acciones
- Soporte completo para fracciones (ej: $10 de AAPL = 0.0527 acciones)
- Integración con Alpaca Paper Trading API

### Portfolio & Dashboard
- Valor total del portafolio con P&L diario y total
- Gráfico de evolución temporal (área chart)
- Lista de posiciones con precio actual y variación
- Métricas: retorno total, mejor/peor posición

### Historial de transacciones
- Tabla completa de órdenes con filtros
- Filtrar por ticker, tipo (compra/venta) y estado
- Exportar a CSV

### Gráficos de precios
- Candlestick chart con TradingView Lightweight Charts
- Timeframes: 1D, 1W, 1M, 3M, 1Y
- Indicadores: SMA 20 (azul), SMA 50 (amarillo), volumen
- Precio en tiempo real via Polygon.io WebSocket

### Hub Educacional
- Artículos en formato MDX en `/content/articles/`
- Categorías: Conceptos básicos, Estrategias, FAQ, Avanzado
- Progress tracking del usuario
- Artículos incluidos:
  - ¿Qué son las acciones fraccionadas?
  - Dollar-Cost Averaging (DCA)
  - Cómo leer un gráfico de velas
  - Preguntas Frecuentes

### Operaciones programadas (DCA)
- Crear órdenes de compra recurrentes (diario / semanal / quincenal / mensual)
- Panel para gestionar y pausar/activar órdenes
- Notificaciones por email via Resend
- Cron jobs con Vercel Cron (9am y 2pm ET, días de semana)

## Estructura del proyecto

```
kiwi/
├── app/
│   ├── (app)/                    # Rutas autenticadas
│   │   ├── layout.tsx            # Layout con sidebar
│   │   ├── dashboard/page.tsx    # Dashboard principal
│   │   ├── portfolio/page.tsx    # Portfolio detallado
│   │   ├── explore/              # Búsqueda de acciones
│   │   │   └── [symbol]/page.tsx # Detalle de acción
│   │   ├── history/page.tsx      # Historial de órdenes
│   │   ├── education/            # Hub educacional
│   │   │   └── [slug]/page.tsx   # Artículo individual
│   │   ├── scheduled/page.tsx    # Órdenes programadas
│   │   └── settings/page.tsx     # Ajustes de cuenta
│   ├── (auth)/                   # Rutas de autenticación
│   │   ├── sign-in/              # Login con Clerk
│   │   └── sign-up/              # Registro con Clerk
│   ├── api/
│   │   ├── stocks/               # Búsqueda y datos de mercado
│   │   ├── orders/               # CRUD de órdenes (Alpaca)
│   │   ├── portfolio/            # Estado del portafolio
│   │   ├── scheduled-orders/     # Órdenes programadas
│   │   ├── webhooks/clerk/       # Webhook de Clerk
│   │   └── cron/scheduled-orders/ # Cron job para DCA
│   ├── layout.tsx                # Root layout (Clerk + Sonner)
│   └── page.tsx                  # Landing page
├── components/
│   ├── layout/                   # Sidebar + mobile nav
│   ├── dashboard/                # Stats, charts, positions
│   ├── stock/                    # Search, price chart, trade form
│   ├── portfolio/                # Position cards
│   ├── orders/                   # History table, scheduled list
│   └── ui/                       # shadcn/ui components
├── content/articles/             # Artículos MDX
├── hooks/
│   ├── use-portfolio.ts          # Fetch del portfolio
│   ├── use-stock-price.ts        # WebSocket + polling
│   ├── use-orders.ts             # Historial de órdenes
│   └── use-debounce.ts           # Debounce utility
├── lib/
│   ├── alpaca.ts                 # Cliente Alpaca API
│   ├── polygon.ts                # Cliente Polygon.io
│   ├── prisma.ts                 # Prisma client singleton
│   ├── mdx.ts                    # Lector de artículos MDX
│   ├── mock-data.ts              # Datos mock para desarrollo
│   └── utils.ts                  # Utilidades (formateo, cálculos)
├── prisma/schema.prisma          # Schema de base de datos
├── types/index.ts                # Tipos TypeScript globales
├── middleware.ts                 # Clerk middleware
├── vercel.json                   # Cron jobs config
└── .env.example                  # Variables de entorno ejemplo
```

## Setup

### 1. Clonar y instalar dependencias

```bash
git clone <repo>
cd kiwi
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env.local
```

Completá las siguientes variables:

| Variable | Descripción | Dónde obtenerla |
|----------|-------------|-----------------|
| `DATABASE_URL` | PostgreSQL connection string | Supabase > Settings > Database |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | Clerk Dashboard > API Keys |
| `CLERK_SECRET_KEY` | Clerk secret key | Clerk Dashboard > API Keys |
| `ALPACA_API_KEY` | Alpaca Paper API key | alpaca.markets > Paper Trading |
| `ALPACA_SECRET_KEY` | Alpaca Paper secret | alpaca.markets > Paper Trading |
| `POLYGON_API_KEY` | Polygon.io API key | polygon.io > Dashboard |
| `NEXT_PUBLIC_POLYGON_API_KEY` | Polygon.io key (client) | Mismo que arriba |
| `RESEND_API_KEY` | Resend API key | resend.com > API Keys |
| `CRON_SECRET` | Secret para autenticar cron | Cualquier string seguro |

### 3. Base de datos (Supabase)

1. Crear un proyecto en [supabase.com](https://supabase.com)
2. Copiar la connection string en `DATABASE_URL`
3. Aplicar el schema:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Clerk (Autenticación)

1. Crear una aplicación en [clerk.com](https://clerk.com)
2. Copiar las keys en `.env.local`
3. Configurar el webhook en Clerk Dashboard:
   - URL: `https://tu-dominio.com/api/webhooks/clerk`
   - Eventos: `user.created`, `user.updated`, `user.deleted`

### 5. Alpaca (Paper Trading)

1. Crear cuenta en [alpaca.markets](https://alpaca.markets)
2. Ir a **Paper Trading** en el dashboard
3. Crear API Keys de Paper Trading
4. El endpoint base es `https://paper-api.alpaca.markets` (ya configurado)

### 6. Polygon.io (Datos de mercado)

1. Crear cuenta en [polygon.io](https://polygon.io)
2. El plan gratuito incluye datos históricos y snapshots
3. El WebSocket requiere plan de pago (en desarrollo funciona con polling)

### 7. Correr en desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Deploy en Vercel

```bash
npm install -g vercel
vercel
```

O conectá el repo en [vercel.com](https://vercel.com) y configurá las variables de entorno.

El archivo `vercel.json` configura los cron jobs:
- **9:00 AM ET** y **2:00 PM ET** de lunes a viernes
- Ejecuta las órdenes programadas pendientes

## Comandos útiles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Prisma Studio (GUI de la base de datos)
npx prisma studio

# Generar tipos de Prisma
npx prisma generate

# Aplicar migraciones
npx prisma migrate dev

# Ver esquema de la base de datos
npx prisma db pull
```

## Agregar artículos al Hub Educacional

1. Crear un archivo `.mdx` en `/content/articles/`
2. Usar el siguiente frontmatter:

```mdx
---
title: "Título del artículo"
excerpt: "Descripción corta"
category: BASICS  # BASICS | STRATEGIES | FAQ | ADVANCED
tags: ["tag1", "tag2"]
readTime: 5  # minutos
publishedAt: "2024-03-01"
---

# Contenido del artículo

Tu contenido en Markdown aquí...
```

3. El artículo aparece automáticamente en `/education`

## Notas importantes

- **Paper Trading**: Por seguridad, el modo por defecto es Alpaca Paper Trading. Ninguna orden se ejecuta con dinero real.
- **API Keys**: Nunca commitees `.env.local`. Está en `.gitignore` por defecto.
- **WebSocket**: El WebSocket de Polygon.io para precios en tiempo real requiere plan de pago. Con el plan gratuito se usa polling cada 10 segundos como fallback.
- **Cron Jobs**: Los cron jobs de Vercel requieren plan Pro. Para desarrollo local podés llamar al endpoint manualmente.

## Licencia

MIT
