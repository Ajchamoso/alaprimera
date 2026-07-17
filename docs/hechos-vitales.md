# Hoja de ruta: el catálogo por hechos vitales

> **Qué es esto y qué NO es.** Es el *backlog* del catálogo y el diseño de la futura navegación
> por hechos vitales — la lista de qué construir y cómo agruparlo. **No son fichas.** Nombrar un
> trámite que existe es de bajo riesgo; publicar sus requisitos sin verificar es la línea roja del
> proyecto. Nada de aquí llega a un usuario hasta pasar por `/preparar-ficha` y el cotejo humano.
>
> Estado: `✓` ficha ya hecha (de las 11 actuales) · `·` en el backlog, sin ficha.
> Ámbito: Estado + **Comunidad de Madrid** para lo autonómico (como el MVP). Lo autonómico se
> nombra en genérico; su ficha será específica de Madrid.
> **Extranjería queda fuera** por decisión de la spec (máximo dolor, máximo riesgo de daño).

## Por qué hechos vitales y no categorías temáticas

Lo decidimos con datos, no por gusto ([nota completa en el commit de los destacados]):

- **Es la cabeza de Marta.** Ella no piensa "esto es de Hacienda", piensa "mi hijo empieza el cole".
- **Es lo que ya usa el portal oficial español** (`administracion.gob.es` → "Hechos vitales"), y lo
  enmarca en primera persona: *"Me saco el carnet de conducir"*.
- **Es la práctica puntera**: Nueva Zelanda (SmartStart), Singapur (*Moments of Life*), Dinamarca.
- **Nuestro grafo ya lo modela.** Un hecho vital es una cadena de trámites encadenados, y las
  cadenas ya están en la base de datos con sus caducidades. Ordenar por organismo, en cambio,
  enterraría nuestro diferencial —cruzar organismos—: media taxonomía de tramites.pro (Hacienda,
  Seguridad Social, Tráfico) es el organigrama del Estado, no un hecho vital.

## Los cimientos (transversales a todo)

No son un hecho vital: son los documentos base de los que cuelga casi todo lo demás. Viven aparte
para no repetirlos en cada evento; los hechos vitales los referencian por la cadena ⛓️.

- ✓ Renovación del DNI
- ✓ DNI por primera vez
- ✓ Certificado digital (FNMT)
- ✓ Cl@ve
- ✓ Empadronamiento *(Madrid)*
- ✓ Apoderamiento (actuar en nombre de otra persona)
- · Certificado de estar al corriente / certificado tributario *(base para muchas ayudas)*

---

## 👶 Nace un hijo

El más rico en cadenas, y el corazón de la persona que elegimos (Marta).

- ✓ Certificado de nacimiento (Registro Civil)
- · Inscripción del nacimiento en el Registro Civil
- ✓ DNI por primera vez *(← certificado de nacimiento, ← empadronamiento)*
- ✓ Tarjeta sanitaria del bebé *(Madrid; ← empadronamiento)*
- · Alta del recién nacido como beneficiario en la Seguridad Social
- · Prestación por nacimiento y cuidado de menor (permiso de maternidad/paternidad) — SS
- · Ayuda / deducción por hijo a cargo *(estatal y, aparte, la autonómica de Madrid)*
- · Empadronamiento del bebé *(alta por nacimiento, plazo: primer año)*

## 🎒 Empieza el cole

- · Admisión y matrícula escolar *(Madrid)*
- ✓ Beca de comedor *(Madrid — ojo: plazo estacional, primavera)*
- · Beca de libros / material *(Madrid)*
- · Beca general del Ministerio (a partir de ciertas etapas)
- ✓ Título de familia numerosa *(Madrid; da DNI y pasaporte gratis)*

## 🏠 Me mudo de casa

Un hecho vital que es casi todo "actualizar mi dirección en N sitios" — justo donde una checklist
que cruza organismos brilla.

- ✓ Cambio de domicilio en el padrón *(Madrid; es el mismo trámite de empadronamiento)*
- · Cambio de domicilio en el DNI *(al renovar, o específico)*
- · Cambio de domicilio en la DGT (permiso de conducir y vehículo)
- · Cambio de domicilio en Hacienda (modelo 030)
- · Cambio de centro de salud / médico asignado *(Madrid)*

## 🩺 Cuido de un mayor

El otro lado de Marta: gestiona los papeles de su madre de 74. Aquí es donde el veredicto
"¿puedo yo por ella?" y el apoderamiento importan de verdad.

- ✓ Tarjeta sanitaria *(Madrid)*
- ✓ Apoderamiento (para actuar por ella ante la administración)
- · Reconocimiento del grado de discapacidad *(Madrid)*
- · Reconocimiento de la situación de dependencia *(Madrid)*
- · Tarjeta sanitaria europea (TSE)
- · Cita previa en el centro de salud *(Madrid)*

## 🧑‍💼 Empiezo a trabajar (o lo dejo)

- · Número de afiliación a la Seguridad Social
- · Informe de vida laboral
- · Prestación / subsidio por desempleo (SEPE)
- · Alta como autónomo (RETA + Hacienda, modelo 036/037)
- · Certificado de empresa

## 🚗 Conducir y el coche

- · Carnet de conducir (obtención)
- · Canje o renovación del permiso de conducir
- · Transferencia de un vehículo (compraventa)
- · Matriculación
- · Duplicado del permiso por pérdida o robo

## 🧾 La renta y Hacienda

- · Declaración de la renta (IRPF)
- · Certificado tributario / de estar al corriente
- · Número de identificación fiscal (NIF)

## ⚱️ Fallece un familiar

Denso, sensible y con cadenas largas. Candidato fuerte, pero pide especial cuidado de tono.

- · Certificado de defunción (Registro Civil)
- · Certificado de últimas voluntades
- · Certificado de contratos de seguros de cobertura de fallecimiento
- · Baja del fallecido (SS, sanidad, padrón)
- · Pensión de viudedad / orfandad (SS)
- · Impuesto de sucesiones *(Madrid)*

## 💍 Me caso o registro pareja de hecho

- · Expediente e inscripción de matrimonio (Registro Civil)
- · Registro de pareja de hecho *(Madrid)*

## 🤝 Pido una ayuda

Transversal; muchas cuelgan de "estar al corriente" y del certificado digital.

- · Ingreso Mínimo Vital (IMV)
- · Renta Mínima de Inserción *(Madrid)*
- · Bono social eléctrico / térmico
- ✓ Beca de comedor *(ya en "empieza el cole")*

---

## Recuento

- **11 fichas hechas**, repartidas: los 6 cimientos + tarjeta sanitaria, familia numerosa, beca,
  certificado y DNI de nacimiento tocan sobre todo "nace un hijo", "empieza el cole" y "cuido de un
  mayor". No es casualidad: curamos primero la familia coherente que da cadenas.
- **~45 en el backlog**, que con las 11 dan un catálogo de ~55 trámites organizables en **10 hechos
  vitales** — masa más que suficiente para que la navegación por hechos vitales tenga sentido.

## Cómo se decide qué construir después

No por esta lista de arriba abajo, sino por dos criterios que ya tenemos:

1. **Completar cadenas antes que abrir eventos.** Un hecho vital con la mitad de sus trámites sin
   ficha frustra más que ayuda. Mejor "nace un hijo" entero que diez eventos a medias.
2. **Lo que pida el uso real.** Cuando haya buscador con tráfico, las **búsquedas sin resultado**
   (ya las registramos, FR-003) dicen exactamente qué trámite falta, sin que lo adivinemos.

## Cuándo esto pasa de documento a producto

Hoy es una hoja de ruta en markdown, a propósito: la navegación por hechos vitales no existe aún y
forzar un modelo de datos ahora sería inventar estructura para algo que todavía se está diseñando
(YAGNI). Cuando el catálogo se acerque a ~30 fichas y toque construir la navegación, el subconjunto
elegido se lleva a datos —un hecho vital tiene nombre, icono y una lista de slugs— y esta lista se
queda como el backlog de lo que aún falta.

## Aviso honesto

Los nombres de trámite de arriba salen de conocimiento general, no de las fuentes oficiales. Sirven
como backlog —"esto existe, hay que hacerle ficha"—, no como contenido. Alguno puede tener el nombre
o el alcance ligeramente desviado, y varios varían por comunidad autónoma. **La verdad de cada uno
la fija su ficha**, cuando pase por `/preparar-ficha`. Hasta entonces, esto es la lista de la compra,
no la despensa.
