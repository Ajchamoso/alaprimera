import type { Metadata } from "next";
import Link from "next/link";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A la Primera — tu trámite, tu checklist, tu progreso",
  description:
    "Termina cualquier gestión con la administración a la primera: responde unas preguntas sobre tu caso y llévate una checklist personalizada de todo lo que necesitas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-stone-50 font-sans text-stone-900">
        <header className="border-b border-stone-200 bg-white print:hidden">
          <div className="mx-auto flex max-w-3xl items-baseline gap-3 px-4 py-4">
            <Link href="/" className="text-xl font-bold tracking-tight">
              ✅ A la Primera
            </Link>
            <span className="hidden text-sm text-stone-500 sm:inline">
              tu trámite, tu checklist, tu progreso
            </span>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-3xl border-t border-stone-200 px-4 py-6 text-sm text-stone-500 print:hidden">
          La ficha guía; la fuente oficial manda. Confirma siempre en el enlace oficial de cada
          trámite.
        </footer>
      </body>
    </html>
  );
}
