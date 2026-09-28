import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web Project Configurator — Define tu web con claridad",
  description: "Define el alcance de tu proyecto web paso a paso antes de cotizar. Un brief claro para construir la web que realmente necesitas.",
  openGraph: { title: "Web Project Configurator", description: "Define tu web sin dejar cabos sueltos.", type: "website" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
