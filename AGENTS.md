<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# A la Primera — contexto para Claude Code

Asistente personal de trámites con la administración española. **Tu trámite, con tus papeles.**
Proyecto del reto Viberano (233 Academy): vibe coding puro.

## Fuentes de verdad (leer antes de construir nada)

- [spec.md](./spec.md) — el QUÉ. 9 historias, 29 FRs, decisiones cerradas. No se contradice.
- [plan.md](./plan.md) — el CÓMO. Stack, modelo de datos, fases. Si hay que desviarse, se actualiza
  el plan en el mismo commit y se explica por qué.
- [tasks.md](./tasks.md) — el desglose; se marcan las tareas al completarse.
- La documentación de discovery (hipótesis, mapa de historias) vive en el repo `Viberano`.

## Skill del proyecto

- **`/preparar-ficha`** — prepara o revisa una ficha contra su fuente oficial. Dos modos:
  **añadir** (trámite nuevo: extraer con cita → ficha → seed → verificar en navegador) y
  **revisar** (mantenimiento: comprueba si la fuente sigue diciendo lo mismo y devuelve solo el
  diff). Úsala siempre que haya que ampliar o mantener el catálogo; lleva dentro el mapa de minas
  de las sedes españolas, las reglas anti-invención y el calendario de revisión.

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

## Diseño: la identidad es EL SELLO (no la rompas sin querer)

El aspecto por defecto de una app generada con IA es reconocible y ya lo tuvimos: verde esmeralda
sobre stone, emoji de logo, Geist sin tocar. Se rediseñó a propósito (plan.md §4bis). Reglas:

6. **Colores solo por token semántico**: `papel`, `hoja`, `tinta`, `tinta-media`, `tinta-tenue`,
   `linea`, `sello` (violeta), `pendiente` (rojo). Se escribe `text-sello`, nunca `text-violet-600`.
   **Prohibido `emerald-*`, `stone-*`, `amber-*`, `green-*` en componentes.** Los tokens están en
   `@theme` de `app/globals.css`. **No hay verde en esta app.**
7. **Cero emoji en la UI** (FR-028): los dibuja el sistema del usuario y se rompen. Iconos SVG en
   `components/IconoRequisito.tsx`. Si hace falta uno nuevo, se añade ahí.
8. **Tipografía**: IBM Plex — `font-cond` para sellos y titulares, `font-mono` para datos oficiales
   (fechas, tipos, importes), `font-sans` para el cuerpo.
9. **Copia sin tics de modelo**: nada de rayas largas (—) en texto propio (usa dos puntos o punto),
   nada de reglas de tres. **Las citas de fuentes oficiales no se tocan jamás**, ni su puntuación.

## Convenciones

- Next.js 16 App Router + TypeScript + Tailwind · Supabase (Postgres/Auth/RLS) · Vercel.
  Ojo: Next 16 deprecó `middleware.ts` → `proxy.ts` (runtime Node). Lee
  `node_modules/next/dist/docs/` antes de tocar convenciones de fichero: esta versión tiene cambios
  de ruptura y ya nos costó una caída de producción.
- **`proxy.ts` no puede lanzar nunca**: corre delante de cada petición y si revienta cae la web
  entera. Todo en try/catch, y solo en las rutas que necesitan sesión.
- Todo el texto de UI en **español**. Lenguaje llano, nada de jerga administrativa sin explicar.
- Móvil primero (Marta empieza en el móvil); el imprimible se revisa con `@media print`.
- Estados derivados en lectura (p. ej. sello caducado a 90 días), no jobs que los actualicen.
- **El sello lo pone una persona, con `npm run verificar <slug>`** (escribe el registro
  `lib/data/verificaciones.ts` y vuelca a BD). Nunca con SQL: el seed borra y reinserta desde el
  repo, así que un `update` en BD se pierde sin avisar. Y nunca lo pongas tú por tu cuenta: una
  ficha sellada afirma que un humano la cotejó contra la fuente.
- **Pendientes** (`lib/data/pendientes.ts`): entradas del catálogo SIN ficha, visibles y agrupadas
  por hecho vital para dar masa a la taxonomía, pero que NO muestran requisitos: solo "en
  preparación". No violan la regla de oro porque no publican contenido. Al curar uno, se mueve a
  `tramites.ts` y deja de ser pendiente. El catálogo se agrupa por **hecho vital**
  (`lib/data/hechos-vitales.ts`), no por organismo.
- **Modelo territorial**: cada trámite tiene `nivel` (estatal | autonomico | local). Estatal = una
  ficha para toda España; autonomico/local = una ficha por comunidad (con `comunidad`). "Tu zona"
  (lib/zona.ts, recordada en el navegador) filtra el catálogo, y si el usuario elige una comunidad
  sin fichas, se le dice con honestidad — nunca se le enseña la de otra comunidad como si fuera la
  suya. Un autonómico nuevo se cura POR comunidad; no se comparte "un esqueleto con variantes"
  (sería síntesis, contra la regla de oro).
- Migraciones de BD versionadas en el repo; RLS activado en toda tabla desde su creación.
- Tras cada fase del plan: recorrido manual en la URL pública, no solo en local.

## Red de seguridad (tests) — corre `npm test` antes de cada commit

Como se construye 100% por prompts, hay una suite (Vitest, en `tests/`) que blinda las invariantes
que dan confianza al producto. **Corre `npm test` (y `npx tsc --noEmit`) antes de commitear**; si
tocas fichas, pendientes o el modelo territorial, es donde se caza una regresión antes que un humano.
Qué vigila:

- **Regla de oro (FR-019)**: ninguna ficha real está enteramente sin citar (cada una ancla a su
  `urlFuente` https y tiene ≥1 requisito con «Fuente:»). Los **pendientes** no publican requisitos,
  descripción ni fuente, y nunca salen verificados — el candado de que no pueden engañar.
- **Estructura del wizard**: la primera pregunta es siempre `destinatario`; ids de opción/requisito
  únicos; cada `soloSiOpciones` apunta a una opción que existe; un caso inviable trae alternativas.
- **Integridad referencial**: cada `tramitePrevioSlug` y cada prerequisito existe en el catálogo, sin
  autorreferencias; `getCadena` resuelve sin duplicar ni colgarse.
- **Aislamiento territorial** (`visibleEnZona`): un usuario de una comunidad nunca ve la ficha de
  otra; las estatales las ve todo el mundo.
- **Sello (FR-020)**: la degradación a 90 días vive en `lib/sello.ts` (función pura), probada en los
  bordes. Si tocas el umbral, ese test tiene que seguir cuadrando.
- **Taxonomía**: cada ficha real y cada pendiente cuelgan de un hecho vital que existe; `tieneFichas`
  cuadra con lo curado.

Al **añadir una ficha nueva** no suele hacer falta escribir tests: las invariantes ya la cubren. Si
introduces un concepto nuevo (un tipo de requisito, un nivel territorial), añade su invariante aquí.
