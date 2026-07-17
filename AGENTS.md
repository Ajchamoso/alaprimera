<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# A la Primera — contexto para Claude Code

Asistente personal de trámites con la administración española. **Tu trámite, tu checklist, tu
progreso.** Proyecto del reto Viberano (233 Academy): vibe coding puro.

## Fuentes de verdad (leer antes de construir nada)

- [spec.md](./spec.md) — el QUÉ. 9 historias, 27 FRs, decisiones cerradas. No se contradice.
- [plan.md](./plan.md) — el CÓMO. Stack, modelo de datos, fases. Si hay que desviarse, se actualiza
  el plan en el mismo commit y se explica por qué.
- [tasks.md](./tasks.md) — el desglose; se marcan las tareas al completarse.
- La documentación de discovery (hipótesis, mapa de historias) vive en el repo `Viberano`.

## Skill del proyecto

- **`/curar-tramite`** — investiga un trámite en su fuente oficial y lo añade al catálogo
  (extracción con cita literal → ficha → seed → verificación en navegador → documentar).
  Úsala siempre que haya que ampliar o re-extraer el catálogo; lleva dentro el mapa de minas
  de las sedes españolas y las reglas anti-invención.

## Reglas del reto (innegociables)

1. **Todo el código de este repo se escribe vía Claude Code.** Ningún humano edita código a mano —
   ni un typo, ni una coma. Una edición manual descalifica al equipo del reto.
2. Los commits se hacen desde Claude Code. El historial de git es la evidencia de juego limpio.

## Reglas de producto (innegociables)

3. **FR-019, la regla de oro:** nada de lo que ve un usuario final se genera con IA en runtime.
   Toda información procede de fichas curadas/revisadas en BD. La IA solo vive en el pipeline de
   curación (`extraction_jobs`), offline, y sus borradores exigen revisión humana para publicarse.
4. **Cero requisitos inventados.** En la extracción, campo sin cita literal de la fuente = campo
   vacío. Ante la duda, vacío y honesto antes que completo y falso.
5. **La demo manda:** el camino usuario (catálogo → wizard → checklist → canal) no depende de
   ninguna llamada externa en vivo. Si una feature puede fallar en directo, no entra en ese camino.

## Convenciones

- Next.js 15 App Router + TypeScript + Tailwind + shadcn/ui · Supabase (Postgres/Auth/RLS) · Vercel.
- Todo el texto de UI en **español**. Lenguaje llano, nada de jerga administrativa sin explicar.
- Móvil primero (Marta empieza en el móvil); el imprimible se revisa con `@media print`.
- Estados derivados en lectura (p. ej. sello caducado a 90 días), no jobs que los actualicen.
- Migraciones de BD versionadas en el repo; RLS activado en toda tabla desde su creación.
- Tras cada fase del plan: recorrido manual en la URL pública, no solo en local.
