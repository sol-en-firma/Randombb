# 🚀 Guía de Setup para Fresco

## Requisitos Previos

- Cuenta de Supabase (https://supabase.com)
- Cuenta de Vercel (https://vercel.com)
- Integración de Blob de Vercel

## Paso 1: Crear la Base de Datos en Supabase

1. Abre tu proyecto de Supabase
2. Ve a la sección "SQL Editor"
3. Crea una nueva query y copia el contenido de `scripts/001_create_tables.sql`
4. Ejecuta la query
5. Crea otra nueva query y copia el contenido de `scripts/002_rls_policies.sql`
6. Ejecuta esta segunda query

Verifica que las tablas se crearon correctamente en la sección "Database" de Supabase.

## Paso 2: Configurar Variables de Entorno

Estas variables deberían configurarse automáticamente con v0, pero verifica que estén en tu Vercel project:

### En Vercel Settings → Vars:

```
NEXT_PUBLIC_SUPABASE_URL=<tu-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-supabase-anon-key>
BLOB_READ_WRITE_TOKEN=<tu-blob-token>
CRON_SECRET=<genera-un-token-aleatorio>
NEXT_PUBLIC_APP_URL=<tu-app-url>
```

Encuentra estos valores en:
- **Supabase URL y ANON KEY**: Supabase → Settings → API
- **BLOB Token**: Vercel → Blob Storage → Tokens
- **CRON_SECRET**: Genera una cadena aleatoria fuerte
- **APP URL**: Tu URL de Vercel (ej: https://fresco-app.vercel.app)

## Paso 3: Configurar Email Confirmation (Opcional pero Recomendado)

Si quieres que los usuarios confirmen su email antes de poder usar la app:

1. En Supabase → Authentication → Providers → Email
2. Activa "Confirm email"
3. Configura los templates de email si lo deseas

**Nota**: Sin confirmación de email, los usuarios pueden usar la app inmediatamente después de registrarse.

## Paso 4: Configurar el Cron Job (Opcional)

Para que las notificaciones se generen automáticamente:

1. En Vercel, ve a "Crons" en tu proyecto
2. Verifica que `vercel.json` tenga la configuración de cron
3. El cron se ejecutará diariamente a las 9 AM UTC

## Paso 5: Probar la Aplicación

1. Navega a tu app
2. Crea una nueva cuenta
3. Sube una foto de un producto o ticket
4. Verifica que los productos se extraigan correctamente
5. Prueba marcar productos como abiertos
6. Verifica las notificaciones

## Troubleshooting

### Error: "No hay autorización" al subir fotos
- Verifica que `BLOB_READ_WRITE_TOKEN` esté configurado
- Verifica que Blob Storage esté activado en Vercel

### Error: "La tabla no existe" al cargar productos
- Verifica que ejecutaste ambos scripts SQL en Supabase
- Verifica el nombre de las tablas (debe ser "products", no "Products")

### Los productos no se extraen de las fotos
- Verifica que tengas la API de OpenAI configurada en Vercel AI Gateway
- Verifica que subas fotos de buena calidad
- Intenta subir una foto clara de un ticket o productos

### Las notificaciones no se generan
- Verifica que `CRON_SECRET` esté configurado
- Verifica los logs en Vercel → Functions

## Personalización

### Cambiar el horario del Cron

En `vercel.json`, cambia el campo `schedule`:
```json
{
  "crons": [
    {
      "path": "/api/cron/check-expiration",
      "schedule": "0 9 * * *"  // Cambia estos números
    }
  ]
}
```

Formato cron: `minute hour day month weekday`

### Agregar más categorías de productos

En `lib/utils.ts`, actualiza el objeto `emojis` en la función `getCategoryEmoji()`.

También en `app/actions/ai.ts`, actualiza el prompt para incluir las nuevas categorías.

## Despliegue

La app está lista para desplegar en Vercel:

```bash
git push origin main
```

Vercel desplegará automáticamente cada cambio.

## Soporte

Si encuentras problemas, verifica:
- Los logs en Vercel
- Los logs en Supabase
- La consola del navegador (F12)
- Las variables de entorno estén correctas
