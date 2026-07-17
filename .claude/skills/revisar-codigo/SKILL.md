---
name: revisar-codigo
description: Revisa que un cambio de A la Primera es mantenible y sigue los patrones del proyecto antes de commitear. Comprueba primero la puerta automática (tipos, tests, lint) y luego lo que una máquina no ve: la regla de oro FR-019, el sello del diseño (tokens semánticos, cero emoji, sin tics de modelo), el patrón de estado con store externo, proxy.ts que nunca lanza, secretos que no llegan al cliente, accesibilidad y separación en funciones puras testeables. Úsala cuando el usuario pida "revisa el código", "esto es mantenible", "pásalo por revisión", antes de un commit grande, o tras añadir una feature. Devuelve un diagnóstico por severidad, no reescribe sola.
---

# Revisar código de A la Primera

Una pasada de mantenibilidad **antes de commitear**. No sustituye a la suite de tests: la usa como
suelo y añade lo que los tests no pueden ver — patrones, arquitectura, diseño y criterio.

Ámbito por defecto: **el diff sin commitear** (`git diff` + `git status`). Si el usuario señala un
fichero o carpeta, céntrate ahí. Para una auditoría completa, recorre `components/`, `app/` y `lib/`.

## 0. La puerta automática (si esto no pasa, para aquí)

Lo mecánico ya está cubierto; córrelo antes de mirar nada a mano:

```bash
npx tsc --noEmit          # tipos
npm test                  # invariantes de dominio + a11y + contraste
npm run lint              # estilo y errores de eslint
```

Si algo falla, el arreglo de eso es la revisión: no sigas al criterio humano con la base roja.
Recuerda lo que ya vigila la suite (no lo repitas a mano): regla de oro en los datos, estructura del
wizard, integridad referencial de cadenas, aislamiento territorial, sello a 90 días, taxonomía,
axe sobre componentes y contraste AA de la paleta. Ver la sección "Red de seguridad" de AGENTS.md.

## 1. La regla de oro en el CÓDIGO (FR-019) — lo más grave

Los tests cubren los *datos*; tú cubre los *caminos de código nuevos*.

- ¿Algún componente o ruta **genera texto de cara al usuario en runtime** en vez de leerlo del
  catálogo curado? Bandera roja: una llamada a un LLM, `fetch` a una API de IA, o texto de requisito
  construido al vuelo en el render. La IA solo vive en el pipeline de curación, offline.
- ¿Se pinta contenido de una ficha `pendiente` como si fuera real? Un pendiente solo dice "en
  preparación"; nunca requisitos. (Grep: `pendiente` en el componente que renderiza.)
- ¿Se sella una ficha desde el código o con SQL? El sello solo lo pone `npm run verificar <slug>`.
  Bandera: cualquier `update ... verificada_en` o escritura a `verificaciones.ts` que no venga del
  script.

## 2. El sello del diseño (identidad) — reglas 6-9 de AGENTS.md

Recetas rápidas sobre el diff:

```bash
# Colores prohibidos (debe salir vacío): solo tokens semánticos, nunca paletas de Tailwind
grep -rnE "(emerald|stone|amber|green|violet|slate|zinc|gray|red|blue)-[0-9]" components/ app/
# Emoji en la UI (FR-028) — ya hay guardia automática (tests/patrones.test.ts); esto es para
# inspeccionar. En COMENTARIOS está permitido; las flechas tipográficas ←/→ también (no van aquí).
grep -rnP "[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}\x{2B00}-\x{2BFF}\x{FE0F}]" components/ app/
# Raya larga (—) en texto propio: tic de modelo. En CITAS de fuentes oficiales se respeta.
grep -rn "—" components/ app/
```

- Color: solo `papel/hoja/tinta/tinta-media/tinta-tenue/linea/sello/pendiente` (y sus `-suave`).
  `text-sello`, nunca `text-violet-600`. **No hay verde en esta app.**
- Emoji: cero en lo que se renderiza. Si hace falta un icono, va como SVG en `IconoRequisito.tsx`.
  Un match dentro de un comentario (`// antes eran 📄 💻`) es correcto; uno en JSX, no.
- Tipografía por rol: `font-cond` sellos/titulares, `font-mono` datos oficiales, `font-sans` cuerpo.
- Copia: sin rayas largas ni reglas de tres en texto nuestro. **Las citas oficiales «...» no se
  tocan jamás**, ni su puntuación — son la prueba de la regla de oro.

## 3. Patrones de arquitectura

- **Estado de cliente = store externo** (`useSyncExternalStore`), como `lib/zona.ts`,
  `checklist-store.ts`, el "ahora" del sello. Bandera: `useState`/`useEffect` para estado
  compartido o que debe persistir/sincronizarse entre pestañas. (Local y efímero de un componente sí
  puede usar `useState`.)
- **`proxy.ts` no lanza nunca**: todo en try/catch y `matcher` solo en las rutas con sesión. Si el
  diff lo toca, releélo entero: una excepción aquí tira la web (ya nos pasó).
- **Estados derivados en lectura**, no jobs que los actualicen (el sello caduca al leerse).
- **Modelo territorial**: un autonómico/local nuevo se cura POR comunidad, con su fuente. Bandera:
  "un esqueleto con variantes" o rellenar la comunidad que falta con la de otra — es síntesis,
  contra la regla de oro. Si no hay ficha para esa zona, se dice con honestidad.
- **Secretos**: solo `NEXT_PUBLIC_*` puede aparecer en componentes de cliente. Bandera roja:
  `SUPABASE_SERVICE_ROLE`, `DATABASE_URL` o cualquier secreto referenciado en un fichero `"use
  client"`. (Grep: `process.env` en ficheros con `"use client"`.)
- **RLS**: toda tabla nueva en una migración nace con RLS activado.

## 4. Accesibilidad (lo que axe no pilla solo)

- Todo control interactivo con **nombre accesible**: `<label>` asociado, o `aria-label`. Iconos
  decorativos con `aria-hidden`. (El test de a11y cubre los componentes que ya existen; revisa los
  nuevos.)
- **Foco visible** al navegar con teclado (`focus:` que se vea; el contraste del foco lo mide el test).
- Orden de lectura y jerarquía de encabezados con sentido para un lector de pantalla — esto pide ojo
  humano, no se automatiza.
- El **imprimible** (`@media print`) sigue legible y completo: es el único canal hacia el
  beneficiario (la madre de Marta).

## 5. Mantenibilidad general

- **Lógica testeable fuera del componente**: si hay una regla derivable (fechas, importes, filtros),
  ¿está en `lib/` como función pura con su test? El sello se extrajo a `lib/sello.ts` justo por esto.
- **Sin duplicación** de la verdad: un dato vive en un sitio (el sello en `verificaciones.ts`, no
  duplicado en BD; el "ensamblado" del catálogo en un solo `ensambla`).
- **Comentarios que explican el porqué**, no el qué. Un comentario que narra la línea siguiente
  sobra; uno que explica una decisión no obvia (por qué el store externo, por qué `#726957`) se queda.
- **Nombres en español** coherentes con el dominio (trámite, ficha, sello, zona, pendiente).

## Cómo entregar la revisión

Diagnóstico por severidad, con `fichero:línea` y el porqué. No reescribas por tu cuenta salvo que el
usuario lo pida; propón el arreglo.

```
Revisión · <ámbito> · puerta automática: ✅ tipos · ✅ tests · ✅ lint

🔴 Grave (rompe una regla innegociable)
   components/X.tsx:42 — genera el texto del requisito en runtime (FR-019). Debe leerse del catálogo.
🟡 Mantenibilidad (deuda, no bloquea)
   lib/Y.ts:10 — lógica de fecha dentro del componente; extraer a lib/ con test.
🟢 Detalle
   components/Z.tsx:5 — raya larga en texto propio; usar dos puntos.

Si nada salta: dilo. "Sigue los patrones, la puerta automática pasa" es un resultado válido.
```

## Cerrar

1. Si la revisión encontró algo y el usuario pide arreglarlo, hazlo y **vuelve a correr la puerta
   automática** antes de dar por bueno.
2. Si aparece un patrón nuevo que debería vigilarse siempre, propón añadirlo: si es mecánico, como
   test en `tests/`; si es de criterio, como regla en AGENTS.md y aquí.
3. Commit desde Claude Code (Co-Authored-By; reglas del reto en AGENTS.md).
