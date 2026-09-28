# Web Project Configurator

Aplicación para definir el alcance de un proyecto web antes de cotizarlo. El cliente completa un cuestionario visual de 12 o 13 pasos; el paso de catálogo aparece solo cuando corresponde. Al final revisa su brief y lo envía por correo. No utiliza base de datos ni muestra precios al cliente.

## Stack

- Next.js 16 con App Router y React 19
- TypeScript estricto
- Tailwind CSS 4 y CSS ligero para el diseño
- Resend para el envío de correo desde el servidor
- Despliegue preparado para Vercel

## Instalación

Requiere Node.js 20.9 o superior.

```bash
npm install
cp .env.example .env.local
npm run dev
```

En Windows PowerShell también puedes usar `Copy-Item .env.example .env.local`. Abre `http://localhost:3000`.

Para verificar el proyecto:

```bash
npm run typecheck
npm run build
```

## Correo y variables de entorno

| Variable | Uso |
| --- | --- |
| `RESEND_API_KEY` | Clave privada de Resend (`re_...`). Solo en el servidor. |
| `BRIEF_FROM_EMAIL` | Remitente de un dominio verificado en Resend, por ejemplo `briefs@tudominio.com`. |
| `BRIEF_TO_EMAIL` | Tu dirección de correo, donde recibirás todos los briefs. |

1. Crea una cuenta en Resend y [verifica un dominio remitente](https://resend.com/docs/dashboard/domains/introduction).
2. Crea una clave API con permiso de envío y completa `.env.local` para desarrollo.
3. Configura las mismas variables en Vercel antes del despliegue. No subas `.env.local` ni la clave API a Git.

La interfaz pública carga sin estas variables, pero el envío devuelve un error hasta configurarlas. El borrador permanece en el dispositivo si el envío falla, para que el cliente pueda reintentarlo.

El servidor valida todas las respuestas, calcula la complejidad y envía un mensaje de texto estructurado a `BRIEF_TO_EMAIL`. El destinatario es fijo y no se toma del formulario. El correo del cliente se usa como dirección de respuesta. La puntuación numérica de complejidad se incluye solo en el correo interno.

La bandeja de entrada funciona como archivo de solicitudes. Puedes crear una etiqueta o filtro para los asuntos que empiecen por “Nuevo brief web”. No existe un panel `/admin` ni almacenamiento de briefs en el servidor. El único guardado temporal es `localStorage` del dispositivo del cliente; se borra tras aceptar el proveedor el envío o al usar “Empezar de nuevo” con confirmación.

## Arquitectura

| Ruta o archivo | Función |
| --- | --- |
| `app/page.tsx` | Portada pública. |
| `app/brief/page.tsx` | Configurador. |
| `app/api/briefs/route.ts` | Validación y envío de correo. |
| `components/` | Preguntas, tarjetas, progreso y resumen. |
| `lib/options.ts` | Opciones del formulario. |
| `lib/validation.ts` y `lib/brief-input.ts` | Validación en cliente y normalización estricta en servidor. |
| `lib/brief-email.ts` | Formato del mensaje de correo con todas las respuestas. |
| `lib/complexity.ts` | Puntuación de complejidad de 0 a 100. |
| `lib/pricing.ts` | Estructura central configurable del estimador; desactivada en el MVP. |

## Complejidad

[`lib/complexity.ts`](lib/complexity.ts) suma puntos por tipo de proyecto, cantidad de páginas y productos, módulos editables, integraciones, ayuda con contenido y urgencia. El resultado se limita a 100. Los tramos son: Baja (0–24), Media (25–49), Alta (50–74) y Muy alta (75–100). El presupuesto declarado sirve solo como contexto comercial y nunca altera esta puntuación ni un futuro precio sugerido.

El estimador de precio en [`lib/pricing.ts`](lib/pricing.ts) está desactivado (`enabled: false`). Los importes configurables todavía no están definidos.

## Despliegue en Vercel

Importa el repositorio como proyecto Next.js. Vercel detecta el framework y ejecuta `npm run build`. Configura las tres variables de correo en el proyecto y despliega. Después completa un brief de prueba y comprueba que llega a `BRIEF_TO_EMAIL`. Resend acepta el mensaje antes de responder al formulario; la entrega final también depende de los filtros de correo del destinatario.

## Siguientes pasos

- Verificar un dominio en Resend, configurar las variables y probar un envío real.
- Revisar los filtros de spam y crear una etiqueta para organizar los briefs.
- Evaluar protección contra envíos automatizados si el formulario recibe mucho tráfico.
- Definir tarifas internas si más adelante se desea activar el estimador.
