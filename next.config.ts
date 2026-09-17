import type { NextConfig } from "next";

/**
 * Origen de Supabase, para no abrir `connect-src` a todo internet. Sale del
 * mismo env que usa el cliente; si no está (desarrollo sin BD), se omite y la
 * app sigue funcionando con el seed local.
 */
function origenSupabase(): string[] {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return [];
  try {
    return [new URL(url).origin];
  } catch {
    return [];
  }
}

/**
 * CABECERAS DE SEGURIDAD
 *
 * La app sirve enlaces públicos de solo lectura (`/c/<token>`) y tiene sesión por
 * enlace mágico, así que conviene cerrar lo barato: que nadie la meta en un
 * iframe, que el navegador no adivine tipos, y que la referencia no viaje entera
 * a terceros.
 *
 * Sobre `'unsafe-inline'` en `script-src`: Next inyecta scripts en línea para la
 * hidratación, y la alternativa (nonce por petición) solo se puede generar en
 * `proxy.ts`. Aquí eso no sale a cuenta: el proxy corre delante de CADA petición
 * y la regla del proyecto es que toque lo mínimo y no pueda lanzar nunca; poner
 * un nonce obligaría a ampliar su matcher a todo el sitio. Se acepta el inline y
 * se conserva lo que de verdad frena a un tercero: `'self'` como origen de
 * scripts, `object-src 'none'`, `base-uri 'self'` y `form-action 'self'`.
 *
 * Las fuentes IBM Plex las auto-aloja next/font en el build, así que `font-src`
 * no necesita abrirse a Google.
 */
function politicaContenido(): string {
  const enDesarrollo = process.env.NODE_ENV === "development";
  // El hot reload de `next dev` abre un WebSocket, y `'self'` no cubre ws://.
  const conexiones = ["'self'", ...origenSupabase(), ...(enDesarrollo ? ["ws:"] : [])].join(" ");
  const scripts = enDesarrollo
    ? "'self' 'unsafe-inline' 'unsafe-eval'" // el HMR de `next dev` lo necesita
    : "'self' 'unsafe-inline'";

  return [
    "default-src 'self'",
    `script-src ${scripts}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src ${conexiones}`,
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    // En desarrollo no: convertiría en wss:// el ws:// del hot reload y lo tumba.
    ...(enDesarrollo ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: politicaContenido() },
          // frame-ancestors ya lo cubre en navegadores modernos; esto es el cinturón.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // La app no usa cámara, micrófono ni ubicación. Que no pueda, entonces.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
