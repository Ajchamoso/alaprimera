---
name: curar-tramite
description: Investiga un trámite administrativo español en su fuente oficial, extrae los requisitos con cita literal y lo añade al catálogo de A la Primera (ficha + seed a BD + verificación en navegador). Úsala cuando el usuario pida "añade el trámite X", "cura el trámite X", "investiga cómo se hace X" o quiera ampliar el catálogo de la app. NO publica nada como verificado — toda ficha nace "generada por IA, sin verificar" hasta el cotejo humano.
---

# Curar un trámite y añadirlo a A la Primera

Convierte un trámite ("renovar el DNI", "pedir la ayuda X") en una ficha del catálogo: fuente
oficial localizada, requisitos extraídos **con cita literal**, preguntas de personalización,
encadenamientos, seed a la base de datos y verificación en el navegador.

## La regla que no se negocia

**La ficha guía; la fuente manda.** Ningún dato entra sin cita literal de la página oficial.
Sin cita → el campo va vacío. Ante la duda: vacío y honesto antes que completo y falso.
Una alucinación aquí no es un bug: es una persona que pierde su cita en una oficina.

Y su simétrica, igual de importante: **un "no aparece" es una afirmación tan seria como un dato.**
Las herramientas de fetch RESUMEN — su silencio no es prueba de ausencia. Un requisito real
descartado por "no aparecía" desaparece sin dejar rastro y deja al usuario tirado en la ventanilla.

## Paso 1 — Localizar la fuente oficial

- Busca la **sede electrónica oficial** (dominios `.gob.es`, `sede.*`, `comunidad.madrid`,
  `sede.madrid.es`). Nunca cures desde fuentes secundarias (tramites.pro, blogs, federaciones):
  ahí nacen los datos zombis (ej. real: "familia numerosa hasta los 26 años" está en toda la web
  y NO está en la sede oficial).
- Las sedes suelen ser **páginas-índice sin datos** que enlazan a subpáginas (requisitos,
  documentación, cómo solicitar). Una URL rara vez basta: recorre las subpáginas.

### Mapa de minas conocido (comprobado el 17/07/2026)

| Fuente | Trampa | Qué hacer |
|---|---|---|
| `madrid.es` / `sede.madrid.es` | 403 a curl y fetch en todo el dominio; contenido en acordeones invisibles en texto plano | Usar el navegador (herramientas Browser) y leer el DOM |
| `administracion.gob.es` | Devuelve **HTTP 200 con páginas de error** | Comprobar el `<title>` (si dice "Error", no es contenido); el REA real está en `sede.administracion.gob.es/servicios-electronicos/rea` |
| `dnielectronico.es` | `REF_1084` es el PASAPORTE aunque los buscadores la den como "requisitos del DNI"; charset `iso-8859-1` | DNI: `REF_410` (primera) y `REF_420` (renovación); usar `iconv -f iso-8859-1 -t utf-8` |
| `sede.comunidad.madrid` | Documentación en acordeones de pestañas: al desetiquetar, títulos y contenidos se separan | Mapear pestañas por posición en el DOM, no "a ojo" |
| `sede.mjusticia.gob.es` | Es fachada: los requisitos viven en `www.mjusticia.gob.es/es/ciudadania/tramite?k=...` | Ir al dominio bueno |
| Todas | `&nbsp;` dentro de frases rompe greps; `grep` con `.` no cruza saltos de línea | Aplanar antes: `sed 's/&nbsp;/ /g' \| tr '\n' ' ' \| tr -s ' '` |

## Paso 2 — Extraer con cita obligatoria

Para cada dato pide/extrae la **cita literal**. Prompt patrón para WebFetch:

> Extrae LITERALMENTE los requisitos y pasos de [tema]. Para cada dato, cita el texto exacto de la
> página. Si algo no aparece, dilo explícitamente en vez de suponerlo.

**Antes de afirmar que algo NO está en la fuente**, verifica contra el HTML crudo:

```bash
curl -s "URL" | sed 's/&nbsp;/ /g; s/<[^>]*>/ /g' | tr '\n' ' ' | tr -s ' ' | grep -io ".\{60\}TERMINO.\{60\}"
```

Qué buscar siempre:
- **Documentación** por caso (español/UE/extranjero, mayor/menor, primera vez/renovación…) — estas
  distinciones son la personalización del wizard, y las hace la fuente, no tú
- **Requisitos técnicos** (certificado, Cl@ve, navegador, software) — nadie más los cubre
- **Encadenamientos**: ¿exige otro trámite? (DNI en vigor, empadronamiento < 3 meses…) Solo si la
  fuente lo dice; anota la caducidad del documento previo si la da
- **Plazos**: ¿tiene ventana de solicitud? (ej. becas). Si está cerrada, la ficha debe decirlo
- **Veredictos**: ¿puede hacerlo un tercero por el titular? Busca "presencia física",
  "personalmente", "representación". El mejor veredicto es el citado (ej. Cl@ve: «no cabe instar
  registros en CL@VE mediante representación»)
- **Tasas**: importe citado y exenciones (familia numerosa suele serlo)
- Para catálogos grandes: lanza **agentes en paralelo** (2 trámites por agente), pasándoles estas
  reglas y el mapa de minas en el prompt

## Paso 3 — Escribir la ficha

En `lib/data/tramites.ts`, siguiendo el tipo `Tramite` de `lib/types.ts`:

- `slug` legible y estable (será el id en BD y en la URL)
- `verificadaEn: null` y `generadaPorIa: true` — SIEMPRE. Solo un humano sella
- `nombreColoquial` como habla la gente; `alias` con lo que escribiría en el buscador
- Preguntas: máx. 4, la primera SIEMPRE el destinatario (`tipo: "destinatario"`). Si un caso hace
  inviable la vía → `veredictoInviable: true` con `textoAlternativas` que dé opciones reales
  (idealmente con cita)
- Requisitos: la **cita literal entre «» dentro de `explicacion`, precedida de "Fuente:"**.
  `soloSiOpciones` para condicionar por respuesta. `tipo`: doc_fisico / doc_digital / tecnico /
  tramite_previo. Si es trámite previo del catálogo → `tramitePrevioSlug` + entrada en
  `prerequisitos` con nota (incluida la caducidad)
- `plazo` si hay ventana de fechas, con `nota` de cuándo suele abrir
- Comentario de cabecera: `// ── Curada desde la fuente oficial el DD/MM/AAAA (pendiente de verificación humana) ──`

## Paso 4 — Seed y verificación en navegador

```bash
npx tsc --noEmit
DATABASE_URL="$(grep DATABASE_URL .env.local | cut -d= -f2-)" npm run db:seed
```

Luego, con el dev server (`preview_start` → `alaprimera-dev`), verifica en el navegador:
1. La ficha aparece en el catálogo y la encuentra una búsqueda coloquial
2. El wizard: al menos dos combinaciones de respuestas dan checklists distintas (y correctas)
3. El veredicto, si lo hay, se muestra con sus alternativas
4. La cadena ⛓️ enlaza y navega
5. El sello dice "⚠️ Generada por IA — sin verificar"

Ojo al automatizar clicks: los pills del selector y los botones del wizard pueden compartir texto
("Para mí") — acota al contenedor (`section.bg-emerald-50 button`).

## Paso 5 — Documentar y commitear

1. Actualiza `docs/curacion.md`: tabla de estado del catálogo, **inferencias tuyas que no son
   citas** (sección propia — ej. "que el certificado FNMT valga como 'firma electrónica
   reconocida' es deducción"), y hallazgos que merezcan mirada humana
2. Si descubriste una trampa de fuente nueva, añádela al mapa de minas de este skill y al de
   `docs/curacion.md`
3. Commit (recuerda: Co-Authored-By y sin tocar código a mano — reglas en AGENTS.md)

## Paso 6 — Recordar la deuda

Termina SIEMPRE recordando al usuario que la ficha está **pendiente de verificación humana**:
abrir la fuente al lado y cotejar requisito a requisito (checklist en `docs/curacion.md`).
Al aprobarla:

```sql
update tramites set verificada_en = now(), generada_por_ia = false where id = 'slug-del-tramite';
```

Ese paso no lo puede hacer una IA, y es lo que separa este producto de publicar información falsa.
