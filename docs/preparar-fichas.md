# Cómo se prepara y se mantiene una ficha

> El cuello de botella real del proyecto. La IA acelera la extracción; **la
> verificación no la puede hacer una IA** — es lo que separa esto de publicar
> información falsa sobre trámites oficiales.
>
> **⚡ Este flujo está empaquetado como skill**, en `.claude/skills/preparar-ficha/`. En una
> sesión de Claude Code sobre este repo:
> - `/preparar-ficha añade el trámite X` → investiga la fuente, extrae con citas, escribe la
>   ficha, la vuelca a BD y la verifica en el navegador.
> - `/preparar-ficha revisa la ficha de X` → **mantenimiento**: contrasta las citas guardadas
>   contra la fuente actual y devuelve solo lo que ha cambiado.

## Mantener el catálogo al día

La ficha envejece sola. Tres cosas hacen el trabajo:

**1. El suelo ya está construido: no mentir sobre la frescura.** El sello degrada a los 90 días
(FR-020), "reportar error" (FR-018) recoge avisos, y —la señal más infravalorada— cada **"no" de
"¿salió a la primera?"** (FR-017) es un informe de error de contenido con contexto, escrito por
alguien que acaba de chocar con la realidad en una ventanilla.

**2. La deriva es estacional, no aleatoria.** No hace falta vigilancia continua, hace falta
calendario:

| Cuándo | Qué revisar | Por qué |
|---|---|---|
| **Enero** | Tasas (DNI, pasaporte) | La fuente lo dice: «se actualiza mediante la Ley de Presupuestos Generales del Estado» |
| **Primavera** | Plazos de convocatorias (becas) | Convocatoria anual, fechas nuevas cada año |
| **A los 90 días** | Lo que degrade el sello | FR-020 |
| **Al instante** | Reportes de error y los "no" del feedback | La señal más barata y con más contexto |

Los requisitos de fondo (qué documentos pide el DNI) casi nunca cambian. Priorizad por uso real,
no por ansiedad. Con 11 fichas y 90 días de sello: **una ficha cada 8 días**.

**3. Las citas son el ancla.** Aquí está el truco que hace viable el mantenimiento: cada requisito
guarda la frase literal de la fuente, así que comprobar si sigue vigente es un `grep`, no un
juicio. `/preparar-ficha revisa …` contrasta las citas y devuelve un diff:

```
✅ 7 de 8 requisitos: la fuente sigue diciendo lo mismo, literalmente.
⚠️ 1 cambio: dni-r6 (tasa) — ficha «fijada en 12 euros» / fuente «fijada en 13 euros»
```

Eso convierte el cotejo humano de *"releer 8 requisitos"* a *"mirar esta línea"*. Es la diferencia
entre que el mantenimiento sea viable o no lo sea.

⚠️ **Aviso de calendario:** las 11 fichas se prepararon el mismo día (17/07), así que **degradarán
todas a la vez** a mediados de octubre. Antes del directo de septiembre no afecta.

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

La ficha se escribe en `lib/data/tramites.ts` (tipo `TramiteContenido`) con:
- `nivel` (estatal / autonomico / local) y, si no es estatal, su `comunidad`.
- La cita literal dentro de `explicacion`, entre comillas, precedida de "Fuente:".
- **Nada de verificación aquí.** No estar en el registro (`verificaciones.ts`) ya hace que la app
  la muestre "⚠️ sin verificar", que es la verdad hasta que un humano la selle.

Luego: `DATABASE_URL=... npm run db:seed`

### 3. Verificar (humano, obligatorio)

Con la fuente oficial abierta al lado, **requisito a requisito**:

- [ ] ¿Cada dato aparece de verdad en la fuente? (la cita es la prueba)
- [ ] ¿Falta algo que la fuente pide y la ficha no recoge?
- [ ] ¿Hay algo que la ficha diga y la fuente no? → **fuera**
- [ ] ¿Los enlaces (fuente, cita previa) abren donde deben?
- [ ] ¿Las preguntas del wizard reflejan distinciones reales de la fuente?

Solo cuando todo cuadra, sellas:

```bash
npm run verificar dni-primera-vez
```

Eso escribe en **el registro** (`lib/data/verificaciones.ts`) y vuelca a la base de datos: la app
pasa al momento de "SIN VERIFICAR" en rojo a "VERIFICADA · DD·MM·AAAA" en violeta, y a los 90 días
degrada sola a "puede estar desactualizada" (FR-020). Luego **commitea el registro**: su historial
de git es la prueba de quién selló qué y cuándo.

Otros usos:

```bash
npm run verificar                          # lista el catálogo y qué está sellado
npm run verificar dni-primera-vez quitar   # retira el sello (te equivocaste, o cambió la fuente)
```

> ⚠️ **No lo hagas con SQL a mano.** Un `update tramites set verificada_en = now()` parece que
> funciona… y el siguiente `npm run db:seed` se lo lleva por delante en silencio, porque el seed
> borra y reinserta desde el repo. Lo comprobamos: verificar en BD y reseedear devolvía la ficha a
> "sin verificar". Por eso la verificación vive en el registro y no en la base de datos.

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

## Las fuentes que dan guerra (aviso de arquitectura para el motor de R2)

Curar las 11 dejó un mapa de minas. Si el motor automático de R2 se construye sin esto, fracasará:

- **`madrid.es` bloquea el acceso automatizado**: 403 en todo el dominio, a `curl` y a fetch. Solo
  se lee con navegador real, y sus datos viven en acordeones que no salen en el texto plano.
- **`administracion.gob.es` devuelve HTTP 200 con páginas de error.** Dos URLs plausibles del REA
  responden 200 y sirven un `<title>Error - Punto de Acceso General</title>`. Un comprobador de
  código de estado te dice que todo va bien mientras extraes un menú de navegación. Hay que mirar
  el `<title>`.
- **`dnielectronico.es` tiene trampas de URL**: `REF_1084` es la página del **pasaporte**, no del
  DNI, aunque los buscadores la devuelvan como "requisitos del DNI". La del DNI es `REF_410`
  (primera inscripción) y `REF_420` (renovación). Además sirve `iso-8859-1`: sin `iconv`, los
  acentos salen corruptos.
- **`sede.comunidad.madrid` esconde la documentación en acordeones de pestañas.** Al desetiquetar,
  los 10 títulos salen apelotonados y separados de sus contenidos: emparejarlos "a ojo" produce
  atribuciones falsas. Hay que mapearlos por posición en el DOM.
- **`sede.mjusticia.gob.es` es una fachada**: los requisitos reales viven en `www.mjusticia.gob.es`,
  otro dominio y otro CMS.
- **Los `&nbsp;` dentro de las frases rompen los greps literales.** Y `grep` con `.` no cruza saltos
  de línea: para buscar contexto hay que aplanar el HTML a una línea antes.

**Conclusión honesta para la presentación:** el motor automático de fichas es más difícil de lo que
parecía en julio. No porque la IA no sepa leer, sino porque las sedes españolas están construidas
para que no las lea nadie automáticamente. Es un argumento a favor del diseño que elegimos —
extracción asistida + verificación humana — y en contra de prometer un scraper mágico.

## Estado del catálogo: 15 fichas (11 estatales+Madrid, 4 Aragón) · 0 verificadas ❌

Las once están extraídas con citas y en producción marcadas "⚠️ Generada por IA — sin verificar".
**Ninguna está verificada: esa es toda la deuda del proyecto ahora mismo.**

| Trámite | Extraída | Verificada |
|---|---|---|
| Renovación DNI · DNI primera vez · Pasaporte | ✅ | ❌ |
| Certificado de nacimiento · Empadronamiento Madrid | ✅ | ❌ |
| Certificado digital FNMT · Cl@ve · Apoderamiento | ✅ | ❌ |
| Tarjeta sanitaria · Familia numerosa · Beca comedor | ✅ | ❌ |

## Inferencias nuestras a confirmar (no son citas) ⚠️

Esto es lo primero que hay que mirar en la verificación: son enlaces del producto que **la fuente
no respalda literalmente**.

1. **Beca → certificado digital.** La fuente dice «uno de los sistemas de firma electrónica
   reconocidos por la Comunidad de Madrid» sin nombrarlos. Igual en tarjeta sanitaria y familia
   numerosa.
2. **DNI primera vez → empadronamiento de Madrid.** La fuente dice «del Ayuntamiento donde la
   persona solicitante tenga su domicilio». Enlazamos al de Madrid porque es nuestro territorio de
   MVP; para otro municipio, la ficha no aplica.
3. **Apoderamiento → certificado digital FNMT.** La fuente exige «DNI electrónico o certificado
   digital reconocido en vigor (requisito imprescindible)» — que el de la FNMT sirva es deducción.
4. **Cl@ve (vía certificado) → certificado FNMT.** Mismo caso.
5. **Cl@ve (vía vídeo) → renovación DNI.** La fuente exige «un DNI en vigor»; enlazamos a la ficha
   de renovación como el camino para conseguirlo.
6. **Beca comedor Aragón: identificación digital sin especificar.** La fuente dice que la solicitud
   va «a través de la aplicación informática de gestión de becas» pero NO detalla qué identificación
   pide (certificado, Cl@ve, usuario). Por eso la ficha NO encadena a un certificado: sería inventar.
   Confírmalo en la app o en la orden.
7. **Beca comedor Aragón: la lista de documentos no está en la ficha.** La fuente la remite «al
   artículo undécimo de la orden de convocatoria». La ficha lo dice honestamente y no inventa la
   lista. Al verificar, abrir la orden en el BOA.

## Hallazgos de contenido que merecen mirada humana

**Aragón (segundo territorio, 17/07):** las 4 fichas (tarjeta sanitaria, beca, familia numerosa,
empadronamiento Zaragoza) confirman que la geografía cambia el contenido, no solo el nombre: en
Aragón la tarjeta sanitaria es **solo presencial** (Madrid tenía online) y el alta del padrón de
Zaragoza es **sin cita previa** (Madrid la exigía). Dato vivo a vigilar en familia numerosa: la
**Orden BSF/457/2026** prorrogó 6 meses la vigencia de los títulos de Huesca y Zaragoza — relevante
para quien renueve. Las sedes de Aragón (`aragon.es`) y Zaragoza (`zaragoza.es`) responden 200 sin
403; `aragon.es` usa acordeones Liferay con mucho JSON de config que da falsos positivos en grep
(anclar con la frase, no con números sueltos).


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
- **Cl@ve no se puede apoderar — y lo dice la fuente.** «no cabe instar registros en CL@VE mediante
  representación por parte de un tercero o apoderado». Es el único veredicto del catálogo que sale
  literalmente de la fuente, y corta en seco la cadena apoderamiento → Cl@ve. Justo la pared contra
  la que choca Marta con su madre.
- **El REA solo admite certificado digital o DNIe, no Cl@ve.** «(requisito imprescindible)», y
  Cl@ve no aparece por ningún lado en esa página (verificado con grep sobre el HTML aplanado).
  Mucha gente asume que Cl@ve sirve; esta fuente no lo respalda. No lo afirméis en ninguna dirección
  sin otra fuente.
- **"Familia numerosa hasta los 26 años" NO está en la sede.** Es el dato más repetido de internet
  sobre este trámite, y la fuente oficial no lo dice: procede de fedma.es, que no es oficial. Si lo
  queréis mostrar, la cita tiene que salir del BOCM nº 87 de 13/04/2023. **Este es el ejemplo
  perfecto de por qué no se cura de memoria: un modelo lo habría escrito sin dudar.**
- **La tarjeta sanitaria NO pide el documento de afiliación a la Seguridad Social.** Exige *tener*
  el derecho reconocido por el INSS, que es otra cosa. Verificado con grep: cero coincidencias de
  "afiliaci" en la fuente.
- **Ni "gratuito" ni "gratuita" aparecen en las fichas de Madrid.** Lo que dicen es «No requiere el
  pago de tasas». Y en familia numerosa hay una contradicción interna de la propia fuente: el badge
  dice que no hay tasas, pero la pestaña de RMI habla de «solicitar exención de tasas». Sin resolver.
- **Familia numerosa da DNI y pasaporte gratis** — eso sí está citado en la fuente del DNI.
