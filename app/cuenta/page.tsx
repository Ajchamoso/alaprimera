"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabaseConfigurado, supabaseNavegador } from "@/lib/supabase/client";

type Estado =
  | { fase: "cargando" }
  | { fase: "anonimo" }
  | { fase: "enlace-enviado"; email: string }
  | { fase: "sesion"; email: string };

function Cuenta() {
  // Sin Supabase configurado no hay sesión posible: se sabe ya en el primer render.
  const [estado, setEstado] = useState<Estado>(() =>
    supabaseConfigurado() ? { fase: "cargando" } : { fase: "anonimo" }
  );
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const parametros = useSearchParams();

  useEffect(() => {
    if (!supabaseConfigurado()) return;
    const supabase = supabaseNavegador();
    const aplicaSesion = (sesion: Session | null) => {
      setEstado(sesion?.user?.email ? { fase: "sesion", email: sesion.user.email } : { fase: "anonimo" });
    };
    supabase.auth.getSession().then(({ data }) => aplicaSesion(data.session));
    const { data: subscripcion } = supabase.auth.onAuthStateChange((_evento, sesion) =>
      aplicaSesion(sesion)
    );
    return () => subscripcion.subscription.unsubscribe();
  }, []);

  async function enviaEnlace(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    const supabase = supabaseNavegador();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setEnviando(false);
    if (error) {
      setError("No se pudo enviar el enlace. Revisa el email e inténtalo de nuevo.");
      return;
    }
    setEstado({ fase: "enlace-enviado", email });
  }

  async function cierraSesion() {
    await supabaseNavegador().auth.signOut();
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Tu cuenta</h1>

      {parametros.get("error") === "enlace" && (
        <p className="rounded-lg bg-pendiente-suave p-3 text-sm text-pendiente">
          Ese enlace ya no es válido (caducan a los pocos minutos). Pide uno nuevo.
        </p>
      )}

      {estado.fase === "cargando" && <p className="text-tinta-tenue">Cargando…</p>}

      {estado.fase === "sesion" && (
        <div className="space-y-4 rounded-xl border border-linea bg-hoja p-5">
          <p>
            Sesión iniciada como <span className="font-semibold">{estado.email}</span>.
          </p>
          <p className="text-sm text-tinta-media">
            Tus checklists se guardan en tu cuenta: entra con el mismo email en el móvil o el
            ordenador y sigue donde lo dejaste.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-lg bg-sello px-4 py-2 font-medium text-white hover:bg-tinta"
            >
              Ir a mis trámites
            </Link>
            <button
              onClick={cierraSesion}
              className="rounded-lg border border-linea px-4 py-2 font-medium text-tinta-media hover:bg-papel"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}

      {estado.fase === "enlace-enviado" && (
        <div className="rounded-xl border border-linea bg-sello-suave p-5">
          <p className="font-medium text-tinta">Revisa tu correo</p>
          <p className="mt-1 text-sm text-sello/80">
            Hemos enviado un enlace de acceso a <span className="font-medium">{estado.email}</span>.
            Ábrelo en este dispositivo y listo. Sin contraseñas.
          </p>
        </div>
      )}

      {estado.fase === "anonimo" && (
        <div className="space-y-4">
          <p className="text-tinta-media">
            No necesitas cuenta para usar A la Primera: tu progreso se guarda en este navegador.
            Crear cuenta te da una cosa más: <strong>seguir en otro dispositivo</strong>. Empiezas
            en el móvil y terminas en el ordenador.
          </p>
          <form onSubmit={enviaEnlace} className="space-y-3 rounded-xl border border-linea bg-hoja p-5">
            <label className="block">
              <span className="text-sm font-medium text-tinta-media">Tu email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="marta@ejemplo.es"
                className="mt-1 w-full rounded-lg border border-linea px-3 py-2 outline-none focus:border-sello focus:ring-2 focus:ring-sello-suave"
              />
            </label>
            <button
              type="submit"
              disabled={enviando || !supabaseConfigurado()}
              className="w-full rounded-lg bg-sello px-4 py-2 font-medium text-white hover:bg-tinta disabled:opacity-50"
            >
              {enviando ? "Enviando…" : "Enviarme un enlace de acceso"}
            </button>
            {error && <p className="text-sm text-pendiente">{error}</p>}
            <p className="text-xs text-tinta-tenue">
              Sin contraseñas: te llega un enlace al correo y ya está.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

export default function PaginaCuenta() {
  return (
    <Suspense fallback={<p className="text-tinta-tenue">Cargando…</p>}>
      <Cuenta />
    </Suspense>
  );
}
