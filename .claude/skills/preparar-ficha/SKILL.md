---
name: preparar-ficha
description: Prepara o revisa una ficha de trámite de A la Primera contra su fuente oficial. Modo AÑADIR - investiga un trámite nuevo, extrae los requisitos con cita literal y lo mete en el catálogo. Modo REVISAR - comprueba si la fuente sigue diciendo lo mismo que la ficha y muestra solo lo que ha cambiado. Úsala cuando el usuario pida "añade el trámite X", "investiga cómo se hace X", "revisa la ficha de X", "comprueba si X sigue vigente" o quiera ampliar/mantener el catálogo. NUNCA publica nada como verificado - toda ficha nace "generada por IA, sin verificar" hasta el cotejo humano.
---

# Preparar o revisar una ficha de A la Primera

Dos modos, mismas reglas:

- **AÑADIR** — un trámite nuevo entra al catálogo. Fuente oficial → requisitos con cita →
  ficha → seed → verificación en navegador.
- **REVISAR** — una ficha que ya existe se contrasta contra su fuente. Devuelve **solo lo que
  ha cambiado**, para que el cotejo humano sea de minutos y no de una tarde.

## Las dos reglas que no se negocian

**La ficha guía; la fuente manda.** Ningún dato entra sin cita literal de la página oficial.
Sin cita → el campo va vacío. Ante la duda: vacío y honesto antes que completo y falso.
Una alucinación aquí no es un bug: es una persona que pierde su cita en una oficina.

**Un "no aparece" es una afirmación tan seria como un dato.** Las herramientas de fetch
RESUMEN — su silencio no es prueba de ausencia. Nos pasó: dimos por inventado el "sin gafas de
cristales oscuros" del DNI y la fuente sí lo decía. Un requisito real descartado por "no
aparecía" desaparece sin dejar rastro y deja al usuario tirado en la ventanilla. Para afirmar
que la fuente NO dice algo, hay que mirar el HTML crudo.

---

# MODO REVISAR (mantenimiento)

> El truco: **las citas son el ancla.** Cada requisito guarda la frase literal de la fuente. Si
> esa frase sigue estando en la página, el requisito no ha cambiado — y eso se comprueba con un
> `grep`, sin criterio de nadie. Solo lo que ya no case necesita ojos humanos.

## 1. Descarga la fuente y aplánala

```bash
curl -s "URL_FUENTE" | sed 's/&nbsp;/ /g; s/<[^>]*>/ /g' | tr '\n' ' ' | tr -s ' ' > /tmp/fuente.txt
```
Para `dnielectronico.es` añade `| iconv -f iso-8859-1 -t utf-8` tras el `curl`.
Para `madrid.es` (403) usa el navegador y vuelca el DOM.
**Comprueba que bajó contenido real**, no una página de error: `head -c 300 /tmp/fuente.txt`.

## 2. Contrasta cada cita guardada

Saca las citas de la ficha en `lib/data/tramites.ts` (van entre «» tras "Fuente:") y busca cada
una en el volcado:

```bash
grep -c "fragmento literal de la cita" /tmp/fuente.txt
```

Usa un **fragmento distintivo** de la cita (6-10 palabras), no la frase entera: la fuente puede
haber cambiado una coma. Clasifica:

- **Encontrada** → el requisito sigue vigente. No lo toques.
- **NO encontrada** → ⚠️ candidato a cambio. Antes de dar la voz de alarma, busca el concepto
  con otras palabras (`grep -io ".\{60\}tasa.\{60\}"`): puede ser una reescritura, un cambio
  real de dato, o que la página haya movido el contenido a otra subpágina.

## 3. Busca lo que ha aparecido de nuevo

Re-extrae la fuente como en el modo AÑADIR y compárala con la ficha: ¿pide algún requisito que
no tenemos? Ojo especial a lo que cambia por calendario (ver abajo).

## 4. Entrega el diff, no el informe

Devuelve al humano **solo lo que ha cambiado**, con la cita vieja y la nueva:

```
Ficha: renovacion-dni · fuente consultada el DD/MM
✅ 7 de 8 requisitos: la fuente sigue diciendo lo mismo, literalmente.
⚠️ 1 cambio:
   dni-r6 (tasa)
   ficha dice:  «actualmente fijada en 12 euros»
   fuente dice: «actualmente fijada en 13 euros»
🆕 0 requisitos nuevos.
```

Si nada cambió, dilo y ya: es un resultado, no un fracaso. La ficha solo necesita re-sellarse.

## 5. Aplica y re-sella

Actualiza la ficha y `npm run db:seed`. El sello **lo pone un humano**, nunca tú:
```bash
npm run verificar <slug>          # sella con fecha de hoy
npm run verificar <slug> quitar   # retira el sello
```
Escribe en el registro (`lib/data/verificaciones.ts`), que va a git: el historial es la prueba de
quién selló qué. **Nunca con SQL**: un `update` en BD lo borra el siguiente seed, en silencio.

## Cuándo revisar: la deriva es estacional, no aleatoria

No hace falta vigilancia continua, hace falta calendario:

| Cuándo | Qué revisar | Por qué |
|---|---|---|
| **Enero** | Tasas (DNI, pasaporte) | La fuente lo dice: «se actualiza mediante la Ley de Presupuestos Generales del Estado» |
| **Primavera** | Plazos de convocatorias (becas) | Convocatoria anual: fechas nuevas cada año |
| **A los 90 días** | Lo que degrade el sello | FR-020 |
| **Al instante** | Lo que reporte un usuario, y lo que salga en un "no" de "¿salió a la primera?" | Es la señal más barata y con más contexto que tenéis |

Los requisitos de fondo (qué documentos pide el DNI) casi nunca cambian. Priorizad por uso real,
no por ansiedad.

---

# MODO AÑADIR (trámite nuevo)

## 1. Localizar la fuente oficial

Solo sedes oficiales (`.gob.es`, `sede.*`, `comunidad.madrid`). **Nunca** fuentes secundarias
(tramites.pro, blogs, federaciones): ahí nacen los datos zombis — "familia numerosa hasta los 26
años" está en toda la web y **no** está en la sede oficial. Las sedes son páginas-índice: los
datos viven en las subpáginas.

### Mapa de minas (comprobado el 17/07/2026)

| Fuente | Trampa | Qué hacer |
|---|---|---|
| `madrid.es` | 403 a curl y fetch en todo el dominio; contenido en acordeones invisibles en texto plano | Navegador y lectura del DOM |
| `administracion.gob.es` | Devuelve **HTTP 200 con páginas de error** | Mirar el `<title>`; el REA real está en `sede.administracion.gob.es/servicios-electronicos/rea` |
| `dnielectronico.es` | `REF_1084` es el PASAPORTE aunque los buscadores la den como "requisitos del DNI"; charset `iso-8859-1` | DNI: `REF_410` (primera) y `REF_420` (renovación); `iconv` |
| `sede.comunidad.madrid` | Documentación en acordeones de pestañas: al desetiquetar, títulos y contenidos se separan | Mapear pestañas por posición en el DOM, no "a ojo" |
| `sede.mjusticia.gob.es` | Es fachada: los requisitos viven en `www.mjusticia.gob.es/es/ciudadania/tramite?k=...`. Pero `www` da el "qué es", no los plazos ni la documentación | Plazos y docs, en `administracion.gob.es` (Punto de Acceso General) y sus PDFs |
| `seg-social.es` | 403 a curl/fetch en todo el dominio (`www`, `sede`, `revista`); `prestaciones.seg-social.es` es SPA y solo da el `<title>` | Navegador real y lectura del DOM, como `madrid.es` |
| Todas | `&nbsp;` rompe los greps; `grep` con `.` no cruza saltos de línea | Aplanar antes (ver comando arriba) |

## 2. Extraer con cita obligatoria

> Extrae LITERALMENTE los requisitos y pasos de [tema]. Para cada dato, cita el texto exacto de
> la página. Si algo no aparece, dilo explícitamente en vez de suponerlo.

Qué buscar siempre:
- **Distinciones de caso** (español/UE/extranjero, menor/adulto, primera vez/renovación) — son la
  personalización del wizard, y las hace la fuente, no tú
- **Requisitos técnicos** (certificado, Cl@ve, navegador, software) — nadie más los cubre
- **Encadenamientos**: ¿exige otro trámite? Anota su caducidad (el certificado de nacimiento del
  DNI caduca a los 6 meses; el empadronamiento a los 3)
- **Plazos**: ¿ventana de solicitud? Si está cerrada, la ficha debe decirlo (FR-027)
- **Veredictos**: ¿puede un tercero hacerlo por el titular? Busca "presencia física",
  "personalmente", "representación". El mejor veredicto es el citado (Cl@ve: «no cabe instar
  registros en CL@VE mediante representación por parte de un tercero o apoderado»)
- **Tasas**: importe citado y exenciones (familia numerosa suele estar exenta)
- Para varios trámites: lanza **agentes en paralelo** (2 por agente) con estas reglas y el mapa
  de minas en el prompt

## 3. Escribir la ficha

En `lib/data/tramites.ts`, según el tipo `TramiteContenido` de `lib/types.ts`:

- `slug` legible y estable (es el id en BD y en la URL)
- **Aquí NO se pone nada de verificación.** El estado del sello vive en el registro
  (`lib/data/verificaciones.ts`) y una ficha que no esté allí sale sola como "sin verificar", que
  es la verdad. Nunca la selles tú: eso afirma que una persona la cotejó
- `nombreColoquial` como habla la gente; `alias` con lo que escribiría en el buscador
- Preguntas: máx. 4, la primera SIEMPRE el destinatario (`tipo: "destinatario"`). Caso inviable
  → `veredictoInviable: true` + `textoAlternativas` con opciones reales
- Requisitos: **la cita literal entre «» dentro de `explicacion`, precedida de "Fuente:"** — es
  lo que hará posible el modo REVISAR mañana. `soloSiOpciones` para condicionar por respuesta.
  `tipo`: doc_fisico / doc_digital / tecnico / tramite_previo. Trámite previo del catálogo →
  `tramitePrevioSlug` + entrada en `prerequisitos` con nota y caducidad
- `plazo` si hay ventana de fechas, con `nota` de cuándo suele abrir
- Cabecera: `// ── Preparada desde la fuente oficial el DD/MM/AAAA (pendiente de verificación humana) ──`

## 4. Seed y verificación en navegador

```bash
npx tsc --noEmit
DATABASE_URL="$(grep DATABASE_URL .env.local | cut -d= -f2-)" npm run db:seed
```

Con el dev server (`preview_start` → `alaprimera-dev`), comprueba: la ficha sale en el catálogo y
la encuentra una búsqueda coloquial; dos combinaciones del wizard dan checklists distintas y
correctas; el veredicto muestra sus alternativas; la cadena ⛓️ navega; el sello dice
"⚠️ Generada por IA — sin verificar".

Al automatizar clicks: los pills y los botones del wizard comparten texto ("Para mí") — acota al
contenedor (`section.bg-emerald-50 button`).

---

## Cerrar (los dos modos)

1. Actualiza [docs/preparar-fichas.md](../../../docs/preparar-fichas.md): estado del catálogo,
   **inferencias tuyas que no son citas** (sección propia), hallazgos para mirada humana. Si
   encontraste una trampa de fuente nueva, añádela al mapa de minas de aquí y de allí.
2. Commit (Co-Authored-By; sin tocar código a mano — reglas en AGENTS.md).
3. **Recuerda SIEMPRE la deuda**: la ficha queda pendiente de verificación humana. Abrir la fuente
   al lado, cotejar, y sellar con `npm run verificar <slug>`. Ese paso no lo puede hacer una IA, y
   es lo que separa este producto de publicar información falsa.
