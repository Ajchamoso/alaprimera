# DESIGN.md: A la Primera

> Contrapropuesta al DESIGN.md derivado de Wise (rama `feat/design`). Misma estructura de
> documento y mismas 5 pantallas; la identidad visual es la que ya está decidida y en producción
> en `app/globals.css` y `docs/plan.md` §4bis. Nombre y colores quedan fijados aquí para el resto
> del reto, como pide el Sprint 2.

## La idea

A la Primera es un asistente de trámites con la administración española. Su concepto central ya
es un objeto físico: **el sello**. Verificar, sellar, caducar. La identidad visual es la de una
ventanilla: papel de expediente, tinta, y el violeta del sello de caucho. El rojo es el de
"PENDIENTE".

Esto es una decisión de credibilidad, no de gusto. El argumento del producto es "esto no se lo
inventa una IA", así que no puede tener el aspecto que las IA generan por defecto (verde sobre
grises, emoji de iconos, la fuente que trae el framework). **No hay verde en esta app.** Tampoco
modo oscuro: la app se lee con prisa, se imprime para llevarla a una ventanilla y la leen
personas mayores. Tema claro fijo, es una decisión y no un olvido.

**Rasgos clave:**

- Un solo acento: el violeta de sello `{colors.sello}` (`#5a3a82`). Verificado, enlaces, acción
  principal. Sin segundo acento de marca.
- El rojo `{colors.pendiente}` (`#a8342b`) no es decoración: significa "sin verificar" o aviso.
- Fondo papel `{colors.papel}` con tarjetas hoja `{colors.hoja}`: el contraste entre las dos
  superficies es la elevación, casi sin sombras.
- Tres cortes de IBM Plex con roles estrictos: condensada para sellos y titulares, monoespaciada
  para datos oficiales, sans para el cuerpo.
- El elemento firma es el **sello estampado**: caja ligeramente girada, filete doble, condensada
  en mayúsculas. El estado de verificación se estampa, no se pone en un badge.
- Cero emoji en la interfaz (FR-028). Iconos SVG propios de trazo simple.

## Colores

Los tokens son semánticos a propósito: se escribe `text-sello`, nunca `text-violet-600`.
Prohibido `emerald-*`, `stone-*`, `amber-*` y `green-*`.

### Superficies

- **Papel** (`{colors.papel}`, `#efebe2`): fondo de página. El expediente.
- **Hoja** (`{colors.hoja}`, `#f7f4ee`): tarjetas y paneles. La hoja encima del expediente.
- **Línea** (`{colors.linea}`, `#d8d1c4`): filetes, bordes y separadores.

### Texto

- **Tinta** (`{colors.tinta}`, `#24221f`): texto principal y titulares.
- **Tinta media** (`{colors.tinta-media}`, `#635c52`): texto secundario.
- **Tinta tenue** (`{colors.tinta-tenue}`, `#726957`): texto terciario. Oscurecido a propósito
  para pasar WCAG AA (4.5:1) porque lleva información real (subtítulos, notas de caducidad), no
  solo decoración. Cualquier color de texto nuevo tiene que pasar AA: lo vigila
  `tests/contraste.test.ts`.

### Acento y estado

- **Sello** (`{colors.sello}`, `#5a3a82`): violeta de sello de caucho. Verificado, acción
  principal, enlaces, foco.
- **Sello suave** (`{colors.sello-suave}`, `#ede6f3`): fondo tintado para superficies de acento.
- **Pendiente** (`{colors.pendiente}`, `#a8342b`): rojo de sello. Sin verificar, avisos,
  obligatorio.
- **Pendiente suave** (`{colors.pendiente-suave}`, `#f7e7e4`): fondo tintado para avisos.

El estado nunca se comunica solo con color (FR-029): siempre va acompañado de texto o forma
(el sello dice "VERIFICADO" o "SIN VERIFICAR", no solo cambia de tinta).

## Tipografía

### Familias

IBM Plex en tres cortes, elegida porque nació como voz institucional y tiene el aire de
formulario oficial que este producto habita. Roles estrictos:

1. **IBM Plex Sans Condensed** (`{font.cond}`, pesos 600 y 700): sellos y titulares. Es la voz
   del tampón: condensada, en mayúsculas cuando estampa.
2. **IBM Plex Mono** (`{font.mono}`, pesos 400 a 600): datos oficiales. Fechas, plazos, tasas,
   importes, códigos, nombres de organismo. Si un dato viene de una fuente oficial, va en mono.
3. **IBM Plex Sans** (`{font.sans}`, pesos 400 a 700): cuerpo, opciones del wizard, botones.

### Escala (móvil primero)

| Token | Tamaño | Fuente y peso | Uso |
|---|---|---|---|
| `{typography.titular-xl}` | 32px | Cond 700 | Titular de portada. |
| `{typography.titular-lg}` | 26px | Cond 700 | Título de pantalla (nombre del trámite). |
| `{typography.titular-md}` | 20px | Cond 700, caps | Título de sección. |
| `{typography.sello}` | 14px | Cond 700, caps, tracking amplio | Texto dentro de sellos y etiquetas estampadas. |
| `{typography.cuerpo-lg}` | 18px | Sans 400 | Entradilla, pregunta del wizard. |
| `{typography.cuerpo}` | 16px | Sans 400 | Cuerpo por defecto. |
| `{typography.cuerpo-strong}` | 16px | Sans 600 | Nombre de requisito, opción elegida. |
| `{typography.dato}` | 14px | Mono 500 | Dato oficial: fecha, plazo, tasa, canal. |
| `{typography.nota}` | 14px | Sans 400 | Notas y texto de apoyo. |
| `{typography.boton}` | 16px | Sans 600 | Etiqueta de botón. |

Cuerpo nunca por debajo de 14px: el público incluye personas mayores y el imprimible llega a una
persona de 74 años.

## Maquetación

### Espaciado

- Unidad base 4px. Escala: 4 · 8 · 12 · 16 · 24 · 32 · 48.
- Interior de tarjeta: 16px en móvil, 24px en pantallas anchas.
- Separación entre secciones: 32px.

### Rejilla y contenedor

- **Móvil primero, en vertical, para usar con el dedo.** Todo a una columna en móvil; el
  contenido centra a un máximo de ~640px en pantallas grandes (la app es lectura y formulario,
  no un dashboard).
- Objetivos táctiles de 48px mínimo. Opciones de wizard y elementos de checklist son la tarjeta
  entera, no solo el texto.

### Impresión

La preparación se imprime (FR-016): legible en blanco y negro, letra amplia, sin fondos de
color. El `@media print` ya existe en `globals.css` y cualquier pantalla nueva con imprimible lo
respeta.

## Elevación y profundidad

| Nivel | Tratamiento | Uso |
|---|---|---|
| 0, plano | Fondo papel, sin borde. | Página. |
| 1, hoja | Fondo hoja + filete `{colors.linea}` de 1px. El contraste papel/hoja es la elevación. | Tarjetas, paneles. |
| 2, estampado | Borde doble (filete exterior e interior) en el color del estado, caja girada ~-2°. | Solo el sello de verificación. |

Sin sombras difusas de app genérica: como mucho una sombra mínima en elementos que flotan de
verdad (barra inferior fija).

## Formas

| Token | Valor | Uso |
|---|---|---|
| `{rounded.sm}` | 4px | Etiquetas pequeñas, casillas. |
| `{rounded.md}` | 8px | Tarjetas, botones, inputs. |
| `{rounded.none}` | 0 | El sello estampado (un tampón no tiene esquinas redondas). |

Nada de pastillas de 24px ni pills: la redondez generosa es el lenguaje de las fintech, no el de
un expediente. Aquí las esquinas son discretas.

## Componentes

### Botones

**`boton-principal`**: fondo `{colors.sello}`, texto blanco, `{typography.boton}`, padding
12px 24px, `{rounded.md}`, alto mínimo 48px.

**`boton-secundario`**: fondo `{colors.hoja}`, texto `{colors.tinta}`, filete `{colors.linea}`,
misma métrica.

**`boton-fantasma`**: sin fondo, texto `{colors.sello}` subrayado. Para "volver" y acciones
menores.

### Tarjetas

**`tarjeta`**: fondo `{colors.hoja}`, filete `{colors.linea}` 1px, `{rounded.md}`, padding 16px.
La tarjeta base de todo: hechos vitales, requisitos, resumen.

**`tarjeta-aviso`**: fondo `{colors.pendiente-suave}`, filete `{colors.pendiente}`, texto
`{colors.tinta}` con título en `{typography.sello}` color `{colors.pendiente}`. Para "requiere
cita previa", "presencial obligatorio".

**`tarjeta-acento`**: fondo `{colors.sello-suave}`, filete `{colors.sello}`. Para el resultado
del wizard y momentos de acento.

### El sello de verificación (componente firma)

**`sello-verificacion`**: caja sin redondeo, borde doble, girada ~-2°, texto
`{typography.sello}` en mayúsculas.

- **Verificado**: borde y texto `{colors.sello}`. Dos líneas: "VERIFICADO" y la fecha del cotejo
  en `{typography.dato}`.
- **Sin verificar**: borde y texto `{colors.pendiente}`. "SIN VERIFICAR · GENERADA POR IA".
- **Caducado** (a los 90 días): borde `{colors.tinta-tenue}`, "REVISIÓN PENDIENTE".

El sello afirma que un humano cotejó la ficha contra la fuente: nunca se estampa "verificado"
sin ese cotejo detrás.

### Wizard

**`opcion-wizard`**: tarjeta seleccionable de ancho completo, icono SVG a la izquierda, nombre
en `{typography.cuerpo-strong}` y aclaración en `{typography.nota}` color
`{colors.tinta-media}`. Seleccionada: filete `{colors.sello}` de 2px y fondo
`{colors.sello-suave}`. Radio accesible: la tarjeta entera es el control.

**`progreso-wizard`**: barra fina superior color `{colors.sello}` sobre `{colors.linea}`, con
"Pregunta N de M" en `{typography.dato}`.

### Checklist

**`item-checklist`**: casilla cuadrada `{rounded.sm}` con filete `{colors.tinta-media}`; al
marcar, fondo `{colors.sello}` con aspa blanca y el texto pasa a `{colors.tinta-media}`
tachado. Nombre en `{typography.cuerpo-strong}`, detalle en `{typography.nota}`, y cualquier
dato oficial (formato, importe, plazo) en `{typography.dato}`.

**`cita-fuente`**: la cita literal de la fuente oficial, entre comillas latinas «», en
`{typography.nota}` con filete izquierdo `{colors.linea}`. Las citas no se tocan jamás, ni su
puntuación.

### Ficha de trámite

**`ficha-datos`**: tabla de pares clave/valor. Claves en `{typography.sello}` color
`{colors.tinta-tenue}`; valores en `{typography.dato}`. Nivel, canales, plazo, tasa, fuente
oficial.

**`etiqueta-hecho-vital`**: etiqueta pequeña `{rounded.sm}`, fondo `{colors.sello-suave}`,
texto `{typography.sello}` color `{colors.sello}`.

### Navegación

**`barra-superior`**: fondo `{colors.papel}`, título de pantalla en `{typography.titular-md}`,
flecha de volver como SVG. Sin sombra: un filete `{colors.linea}` inferior.

**`barra-inferior-fija`**: para la acción principal de la pantalla (continuar, imprimir). Fondo
`{colors.papel}` con filete superior, botón principal a ancho completo.

### Iconos

SVG propios de trazo simple (`components/IconoRequisito.tsx`), stroke 1.5px, color heredado del
texto. **Nunca emoji** (FR-028): los dibuja el sistema del usuario y se rompen. Si hace falta un
icono nuevo, se añade al catálogo de SVG.

## La copia

- Español llano, sin jerga administrativa sin explicar. Se escribe para la persona que hace el
  trámite, no para la administración.
- Sin tics de modelo: nada de rayas largas (se usa dos puntos o punto), nada de reglas de tres,
  nada de adorno.
- Los nombres coloquiales se conservan: "Lo del carnet de mi hijo...", "Este trámite esconde
  otros trámites".
- Las citas de fuentes oficiales son intocables, con su puntuación original. Comillas latinas «».
- Honestidad ante todo: si una comunidad no tiene ficha, se dice; si una ficha no está
  verificada, se estampa "SIN VERIFICAR". Vacío y honesto antes que completo y falso.

## Sí y no

### Sí

- Reservar el violeta `{colors.sello}` para verificado, acción principal y foco. Es el único
  acento.
- Estampar el estado de verificación con el sello girado de borde doble. Es el elemento firma.
- Datos oficiales siempre en `{typography.dato}` (mono): una fecha en monoespaciada dice "esto
  viene de un documento".
- Elevación por contraste papel/hoja y filetes, no por sombras.
- Objetivos táctiles de 48px y cuerpo de 16px: el público incluye personas mayores.

### No

- Ni un verde en la interfaz. Tampoco `emerald-*`, `stone-*` ni `amber-*` por clase literal.
- Ni un emoji: iconos SVG propios (FR-028).
- Sin modo oscuro: tema claro fijo, por legibilidad e impresión.
- Sin pastillas de 24px ni tipografía de peso 900: la voz es institucional, no fintech.
- El estado nunca se comunica solo con color (FR-029): siempre texto o forma además del color.
- "Verificado" no se estampa nunca sin cotejo humano detrás.
