# Fresco - Guía Rápida de Inicio

¡Bienvenido a Fresco! Tu asistente de cocina y stock. Aquí te mostramos cómo empezar en 3 pasos.

## 1. Crear Tablas en Supabase (IMPORTANTE)

Antes de que funcione la app, necesitas crear las tablas en tu base de datos:

1. Ve a tu proyecto de Supabase
2. Abre **SQL Editor**
3. Copia todo el contenido de `/scripts/001_create_tables.sql`
4. Ejecuta la query
5. Copia todo el contenido de `/scripts/002_rls_policies.sql`
6. Ejecuta esta segunda query

**¿Por qué?** Las tablas almacenan tus productos, compras y notificaciones.

## 2. Verificar Variables de Entorno

Verifica que en Vercel → Project Settings → Environment Variables estén configuradas:

- `NEXT_PUBLIC_SUPABASE_URL` ✓
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✓
- `BLOB_READ_WRITE_TOKEN` ✓

Si faltan, cópialas de:
- **Supabase**: Settings → API
- **Vercel Blob**: Blob Storage → Tokens

## 3. Usar la App

### Flujo Básico:

1. **Registrarse** → Crea tu cuenta con email y contraseña
2. **Dashboard** → Ve todas tus compras y productos
3. **Subir Foto** → Toma una foto de tu ticket o productos
4. **Productos** → Aparecen automáticamente extraídos
5. **Alertas** → Recibe notificaciones de vencimientos
6. **Recetas** → Descubre qué cocinar con lo que tienes

### Secciones de la App:

| Sección | Función |
|---------|---------|
| 🏠 **Inicio** | Dashboard principal con estadísticas |
| 🍳 **Recetas** | Sugerencias de recetas basadas en tus productos |
| 🔔 **Alertas** | Historial de notificaciones de vencimiento |

## Primeros Pasos

### 1. Registrarse
- Email: tu@email.com
- Contraseña: elige una segura
- Listo, estás dentro!

### 2. Subir Primera Foto
- Toca el botón "Elegir Foto" en el Dashboard
- Saca una foto de un producto o ticket de compra
- Espera a que se procese (unos segundos)
- Los productos aparecen automáticamente

### 3. Marcar Productos
- Cuando abras un producto, marca "Marcar como abierto"
- Esto actualiza la fecha de apertura
- Las alertas se ajustarán automáticamente

### 4. Obtener Recetas
- Ve a la sección "Recetas"
- Verás sugerencias de recetas basadas en tus productos
- Toca "Actualizar Recetas" para regenerar

## Características Principales

### Extracción Automática
La IA analiza tus fotos y extrae:
- Nombre del producto
- Categoría (verduras, frutas, lácteos, etc)
- Cantidad y unidad
- Fecha de vencimiento estimada

### Alertas Inteligentes
Recibe notificaciones de:
- Productos que vencen hoy o mañana
- Productos que abriste hace mucho tiempo
- Sugerencias de recetas para usar lo que tienes

### Recetas Personalizadas
La IA sugiere recetas basadas en:
- Los productos que tienes sin abrir
- Tiempo de vencimiento
- Dificultad de preparación

## Troubleshooting

### Error: "Las tablas no existen"
→ Ejecuta los scripts SQL en Supabase (paso 1)

### Error: "No autorizado"
→ Verifica que estés logueado y que las variables de entorno estén configuradas

### Las fotos no se procesan
→ Intenta con una foto más clara
→ Verifica que sea un producto o ticket de compra

### No aparecen productos
→ Sube una foto clara de un ticket o productos
→ Espera a que se procese la IA (unos segundos)

## Contacto y Soporte

Si encuentras problemas:
1. Verifica la consola del navegador (F12)
2. Revisa los logs en Vercel (Functions)
3. Confirma que las variables de entorno están bien configuradas

## Guías Detalladas

- **Configuración Completa**: Ver `SETUP.md`
- **Documentación Técnica**: Ver `README.md`
- **Estructura de la BD**: Ver `README.md` → Base de Datos

¡Disfrutá de Fresco! 🥬
