# Web Project Configurator

Aplicación para definir el alcance de un proyecto web antes de cotizarlo. El cliente responde un cuestionario visual de 12 o 13 pasos; el paso de catálogo aparece solo cuando corresponde. Al final revisa un resumen y envía su brief. La complejidad se calcula en el servidor y se guarda junto al brief. No se muestran precios al cliente.

## Stack

- Next.js 16 con App Router y React 19
- TypeScript estricto
- Tailwind CSS 4 y CSS ligero para el diseño
- Supabase Postgres
- Despliegue preparado para Vercel

## Instalación

Requiere Node.js 20.9 o superior.

```bash
npm install
cp .env.example .env.local
npm run dev
```

En Windows PowerShell usa `Copy-Item .env.example .env.local` en lugar de `cp` si lo prefieres. Abre `http://localhost:3000`.

Para verificar producción:

```bash
npm run typecheck
npm run build
```

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase. Pública. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública de Supabase. Preparada para la configuración del proyecto; la app actual no la necesita en el navegador. |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave secreta utilizada solo por rutas y componentes de servidor. Nunca debe llevar prefijo `NEXT_PUBLIC_`. |
| `ADMIN_USER_ID` | UUID de la única cuenta de Supabase Auth que puede abrir `/admin`. |

La aplicación muestra la interfaz pública sin variables, pero no puede guardar solicitudes hasta configurar Supabase. El panel interno deniega el acceso si falta `ADMIN_USER_ID`. No subas `.env.local`; está ignorado por Git.

## Supabase

1. Crea un proyecto Supabase.
2. Ejecuta [`supabase/schema.sql`](supabase/schema.sql) en el SQL Editor.
3. Copia la URL del proyecto y sus claves en `.env.local` para desarrollo, y en las variables de entorno de Vercel para producción.

La tabla `public.web_briefs` guarda los campos de selección múltiple como JSONB. Row Level Security está activado. `anon` y `authenticated` no tienen acceso directo a la tabla. La ruta del servidor valida los valores, recalcula la complejidad y usa la clave `service_role` para insertar. El `status` inicial es `new`. El correo corporativo se almacena en campos propios, separado del hosting web.

## Acceso al panel interno

El panel `/admin` tiene una sola cuenta autorizada. Crea tu usuario de email y contraseña en **Supabase → Authentication → Users** desde el panel de Supabase. Copia su UUID a `ADMIN_USER_ID`. No hay registro público en la aplicación. Aunque otra cuenta de Supabase Auth inicie sesión, el servidor compara su UUID con `ADMIN_USER_ID` antes de leer un brief. La tabla tampoco concede acceso directo a usuarios autenticados: toda lectura pasa por la verificación del servidor. Mantén desactivado el registro público en la configuración de Auth si no lo necesitas.

## Arquitectura

| Ruta o directorio | Función |
| --- | --- |
| `app/page.tsx` | Portada pública. |
| `app/brief/page.tsx` | Configurador. |
| `app/api/briefs/route.ts` | Validación y persistencia de solicitudes. |
| `app/admin/` | Acceso y consulta privada de briefs. |
| `proxy.ts` y `lib/admin-auth.ts` | Renovación de sesión y comprobación del único administrador. |
| `components/` | Preguntas, tarjetas, progreso, resumen y vistas de administración. |
| `lib/options.ts` | Opciones disponibles en el formulario. |
| `lib/validation.ts` y `lib/brief-input.ts` | Validación en cliente y normalización estricta en servidor. |
| `lib/complexity.ts` | Puntuación de complejidad de 0 a 100. |
| `lib/pricing.ts` | Estructura central configurable del estimador; desactivada en el MVP. |
| `lib/supabase.ts` | Cliente de Supabase exclusivo del servidor. |
| `supabase/schema.sql` | Esquema y permisos. |

El avance se conserva temporalmente en `localStorage` del dispositivo. “Empezar de nuevo” pide confirmación antes de borrarlo. Al enviar con éxito, se elimina el borrador local.

## Complejidad

[`lib/complexity.ts`](lib/complexity.ts) suma puntos por tipo de proyecto, cantidad de páginas y productos, módulos editables, integraciones, ayuda con contenido y urgencia. El resultado se limita a 100. Los tramos son: Baja (0–24), Media (25–49), Alta (50–74) y Muy alta (75–100). El presupuesto declarado sirve solo como contexto comercial y nunca altera esta puntuación ni un futuro precio sugerido.

El estimador de precio en [`lib/pricing.ts`](lib/pricing.ts) está desactivado (`enabled: false`). Los importes configurables todavía no están definidos.

## Despliegue en Vercel

Importa el repositorio como proyecto Next.js. Vercel detecta el framework y usa `npm run build`. Configura las variables de entorno en el proyecto Vercel y ejecuta el esquema SQL antes de recibir solicitudes. Mantén `SUPABASE_SERVICE_ROLE_KEY` únicamente en el entorno del servidor.

## Siguientes pasos

- Configurar un proyecto Supabase real y verificar un envío de extremo a extremo.
- Configurar la única cuenta de administración en Supabase Auth.
- Evaluar mitigación de envíos automatizados antes de abrir el formulario a mucho tráfico.
- Definir tarifas internas si se desea activar el estimador de precios en una fase posterior.
