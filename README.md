# Web Project Configurator

Aplicación para recoger los datos de un proyecto web antes de cotizarlo. El cliente completa un cuestionario de 11 o 12 pasos y puede seleccionar varios tipos de proyecto; el paso de catálogo aparece solo cuando corresponde. Al final revisa sus respuestas y las envía por correo. No utiliza base de datos ni muestra precios al cliente.

## Stack

- Next.js 16 con App Router y React 19
- TypeScript estricto
- Tailwind CSS 4 y CSS ligero para el diseño
- Gmail SMTP para el envío de correo desde el servidor
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
| `GMAIL_USER` | Tu dirección de Gmail. Envía y recibe los briefs. |
| `GMAIL_APP_PASSWORD` | Contraseña de aplicación de Google. Solo en el servidor; no es tu contraseña habitual. |

1. Activa la [verificación en dos pasos de Google](https://support.google.com/accounts/answer/185839?hl=es) en la cuenta Gmail que recibirá los briefs.
2. Crea una [contraseña de aplicación](https://support.google.com/accounts/answer/185833?hl=es) para el sitio. Si tu cuenta no ofrece esta opción, habrá que usar otro método de autenticación para Gmail.
3. Completa `GMAIL_USER` y `GMAIL_APP_PASSWORD` en `.env.local` para desarrollo. En Vercel, configura las mismas variables en el proyecto. No subas `.env.local` ni compartas la contraseña en el chat.

La interfaz pública carga sin estas variables, pero el envío devuelve un error hasta configurarlas. El borrador permanece en el dispositivo si el envío falla, para que el cliente pueda reintentarlo.

El servidor valida todas las respuestas, calcula la complejidad y prepara un correo HTML con versión de texto y una cotización preliminar en PDF. El destinatario es fijo (`GMAIL_USER`) y no se toma del formulario. El correo del cliente se usa como dirección de respuesta. El cliente no ve la calificación ni el precio; ambos quedan solo en el correo interno, y no recibe una cotización automáticamente.

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
| `lib/pricing.ts` | Tarifas aprobadas y cálculo desglosado del estimado. |
| `lib/quote-pdf.ts` | Generación de la cotización preliminar adjunta. |

## Complejidad

[`lib/complexity.ts`](lib/complexity.ts) suma puntos por tipo de proyecto, cantidad de páginas y productos, módulos editables, integraciones, ayuda con contenido y urgencia. Si se eligen varios tipos, toma el de mayor complejidad y agrega 5 puntos por cada tipo adicional. El resultado se limita a 100. Los tramos son: Baja (0–24), Media (25–49), Alta (50–74) y Muy alta (75–100).

Las tarifas de [`lib/pricing.ts`](lib/pricing.ts) están [documentadas aquí](docs/pricing.md). El PDF se marca como borrador interno y señala los datos que requieren revisión manual. No compartir una cotización con el cliente sin confirmar alcance, impuestos, servicios externos y condiciones comerciales.

## Despliegue en Vercel

Importa el repositorio como proyecto Next.js. Vercel detecta el framework y ejecuta `npm run build`. Configura las dos variables de Gmail en el proyecto y despliega. Después completa un brief de prueba y comprueba que llega a tu Gmail. No necesitas comprar ni verificar un dominio: Vercel proporciona una URL `*.vercel.app`. El servidor espera a que Gmail acepte el mensaje antes de responder al formulario; la entrega final también depende de los filtros de correo del destinatario.

## Siguientes pasos

- Configurar las variables de Gmail y probar un envío real.
- Revisar los filtros de spam y crear una etiqueta para organizar los briefs.
- Evaluar protección contra envíos automatizados si el formulario recibe mucho tráfico.
- Revisar el primer correo real y su PDF adjunto antes de compartir cotizaciones con clientes.
