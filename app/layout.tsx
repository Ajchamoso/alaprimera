import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Sans, IBM_Plex_Mono, IBM_Plex_Sans_Condensed } from "next/font/google";
import { SyncCuenta } from "@/components/SyncCuenta";
import "./globals.css";

/**
 * Tipografía: IBM Plex, en sus tres cortes.
 *
 * Elegida, no heredada: Plex nació como la voz institucional de IBM y tiene el
 * aire de formulario oficial que este producto habita. La condensada hace de
 * sello; la monoespaciada, de dato oficial (fechas, tipos, importes).
 * next/font las auto-aloja en el build: sin CDN, sin fallback silencioso.
 */
const cuerpo = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--fuente-cuerpo",
  display: "swap",
});

const datos = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--fuente-datos",
  display: "swap",
});

const sello = IBM_Plex_Sans_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--fuente-sello",
  display: "swap",
});

export const metadata: Metadata = {
  title: "A la Primera · tu trámite, con tus papeles",
  description:
    "Responde unas preguntas sobre tu caso y llévate la lista exacta de lo que necesitas: papeles, requisitos técnicos y los trámites escondidos dentro de tu trámite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${cuerpo.variable} ${datos.variable} ${sello.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-papel font-sans text-tinta">
        <SyncCuenta />
        <header className="border-b-2 border-tinta bg-hoja print:hidden">
          <div className="mx-auto flex max-w-3xl items-baseline gap-3 px-4 py-4">
            <Link href="/" className="group font-cond text-2xl font-bold tracking-wide uppercase">
              A la <span className="text-sello">Primera</span>
            </Link>
            <span className="hidden font-mono text-xs tracking-tight text-tinta-tenue sm:inline">
              tu trámite, con tus papeles
            </span>
            <Link
              href="/cuenta"
              className="ml-auto font-mono text-xs uppercase tracking-widest text-tinta-media hover:text-sello"
            >
              Mi cuenta
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-3xl border-t border-linea px-4 py-6 text-sm text-tinta-media print:hidden">
          La ficha guía; la fuente oficial manda. Confirma siempre en el enlace oficial de cada
          trámite.
        </footer>
      </body>
    </html>
  );
}
