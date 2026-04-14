# Estructura del Proyecto Fresco

## Resumen Ejecutivo

Fresco es una aplicación web móvil full-stack para gestionar stock de alimentos, recibir alertas de vencimiento y obtener sugerencias de recetas. Utiliza Next.js 16, Supabase para la base de datos, Vercel Blob para almacenamiento de imágenes y OpenAI GPT-4 Vision para análisis de fotos.

## Directorios Principales

### `/app`
Rutas y páginas de la aplicación Next.js.

#### `/app/auth`
- `login/page.tsx` - Página de ingreso
- `sign-up/page.tsx` - Página de registro
- `sign-up-success/page.tsx` - Confirmación post-registro
- `error/page.tsx` - Página de error de autenticación
- `callback/route.ts` - Callback de Supabase Auth

#### `/app/dashboard`
- `page.tsx` - Panel principal con lista de productos
- `layout.tsx` - Layout con navegación móvil

#### `/app/notifications`
- `page.tsx` - Historial de notificaciones
- `layout.tsx` - Layout con navegación

#### `/app/recipes`
- `page.tsx` - Sugerencias de recetas con IA
- `layout.tsx` - Layout con navegación

#### `/app/api`
- `/products/route.ts` - API CRUD de productos
- `/notifications/route.ts` - API de notificaciones
- `/cron/check-expiration/route.ts` - Cron job para alertas

#### `/app/actions`
- `auth.ts` - Server actions de autenticación
- `upload.ts` - Server action para subida de fotos
- `ai.ts` - Funciones de análisis con IA
- `notifications.ts` - Acciones de notificaciones

### `/components`
Componentes React reutilizables.

#### `/components/dashboard`
- `header.tsx` - Header con perfil de usuario
- `photo-upload.tsx` - Componente de subida de fotos
- `products-list.tsx` - Lista de productos con suscripción realtime
- `product-card.tsx` - Tarjeta individual de producto
- `quick-stats.tsx` - Estadísticas rápidas
- `notifications-bell.tsx` - Campana flotante de notificaciones
- `mobile-nav.tsx` - Navegación móvil inferior
- `product-details-modal.tsx` - Modal de detalles del producto

#### `/components/notifications`
- `notification-item.tsx` - Componente individual de notificación

#### `/components/ui`
- `skeleton.tsx` - Componente de loading skeleton

### `/lib`
Utilidades y configuraciones.

#### `/lib/supabase`
- `client.ts` - Cliente de Supabase para navegador
- `server.ts` - Cliente de Supabase para servidor
- `proxy.ts` - Proxy para manejar cookies de sesión

- `utils.ts` - Funciones de utilidad (fechas, emojis, etc)

### `/scripts`
Scripts SQL para configuración de base de datos.

- `001_create_tables.sql` - Creación de tablas
- `002_rls_policies.sql` - Políticas de Row Level Security

### Raíz
- `middleware.ts` - Middleware de Next.js para manejo de sesiones
- `layout.tsx` - Layout raíz de la aplicación
- `page.tsx` - Página de inicio
- `globals.css` - Estilos globales y variables CSS
- `vercel.json` - Configuración de cron jobs
- `package.json` - Dependencias del proyecto
- `tsconfig.json` - Configuración de TypeScript
- `next.config.mjs` - Configuración de Next.js

## Documentación Disponible

- **README.md** - Documentación técnica completa
- **SETUP.md** - Guía paso a paso de configuración
- **QUICKSTART.md** - Guía rápida de inicio
- **PROJECT_STRUCTURE.md** - Este archivo

## Stack Tecnológico

### Frontend
- Next.js 16 con App Router
- React 19
- TailwindCSS v4
- TypeScript

### Backend
- Next.js Server Components y Server Actions
- AI SDK 6 (OpenAI GPT-4 Vision)

### Base de Datos
- Supabase (PostgreSQL)
- Row Level Security (RLS)
- Realtime Subscriptions

### Almacenamiento
- Vercel Blob (imágenes privadas)

### Autenticación
- Supabase Auth (Email/Password)
- JWT tokens con refresh automático

### Deployment
- Vercel (con Cron Jobs)

## Flujo de Datos

```
1. Usuario se registra/inicia sesión
   ↓
2. Dashboard carga productos desde Supabase
   ↓
3. Usuario sube foto
   ↓
4. Foto se guarda en Vercel Blob
   ↓
5. AI analiza imagen y extrae productos
   ↓
6. Productos se guardan en Supabase
   ↓
7. Dashboard se actualiza en realtime
   ↓
8. Cron job diario genera notificaciones
   ↓
9. Usuario ve alertas de vencimiento
   ↓
10. Usuario obtiene recetas sugeridas
```

## Base de Datos Schema

### Tabla: products
```sql
id UUID PRIMARY KEY
user_id UUID (FK: auth.users)
name TEXT
category TEXT
quantity INTEGER
unit TEXT
purchase_date DATE
expiration_date DATE
opened BOOLEAN
opened_date DATE
image_url TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
```

### Tabla: purchases
```sql
id UUID PRIMARY KEY
user_id UUID (FK: auth.users)
image_url TEXT
store_name TEXT
total_amount DECIMAL
purchase_date DATE
processed BOOLEAN
created_at TIMESTAMP
```

### Tabla: notifications
```sql
id UUID PRIMARY KEY
user_id UUID (FK: auth.users)
product_id UUID (FK: products, nullable)
type TEXT
message TEXT
read BOOLEAN
scheduled_for TIMESTAMP
created_at TIMESTAMP
```

## Variables de Entorno Requeridas

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
BLOB_READ_WRITE_TOKEN=
CRON_SECRET=
NEXT_PUBLIC_APP_URL=
```

## Features Implementadas

### Autenticación
- ✅ Registro con email/password
- ✅ Login seguro
- ✅ Logout
- ✅ Protección de rutas

### Gestión de Productos
- ✅ Subida de fotos (Vercel Blob)
- ✅ Análisis con IA (OpenAI GPT-4)
- ✅ Extracción automática de productos
- ✅ Edición de estado (abierto/cerrado)
- ✅ Eliminación de productos

### Notificaciones
- ✅ Alertas de vencimiento
- ✅ Recordatorios de productos abiertos
- ✅ Notificaciones de recetas
- ✅ Historial de notificaciones
- ✅ Marcar como leído/eliminado
- ✅ Cron job automático

### Recetas
- ✅ Generación con IA basada en productos
- ✅ Ingredientes, pasos y tiempo
- ✅ Actualización dinámica

### UX/UI
- ✅ Mobile-first design
- ✅ Colores cálidos (naranja, rojo, terracota)
- ✅ Navegación móvil inferior
- ✅ Animaciones y transiciones
- ✅ Estados de loading
- ✅ Mensajes de error/éxito

### Performance
- ✅ Server Components para renderizado rápido
- ✅ Realtime subscriptions con Supabase
- ✅ Lazy loading de imágenes
- ✅ Caching inteligente

## Cómo Extender

### Agregar Nueva Categoría de Producto
1. Editar `/lib/utils.ts` - función `getCategoryEmoji()`
2. Actualizar prompt de IA en `/app/actions/ai.ts`

### Cambiar Horario del Cron
1. Editar `vercel.json` - campo `schedule`
2. Formato: `minute hour day month weekday`

### Agregar Nuevo Tipo de Notificación
1. Crear tipo en `/app/api/cron/check-expiration/route.ts`
2. Actualizar emojis en `/components/notifications/notification-item.tsx`

### Integrar Otros Servicios
- Usar Supabase Edge Functions para lógica más compleja
- Agregar webhooks de terceros
- Integrar con servicios de email

## Testing

Para probar en local:
```bash
pnpm install
pnpm dev
```

Accede a `http://localhost:3000`

## Deployment

La app está lista para Vercel:
```bash
git push origin main
```

Vercel desplegará automáticamente con:
- Build optimizado
- Cron jobs configurados
- Variables de entorno automáticas
- Blob storage listo
