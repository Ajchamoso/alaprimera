# Cómo se cura una ficha

> El cuello de botella real del proyecto. La IA acelera la extracción; **la
> verificación no la puede hacer una IA** — es lo que separa esto de publicar
> información falsa sobre trámites oficiales.

## La regla que no se negocia

**La ficha guía; la fuente manda.** Ningún dato entra sin cita literal de la
página oficial. Sin cita → el campo va vacío. Ante la duda: vacío y honesto
antes que completo y falso (FR-019, FR-021, FR-023).

Una alucinación aquí no es un bug: es una persona que pierde su cita. Y es
exactamente el "contenido engañoso" que las bases del Viberano prohíben.

## El flujo (3 pasos)

### 1. Extraer (con IA, en sesión de Claude Code)

Se le pide a Claude que lea la fuente oficial y extraiga **con cita literal**
de cada dato, diciendo explícitamente qué NO aparece en la página en vez de
suponerlo. Prompt que funciona:

> Extrae LITERALMENTE los requisitos y pasos de [URL]. Para cada dato, cita el
> texto literal de la página. Si algo no aparece, dilo explícitamente en vez de
> suponerlo.

**Aprendido el 17/07:** las sedes suelen ser páginas-índice que enlazan a
subpáginas (configuración previa, acreditación…). Una URL rara vez basta: hay
que recorrer las subpáginas y unir. Si una devuelve 404, se dice, no se rellena
de memoria.

### 2. Volcar

La ficha se escribe en `lib/data/tramites.ts` con:
- `verificadaEn: null` → la app muestra "⚠️ sin verificar" (correcto: aún lo está).
- `generadaPorIa: true` si la extrajo la IA.
- La cita literal dentro de `explicacion`, entre comillas, precedida de "Fuente:".

Luego: `DATABASE_URL=... npm run db:seed`

### 3. Verificar (humano, obligatorio)

Con la fuente oficial abierta al lado, **requisito a requisito**:

- [ ] ¿Cada dato aparece de verdad en la fuente? (la cita es la prueba)
- [ ] ¿Falta algo que la fuente pide y la ficha no recoge?
- [ ] ¿Hay algo que la ficha diga y la fuente no? → **fuera**
- [ ] ¿Los enlaces (fuente, cita previa) abren donde deben?
- [ ] ¿Las preguntas del wizard reflejan distinciones reales de la fuente?

Solo cuando todo cuadra:

```sql
update tramites set verificada_en = now(), generada_por_ia = false
where id = 'slug-del-tramite';
```

A partir de ahí la app muestra "✅ Verificada el DD/MM" y, a los 90 días,
degrada sola a "puede estar desactualizada" (FR-020).

## Por qué la verificación humana no es burocracia

Ejemplo real del 17/07, curando el certificado FNMT: el seed de desarrollo
(escrito de memoria por un modelo, sin fuente) daba a elegir "vídeo
identificación" como forma de acreditarse. **La fuente oficial dice que es un
proceso distinto** ("Certificado con Vídeo Identificación" ≠ "Certificado con
Acreditación Presencial"). La extracción citada lo cazó.

Ese es el trabajo. Un modelo escribe algo plausible; la fuente decide si es
verdad.

## Lo que la extracción citada regala

Al leer la fuente aparecen distinciones que nadie habría inventado, y que son
**personalización real**: la documentación para acreditarse cambia según seas
español, de la UE o de fuera — tres listas distintas, las tres citadas. Eso es
justo lo que las guías genéricas no hacen.

## Lo que la curación real nos enseñó (17/07)

**Las sedes son páginas-índice.** Ni la FNMT ni el portal del DNI ni la Comunidad de Madrid tienen
los datos en su página principal: hay que bajar a las subpáginas (configuración previa, acreditación,
requisitos). Una URL rara vez basta, y alguna devuelve 404 — se dice, no se rellena de memoria.

**Hay trámites con plazo.** Las becas 2026-2027 se pedían del 29/04 al 28/05: hoy están cerradas.
Servir una checklist impecable de un trámite que no puedes solicitar es engañar. De ahí salió el
campo `plazo` y el aviso en la ficha (FR-027).

**La verificación humana caza inventos, y no pocos.** Cuatro solo en el seed de desarrollo escrito
de memoria:

| Lo que decía el seed | Lo que dice la fuente |
|---|---|
| "Vídeo identificación" como forma de acreditar el certificado | Es un **proceso distinto** (Certificado con Vídeo Identificación ≠ con Acreditación Presencial) |
| Foto "sin gafas oscuras" | No lo dice; sí dice «cabeza totalmente descubierta» y **máximo 2 años** de antigüedad |
| "En algunas oficinas solo se paga en efectivo" | «abono en efectivo **o a través de tarjeta** de crédito/débito» |
| Menores: "libro de familia o certificado de nacimiento" | El adulto presenta **su propio** DNI, TIE o Certificado de Registro de Ciudadano de la Unión |

Todas eran plausibles. Ninguna era verdad. Ese es el trabajo.

## Estado del catálogo

| Trámite | Extraída | Verificada |
|---|---|---|
| Certificado digital FNMT | ✅ 17/07, con citas | ❌ **pendiente** |
| Renovación DNI | ✅ 17/07, con citas | ❌ **pendiente** |
| Beca comedor Madrid | ✅ 17/07, con citas | ❌ **pendiente** |
| Los otros 8 (ver spec.md) | ❌ | ❌ |

**Inferencia a confirmar en la verificación:** en la beca, el enlace ⛓️ al certificado digital.
La fuente dice «uno de los sistemas de firma electrónica reconocidos por la Comunidad de Madrid»
sin nombrarlos; que el certificado FNMT valga es deducción nuestra, no cita. Confirmadlo o
matizadlo.
