# 🥬 Fresco - Tu Asistente de Cocina y Stock

Fresco es una aplicación móvil que te ayuda a gestionar tu stock de alimentos, recibir alertas de vencimiento y descubrir recetas simples con lo que tienes disponible.

## Características

📸 **Subida de Fotos**
- Sube fotos de tus tickets de compra o productos
- IA extrae automáticamente los productos y sus detalles

⏰ **Alertas de Vencimiento**
- Notificaciones inteligentes de productos próximos a vencer
- Recordatorios de productos abiertos

🍳 **Sugerencias de Recetas**
- Recetas simples basadas en los productos que tienes
- Pasos claros y tiempos de preparación

## Tecnología

- **Frontend**: Next.js 16 + React 19 + TailwindCSS v4
- **Backend**: Server Components + Server Actions
- **Base de Datos**: Supabase (PostgreSQL)
- **Almacenamiento**: Vercel Blob
- **IA**: OpenAI GPT-4 Vision para análisis de imágenes
- **Autenticación**: Supabase Auth

## Configuración Inicial

### 1. Crear Tablas en Supabase

Copia y ejecuta el contenido de `scripts/001_create_tables.sql` en el SQL Editor de Supabase.

Luego ejecuta `scripts/002_rls_policies.sql` para configurar las políticas de seguridad.

### 2. Variables de Entorno

Las siguientes variables se configuran automáticamente con las integraciones:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `BLOB_READ_WRITE_TOKEN`

Para el Cron Job, configura:
- `CRON_SECRET`: Token para verificar llamadas de cron

### 3. Desarrollo Local

```bash
pnpm install
pnpm dev
```

## Estructura del Proyecto

```
app/
├── auth/               # Autenticación
├── dashboard/          # Dashboard principal
├── notifications/      # Página de notificaciones
├── recipes/           # Sugerencias de recetas
├── api/               # APIs
│   ├── products/      # CRUD de productos
│   ├── notifications/ # Manejo de notificaciones
│   └── cron/          # Trabajos programados
└── actions/           # Server actions

components/
├── dashboard/         # Componentes del dashboard
└── notifications/     # Componentes de notificaciones

lib/
├── supabase/         # Clientes de Supabase
└── utils.ts          # Utilidades
```

## Cron Jobs

La aplicación utiliza Vercel Crons para generar notificaciones diarias:

- **`/api/cron/check-expiration`**: Se ejecuta a las 9 AM
  - Genera alertas de productos próximos a vencer
  - Envía recordatorios de productos abiertos

Configura `CRON_SECRET` en Vercel para que funcione.

## Base de Datos

### Tabla: products
- `id`: UUID
- `user_id`: UUID (referencia a auth.users)
- `name`: Nombre del producto
- `category`: Categoría (verduras, frutas, lacteos, carnes, granos, condimentos, otros)
- `quantity`: Cantidad
- `unit`: Unidad de medida
- `purchase_date`: Fecha de compra
- `expiration_date`: Fecha de vencimiento
- `opened`: ¿Está abierto?
- `opened_date`: Fecha de apertura
- `image_url`: URL de la foto
- `created_at`, `updated_at`: Timestamps

### Tabla: purchases
- `id`: UUID
- `user_id`: UUID
- `image_url`: URL de la foto del ticket
- `store_name`: Nombre de la tienda
- `total_amount`: Monto total
- `purchase_date`: Fecha de compra
- `processed`: ¿Fue procesada?
- `created_at`: Timestamp

### Tabla: notifications
- `id`: UUID
- `user_id`: UUID
- `product_id`: UUID (opcional, referencia a products)
- `type`: Tipo (opened_check, expiration_warning, recipe_suggestion)
- `message`: Mensaje de la notificación
- `read`: ¿Fue leída?
- `scheduled_for`: Fecha programada
- `created_at`: Timestamp

## Flujo de Usuarios

1. **Autenticación**: Los usuarios se registran o ingresan con email y contraseña
2. **Subir Foto**: Suben una foto de su compra
3. **Procesamiento**: La IA extrae los productos automáticamente
4. **Gestión**: Ven sus productos y pueden marcarlos como abiertos
5. **Alertas**: Reciben notificaciones de productos próximos a vencer
6. **Recetas**: Descubren recetas simples basadas en sus productos

## Notas Importantes

- La app utiliza Row Level Security (RLS) para proteger los datos de cada usuario
- Las fotos se almacenan en Vercel Blob (privadas)
- La IA procesa solo las imágenes subidas por los usuarios
- Las notificaciones se generan automáticamente mediante cron jobs
