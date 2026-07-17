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

**La verificación humana caza inventos.** Tres confirmados en el seed escrito de memoria:

| Lo que decía el seed | Lo que dice la fuente |
|---|---|
| "Vídeo identificación" como forma de acreditar el certificado | Es un **proceso distinto** (Certificado con Vídeo Identificación ≠ con Acreditación Presencial) |
| "En algunas oficinas solo se paga en efectivo" | «abono en efectivo **o a través de tarjeta** de crédito/débito» |
| Menores: "libro de familia o certificado de nacimiento" | El adulto presenta **su propio** DNI, TIE o Certificado de Registro de Ciudadano de la Unión |

### ⚠️ El error que va en la otra dirección (y es peor)

El 17/07 dimos por invento un cuarto dato —la foto "sin gafas oscuras"— porque la extracción
respondió "no especificado". **Era falso: la fuente sí lo dice**, literalmente: «sin gafas de
cristales oscuros o cualquier otra prenda que pueda impedir o dificultar la identificación». La
herramienta de extracción había *resumido* la página en vez de transcribirla, y su silencio se
interpretó como ausencia.

**Regla que sale de aquí: un "no aparece" de una extracción que resume NO es prueba de ausencia.**
Para afirmar que la fuente no dice algo hay que mirar el HTML crudo (`curl` + quitar etiquetas +
`grep`; ojo con `iso-8859-1` en dnielectronico.es, que corrompe los acentos si no se convierte).

Los falsos negativos son más peligrosos que los falsos positivos: un invento se caza al cotejar,
pero un requisito que descartas por creerlo inventado desaparece de la lista sin dejar rastro — y
tu usuario se queda en la ventanilla sin él.

## Dos fuentes que dan guerra (aviso de arquitectura)

- **`madrid.es` bloquea el acceso automatizado**: 403 en todo el dominio, a `curl` y a fetch. Solo
  se lee con navegador real, y sus datos viven en acordeones que no salen en el texto plano. Si el
  motor de R2 depende de scrapear Madrid, esto no es un detalle: es un riesgo de diseño.
- **`dnielectronico.es` tiene trampas de URL**: `REF_1084` es la página del **pasaporte**, no del
  DNI, aunque los buscadores la devuelvan como "requisitos del DNI". La del DNI es `REF_410`
  (primera inscripción) y `REF_420` (renovación).

## Estado del catálogo (7 de 11 extraídas)

| Trámite | Extraída | Verificada |
|---|---|---|
| Certificado digital FNMT | ✅ 17/07 | ❌ **pendiente** |
| Renovación DNI | ✅ 17/07 | ❌ **pendiente** |
| Beca comedor Madrid | ✅ 17/07 | ❌ **pendiente** |
| DNI primera vez | ✅ 17/07 | ❌ **pendiente** |
| Pasaporte | ✅ 17/07 | ❌ **pendiente** |
| Certificado de nacimiento | ✅ 17/07 | ❌ **pendiente** |
| Empadronamiento Madrid | ✅ 17/07 | ❌ **pendiente** |
| Cl@ve · Tarjeta sanitaria · Familia numerosa · Apoderamiento | ❌ | ❌ |

## Inferencias nuestras a confirmar (no son citas)

1. **Beca → certificado digital.** La fuente dice «uno de los sistemas de firma electrónica
   reconocidos por la Comunidad de Madrid» sin nombrarlos. Que el certificado FNMT valga es
   deducción nuestra.
2. **DNI primera vez → empadronamiento de Madrid.** La fuente dice «del Ayuntamiento donde la
   persona solicitante tenga su domicilio». Enlazamos al de Madrid porque es nuestro territorio de
   MVP; para otro municipio, la ficha no aplica.

## Hallazgos de contenido que merecen mirada humana

- **Volante ≠ certificado: la fuente no distingue.** La sede de Madrid **no ofrece "volante"** como
  trámite. Solo dice que el certificado vale «independientemente de que dicha Administración exija
  al ciudadano la presentación de un certificado o de un volante». Nuestro catálogo hace bien en
  tener una sola ficha.
- **El DNI NO exige consentimiento de ambos progenitores; el pasaporte SÍ.** El DNI habla en
  singular («quien tenga encomendada la patria potestad»); el pasaporte es explícito y en
  mayúsculas: «TODAS las personas que ostenten la patria potestad o tutela, (y no únicamente la
  guardia y custodia)». Es una diferencia real entre dos trámites de la misma comisaría, y de las
  que arruinan una mañana.
- **El certificado de nacimiento anterior a 1950 no tiene vía online.**
- **Gratuidad del certificado de nacimiento: la fuente NO lo dice.** Lo es en la práctica, pero no
  lo afirméis citando la fuente.
