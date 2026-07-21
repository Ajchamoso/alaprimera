# Plan técnico: A la Primera (MVP)

**Creado**: 2026-07-16 · **Fuente de verdad**: [spec.md](./spec.md) (cerrada el 16/07)
**Restricción madre**: 100% vibe coding con Claude Code — ninguna edición manual de código.

Este documento decide el CÓMO que la spec deliberadamente no decide. Cada decisión lleva su porqué;
si una decisión resulta mala en agosto, se cambia el plan, no la spec.

---

## 1. Principios del plan (la "constitución")

1. **La demo manda.** Toda decisión técnica se evalúa contra: "¿puede fallar en directo?". Lo que
   pueda fallar en directo, no está en el camino de la demo.
2. **Determinista de cara al usuario.** Ninguna llamada a LLM en el camino de una request de
   usuario final (FR-019). La IA vive en el pipeline de curación, offline.
3. **Aburrido a propósito.** Stack mainstream que Claude Code domina a la perfección: menos
   fricción de prompts, menos rincones oscuros que depurar sin tocar código.
4. **El contenido es el producto.** El esquema de datos se diseña para las fichas curadas y sus
   cadenas; el código es el envoltorio.
5. **Estados derivados, no programados.** Todo lo que pueda calcularse en lectura (sello caducado,
   progreso %) se calcula en lectura. Cero cron jobs para lógica de negocio del MVP.

## 2. Stack

| Capa | Elección | Por qué |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | Lo que Claude Code genera con más fiabilidad; SSR para que las fichas sean indexables y rápidas |
| UI | **Tailwind CSS + shadcn/ui** | Componentes accesibles de serie; velocidad de prompt-a-pantalla |
| BD + Auth | **Supabase** (Postgres, Auth magic link, RLS) | Cubre FR-011/012 (login sin contraseña) y estado persistente sin construir backend propio |
| Hosting | **Vercel** (plan free) | URL pública en minutos (requisito del reto), deploy = git push, previews por rama |
| Motor IA | ~~Claude API desde función serverless~~ → **extracción en sesión de Claude Code** (17/07) | Sin API key: el equipo la descarta y una suscripción de Claude Code no puede vivir en Vercel. El diseño ya decía que el motor es curación offline que el usuario nunca ve, así que la herramienta cambia y el flujo no: IA extrae con citas → humano verifica → sello. Ver [docs/preparar-fichas.md](./preparar-fichas.md) |
| Impresión | CSS `@media print` nativo | El imprimible (FR-016) sin dependencias: HTML bien hecho |

**Descartado a propósito:**
- **Playwright/scraping con navegador** en el MVP: en serverless es frágil y pesado. El motor hace
  `fetch` server-side del HTML; si la sede es JS-pesada y el fetch trae poco, la curadora **pega el
  texto de la página a mano** en el formulario del motor (fallback ya previsto en la spec, FR-023
  cubre el fallo honesto). Playwright es mejora de R2, no cimiento del MVP.
- **LLM para la búsqueda coloquial** en runtime: la búsqueda usa **alias curados** por ficha
  ("carnet", "carné", "DNI del niño"…) + coincidencia difusa simple. Determinista, demo-proof, y
  los alias los sugiere la IA durante la curación (offline).

## 3. Arquitectura

```
Usuario ──► Next.js (Vercel)
              │  lee SIEMPRE fichas publicadas          Curadora ──► /admin
              ▼                                              │ pega URL o texto
        Supabase Postgres ◄──────────────────────────────────┤
          ├─ fichas publicadas (verificadas)                 ▼
          ├─ checklists personales                    extraction_jobs (cola)
          ├─ shares / feedback / reportes                    │ procesa async
          └─ borradores (solo curadoras)  ◄── Claude API ────┘
                                        (JSON estricto + citas de la fuente)
```

- **Camino del usuario**: Next.js → Postgres. Sin IA, sin colas, sin sorpresas.
- **Camino de la curadora**: formulario → job en cola → función serverless procesa (fetch + Claude
  API) → borrador con trazabilidad → revisión humana → publicar (transacción que valida ciclos,
  FR-026).
- **Procesado de la cola**: al crear el job se invoca la función de proceso de forma asíncrona
  (fire-and-forget); un cron de Vercel cada 5 min rescata jobs huérfanos. Es el único cron del MVP
  y no toca a usuarios finales.

## 4. Modelo de datos

El encadenamiento es el modelo de datos (decisión de producto). Tablas principales:

> **Revisión 17/07 (aplicada en `0001_schema.sql`):** (1) el contenido curado usa **ids de texto**
> (slugs legibles: `renovacion-dni`, `dni-p1-yo`) en vez de uuid — estables entre seed local y BD,
> no invalidan checklists guardadas en navegadores, y el motor puede generar ids legibles; el
> usuario (checklists) sigue en uuid. (2) `checklist_items` se sustituye por **`marcados` jsonb**
> dentro de `checklists`: espejo exacto del modelo localStorage → el merge anónimo→cuenta (FR-012)
> es un upsert directo, sin traducción por filas.

```
tramites            id (text, el slug), nombre_oficial, nombre_coloquial, descripcion,
                    organismo, territorio, canales[], url_fuente, url_cita_previa,
                    estado ('publicada'|'borrador'), verificada_en (timestamp),
                    generada_por_ia (bool), alias[] (búsqueda)

prerequisitos       tramite_id → requiere_tramite_id  (+ nota)
                    ⛔ trigger recursivo que rechaza ciclos (FR-026) — verificado

preguntas           id (text), tramite_id, orden (1..4), texto, tipo ('destinatario'|'normal')
opciones            id (text), pregunta_id, texto, veredicto_inviable (bool), texto_alternativas

requisitos          id (text), tramite_id, tipo ('doc_fisico'|'doc_digital'|'tecnico'|'tramite_previo'),
                    titulo, explicacion, canal ('online'|'presencial'|'ambos'), tramite_previo_id
requisito_condiciones  requisito_id ↔ opcion_id  (el requisito aplica si el usuario eligió esa opción)

checklists          id (uuid), user_id, tramite_id, nombre ("DNI Hugo"),
                    respuestas (jsonb), marcados (jsonb), canal_elegido, creada_en, actualizada_en

shares              checklist_id, token (url-safe), creado_en          — solo lectura (FR-014)
feedback            checklist_id, salio_a_la_primera (bool), comentario, que_fallo   — FR-017
reportes            tramite_id, descripcion, estado ('pendiente'|'revisado')          — FR-018

extraction_jobs     id, url, texto_pegado (nullable), estado ('pendiente'|'procesando'|
                    'listo'|'fallido'), error, borrador (jsonb con citas por campo), creado_por
profiles            user_id, es_curadora (bool)
```

**Decisiones dentro del modelo:**
- **Sello degradado = derivado**: `verificada_en < now() - 90 días` se calcula al leer (FR-020).
  Sin jobs, sin estados que se desincronizan.
- **Checklist anónima**: vive en `localStorage` con la misma forma que la fila de BD. Al hacer
  login, un endpoint `merge` la inserta con `user_id` (FR-012). Riesgo conocido: la fusión es el
  flujo más delicado del MVP — se construye y prueba en la semana 1, no al final.
- **Respuestas en jsonb**: el wizard es corto y sus respuestas se leen siempre juntas; no
  normalizar aquí es simplicidad ganada.
- **RLS en todo**: checklists/feedback solo del dueño; `tramites` publicadas legibles por
  cualquiera; borradores y jobs solo curadoras. El share funciona por token con una policy de
  lectura específica.
- **`anon` solo lee el catálogo** *(migración 0004, 20/07)*: el rol anónimo tiene `select` sobre las
  seis tablas del catálogo y nada más. Toda escritura del producto (reportes, feedback, shares) va
  por server action con la service role, que nunca llega al navegador. Dos motivos para no confiar
  solo en RLS: la anon key viaja en el JavaScript de la web, y **RLS no se aplica a `TRUNCATE`**, que
  Supabase concede por defecto a `anon` sobre todo el esquema. Las tablas nuevas nacen sin permisos
  para `anon` (`alter default privileges`), igual que nacen con RLS por el event trigger
  `rls_auto_enable`.

## 4bis. Identidad visual: el sello *(añadida el 17/07)*

> Por qué está en el plan y no en la spec: los hex y las tipografías son CÓMO. En la spec solo
> entró lo falsable (FR-028: los iconos no dependen del sistema del usuario; FR-029: el estado se
> distingue sin color). "Que no parezca hecho por una IA" **no es un requisito**: no es medible, y
> la propia spec prohíbe los requisitos-deseo.

**El problema.** La primera versión salió con el aspecto que llega solo: `emerald-600` sobre grises
stone (la paleta por defecto de Tailwind, la que elige toda app generada con IA en 2026), un emoji
✅ de logo, Geist sin tocar —la fuente que trae `create-next-app`, o sea la que nadie elige— y nueve
emoji por pantalla haciendo de iconos. Para un producto cuyo argumento central es *"esto no se lo
inventa una IA"*, parecer generado por una IA es un problema de credibilidad, no de gusto.

**La decisión.** No cambiar el verde por otro color bonito (el crema-con-serif es igual de
delator), sino mudarse al mundo que el producto ya habita. **Nuestro concepto central ya es un
sello**: verificar, sellar, caducar. La identidad es la de una ventanilla.

| Token | Valor | Papel |
|---|---|---|
| `papel` | `#EFEBE2` | fondo: expediente |
| `hoja` | `#F7F4EE` | tarjetas |
| `tinta` / `tinta-media` / `tinta-tenue` | `#24221F` / `#635C52` / `#A79E92` | texto |
| `linea` | `#D8D1C4` | filetes |
| `sello` | `#5A3A82` | violeta de sello de caucho: verificado, acento |
| `pendiente` | `#A8342B` | rojo de "PENDIENTE": por verificar, avisos |

**Reglas que lo sostienen:**

1. **Colores semánticos, nunca literales.** Se escribe `text-sello`, no `text-violet-600`. Los
   tokens viven en `@theme` de `app/globals.css`: cambiar la paleta entera vuelve a ser tocar un
   bloque, no 200 clases. **Nada de `emerald-*`, `stone-*` ni `amber-*` en los componentes.**
2. **El sello es el elemento firma.** El estado de verificación no es un badge: se estampa (caja
   girada, filete doble, condensada en caps). Ver `components/SelloVerificacion.tsx`.
3. **Tipografía: IBM Plex en tres cortes**, elegida porque nació como voz institucional. Condensada
   para sellos y titulares, monoespaciada para datos oficiales (fechas, tipos, importes), sans para
   el cuerpo. Auto-alojada por `next/font`: sin CDN y sin fallback silencioso.
4. **Iconos en SVG propios** (`components/IconoRequisito.tsx`), nunca emoji (FR-028).
5. **Tema claro fijo.** Esta app se lee con prisa, se imprime para llevarla a una ventanilla y la
   acaban leyendo personas mayores. La legibilidad manda sobre el modo oscuro: es una decisión, no
   un olvido.

**Copia.** Tres tics del modelo, desterrados: la raya larga (—) donde el español pide dos puntos o
un punto, la regla de tres ("tu trámite, tu checklist, tu progreso"), y el adorno. **Las citas de
las fuentes oficiales son intocables**, y las rayas que quedan en ellas y en nombres de organismos
("FNMT — Fábrica Nacional de Moneda y Timbre") son legítimas.

**Lo que no se toca:** los nombres coloquiales ("El primer DNI (de un niño o niña)"), el
placeholder "lo del carnet de mi hijo", "Este trámite esconde otros trámites", las comillas latinas
«» y el sello que admite que una ficha no está verificada. Eso ya era humano antes del rediseño.

## 5. Flujos clave (cómo se implementa cada promesa de la spec)

**Wizard → checklist (determinista, FR-004..006):** las respuestas seleccionan requisitos vía
`requisito_condiciones`. Composición = un query con joins. Si una opción tiene
`veredicto_inviable`, la pantalla de resultado es el veredicto con alternativas (FR-005) en lugar
de la checklist. Si una combinación no tiene requisitos curados → mensaje honesto + enlace a
fuente (caso límite de la spec).

**Cadena de prerrequisitos (FR-008):** query recursivo (CTE) desde el trámite raíz; se pinta la
cadena completa antes de los requisitos. Navegación con breadcrumb "volver a [beca]".

**Motor (FR-021..023):** job → fetch del HTML (o texto pegado) → limpieza → Claude API con schema
JSON estricto: cada campo extraído lleva su **cita literal de la fuente**; el prompt prohíbe
rellenar campos sin cita; campo sin cita = campo vacío. Confianza insuficiente o fetch pobre →
job `fallido` con motivo, nada se publica (FR-023). El borrador se revisa en `/admin` con la fuente
al lado (split view) y publicar exige marcar "he cotejado cada requisito contra la fuente".

**Compartir (FR-014):** `/c/[token]` renderiza la checklist en solo lectura, sin sesión.

**Imprimible (FR-016):** la vista "qué llevar" con hoja de estilos print: ≥14pt, sin color
semántico, trámite + requisitos + fuente + fecha de verificación.

## 6. Fases de construcción (agosto, ~4-5 semanas a tiempo parcial)

Mapeadas a las prioridades de la spec. Regla de recorte heredada: si falta tiempo, cae volumen de
contenido, nunca funcionalidad.

| Fase | Semana | Entrega (verificable) |
|---|---|---|
| **0. Esqueleto** | 1 | Repo desplegado en Vercel con URL pública desde el día 1; Supabase conectado; esquema completo migrado; seed con 2 fichas de prueba |
| **1. Walking skeleton (P1)** | 1-2 | Viaje completo con 2 fichas: catálogo → búsqueda por alias → wizard (con veredicto) → checklist con cadena → marcar (anónimo, localStorage) → elegir canal → "antes de empezar"/"qué llevar" imprimible |
| **2. Persistencia real (P1)** | 2 | Login magic link, merge anónimo→cuenta probado, multi-checklist con nombre, multi-dispositivo |
| **3. Confianza + cierre (P2)** | 3 | Sello con degradación derivada, compartir por token, "¿salió a la primera?", reportar error |
| **4. Motor (P3)** | 4 | `/admin`: cola, extracción con citas, revisión split-view, publicar con validación de ciclos |
| **5. Contenido + pulido** | 3-5 (paralelo) | Las 11 fichas curadas y verificadas a mano contra fuente oficial; ensayo de la demo de 3 min; móvil revisado |

La fase 5 es **paralela y humana**: la curación de las 11 fichas empieza en la semana 3 usando el
motor en local si hace falta, y es el cuello de botella asumido. La cadena estrella
(beca → certificado → DNI) se cura primero: es la demo.

## 7. Verificación

- **Por fase**: cada fase termina con su recorrido manual en la URL pública (no en local).
- **E2E mínimo** (Playwright como *test*, no como scraper): el viaje de la demo completo, corrido
  en CI en cada push. Si la demo se rompe, el push lo cuenta.
- **Contenido**: checklist de curación por ficha (fuente abierta al lado, requisito a requisito,
  fecha estampada). SC-002 se audita listando fichas con `generada_por_ia = true` y sin revisión.
- **La demo se ensaya** contra producción la última semana, cronometrada (<3 min, SC-007).

## 7bis. Red de seguridad automática *(añadida el 17/07)*

Como el código se escribe 100% por prompts, un cambio puede romper una invariante sin que nadie lo
note. Se montó una red que lo caza antes que un humano. Detalle operativo en AGENTS.md; el resumen:

- **Tests de invariantes (Vitest, `npm test`)** sobre `lib/` y los datos, sin runtime ni BD:
  - Regla de oro (FR-019): ninguna ficha real sin citar; los pendientes no publican contenido.
  - Estructura del wizard (primera pregunta destinatario, ids únicos, condiciones que existen),
    integridad referencial de las cadenas (`getCadena`), aislamiento territorial (`visibleEnZona`),
    sello a 90 días (FR-020, extraído a `lib/sello.ts`), taxonomía por hechos vitales.
- **Accesibilidad**: `axe` sobre los componentes de presentación + **contraste WCAG AA** de la
  paleta leído de `globals.css` (fue lo que destapó que `tinta-tenue` daba 2.2:1; corregido a
  `#726957`). Guardias del "sello": cero emoji en la UI (FR-028) y solo tokens de color semánticos.
- **CI** (GitHub Actions, `.github/workflows/ci.yml`): lint + tipos + tests + build en cada push y
  PR a `main`. El build degrada sin Supabase, así que no necesita secretos.
- **Skill `/revisar-codigo`**: revisión de mantenibilidad contra los patrones del proyecto.
- **Docs generadas** (`npm run docs` → `docs/estado-catalogo.md`), con un test que falla si derivan.

Lo que aún NO está: el **E2E del viaje de la demo** (Playwright) que anticipaba §7 sigue pendiente
(T-025). La CI ya corre, pero verifica la lógica y el build, no el clic-a-clic del recorrido.

## 8. Riesgos técnicos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| El merge anónimo→cuenta pierde progreso | Construirlo en semana 2 con test E2E propio; hasta el login, localStorage nunca se borra tras migrar (se marca migrado) |
| El fetch de sedes trae HTML vacío (JS pesado) | Fallback "pegar texto" ya en el diseño; Playwright solo si sobra tiempo |
| La extracción alucina | Citas obligatorias por campo + revisión humana bloqueante; sin cita no hay dato |
| Vercel/Supabase free tier se queda corto en la demo | Volumen del MVP ínfimo; ensayar la demo contra producción detecta cualquier límite antes del directo |
| Deriva del reto: editar código a mano "solo un segundo" | Disciplina de pareja: el repo se toca solo vía Claude Code; revisar `git log` semanalmente como coartada |

## 9. Lo que este plan NO decide (siguiente paso: tasks)

El desglose en tareas ejecutables por Claude Code (Spec Kit: spec → plan → **tasks** → implement)
se genera al arrancar la Fase 0, tomando este plan y la spec como entrada. Una tarea = un prompt
con criterio de aceptación verificable.
