import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Formulario de proyecto web | webproject",
  description: "Completa el formulario para describir tu proyecto web. Revisa tus respuestas y envíalas para preparar una cotización.",
  openGraph: { title: "Formulario de proyecto web", description: "Responde las preguntas, revisa el resumen y envía tu solicitud.", type: "website" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es" data-scroll-behavior="smooth"><body>{children}</body></html>;
}
