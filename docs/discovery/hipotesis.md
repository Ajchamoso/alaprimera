# Hipótesis de épica: Asistente personal de trámites

> Documento de validación para el Viberano (233 Academy).
> Fecha: 16/07/2026 · Ventana hasta el primer directo de septiembre: ~7 semanas.
> **Esto es una apuesta, no una promesa.** Está escrito para poder ser invalidado.
>
> **Decisión del equipo (16/07/2026): se construye ya, sin experimento previo como puerta.**
> La hipótesis sigue viva y sigue siendo falsable — lo que cambia es el instrumento de medida:
> del duelo previo al **producto real** (la métrica "¿salió a la primera?" y la beta con la
> comunidad). Los experimentos de abajo quedan como ejercicio opcional en paralelo.

---

## Paso 1 — Contexto (evidencia vs. suposición)

### El problema
Hacer un trámite con la administración española obliga a reconstruir a mano, entre varias
webs, qué necesitas *tú* en *tu* caso. La información existe; la claridad no.

### Alternativas actuales (esto sí es evidencia, verificada 16/07/2026)
| Alternativa | Qué cubre | Qué NO cubre |
|---|---|---|
| [administracion.gob.es](https://administracion.gob.es/) / [Guía de Trámites de Interior](https://www.interior.gob.es/opencms/es/servicios-al-ciudadano/tramites-y-gestiones/guia-de-tramites/) | Fuente oficial, exhaustiva | UX hostil. Es *la causa* del problema |
| [tramites.pro](https://tramites.pro/) | **170 guías en 9 categorías**, gratis, sin login | Estático, genérico, sin personalizar, sin estado |
| MAIA (Ayto. Madrid), AINA (Generalitat), [Agento](https://agentochat.es/), 1MillionBot (200+ ayuntamientos) | Chatbots con IA | **Siloados por organismo**. Se venden a la administración, no al ciudadano |
| Gestoría | Lo resuelve de verdad | Cuesta dinero |
| No hacer nada / preguntar a un familiar | Gratis | El apaño actual — y probablemente el competidor real |

**El hueco:** nadie hace *lado del ciudadano · cruzando organismos · personalizado a tu caso · con estado*.

### Persona — la decisión más importante del documento
Los candidatos iniciales eran "mayores, familias e inmigrantes". Son **tres personas distintas**
y no se pueden servir a la vez. Elegimos una:

> **El gestor familiar:** adulto de 30-55 años, digitalmente competente, que hace trámites
> **para otros** — el DNI de su hijo menor, el certificado digital de su madre.

Por qué esta y no las otras:
- **Coincide con el origen de la idea** (renovar el DNI de un menor = un padre haciéndolo por su hijo).
- **Es alcanzable para testear este verano**: están en nuestro entorno y en la comunidad.
- Los **mayores** son beneficiarios, pero rara vez el usuario que adopta una web nueva: llegan *a través* del gestor familiar.
- **Extranjería** tiene el dolor más agudo, pero es el terreno donde un error hace más daño. Descartada para el MVP por riesgo, no por falta de valor.

### Job-to-be-done
> "Quiero terminar el trámite **a la primera**, sin que me frene a mitad un requisito que no sabía
> que necesitaba."

**Ojo — el JTBD es agnóstico del canal.** La primera versión de este documento decía "llegar a la
cita", y eso asumía que todo trámite acaba en una ventanilla. Falso: muchos son 100% online. Y el
fallo online es **peor**, porque en ventanilla hay un humano que te dice qué falta, mientras que
online se te caduca la sesión, Autofirma no arranca, el navegador no reconoce el certificado o el
PDF pesa de más — y nadie te explica nada.

Los dos modos de fracaso que atacamos:
- **Presencial**: vuelves a casa por un papel → viaje en balde.
- **Online**: te quedas atascado a mitad del formulario sin saber por qué → tarde perdida y trámite sin hacer.

### Suposiciones sin datos (a validar, no a asumir)
- `[SUPOSICIÓN]` El dolor real es la **personalización**, y no "no sé ni qué trámite necesito" o "no sé cuál es la web oficial de verdad".
- `[SUPOSICIÓN]` Una checklist personalizada aporta suficiente valor **frente a una guía genérica que ya existe gratis**.
- `[SUPOSICIÓN]` El trámite se hace lo bastante a menudo como para volver a la app. Podría ser un uso de una vez cada varios años → sin retención.
- `[SUPOSICIÓN]` La IA puede extraer requisitos de sedes electrónicas con fiabilidad suficiente.

---

## Paso 2 — Hipótesis si/entonces

> **Si** tras 3-4 preguntas sobre su caso concreto generamos una checklist personalizada de
> **todo lo que necesita** —documentos, requisitos técnicos y pasos previos, según lo haga online
> o en ventanilla—, guardada y marcable, con enlace a la fuente oficial y fecha de verificación
>
> **para** adultos que gestionan trámites para su familia (hijos menores, padres mayores)
>
> **Entonces** pasarán de *horas* a *minutos* el tiempo hasta saber exactamente qué necesitan, y
> completarán el trámite a la primera — sin viaje en balde ni atasco a mitad del formulario.

El "Entonces" es el resultado (tiempo hasta la claridad, trámite completado a la primera), **no** la
salida ("tendrán una checklist").

---

## Las tres apuestas que hay debajo

La hipótesis no es una sola apuesta, son tres — y **caen en cascada**:

| # | Apuesta | Si cae… |
|---|---|---|
| **1. Valor** ⚠️ | La checklist personalizada vence a la guía genérica gratuita | **Cae el producto entero.** Es la más arriesgada |
| **2. Persona** | El usuario es el gestor familiar, no el mayor | Cambia el producto, no lo mata |
| **3. Técnica** | El motor extrae de sedes oficiales con fiabilidad ≥70% | Cae la visión del motor; sobrevive el MVP curado a mano |

**La apuesta 1 es la que hay que atacar primero.** Todo lo demás es secundario si la personalización
no gana a lo que ya existe gratis.

---

## Paso 3 — Experimentos (pequeños actos de descubrimiento)

Tres experimentos, ninguno requiere la app. **Ya no son puerta de entrada** (la construcción
arranca en paralelo): son la forma más barata de detectar un error de enfoque mientras se
construye. El más recomendable de mantener es el C, que de-riesga el motor con una sola tarde.

### Experimento A — El duelo 🥊 *(ataca la apuesta 1 — el falsador)*
**Diseñado para demostrarnos que estamos equivocados.**

Cogemos **10 gestores familiares** con un trámite real pendiente. A cada uno le damos, en orden
aleatorio, dos cosas:
- **(A)** La guía genérica que ya existe de tramites.pro para su trámite.
- **(B)** Una checklist personalizada para su caso concreto, **escrita a mano por nosotros** (test concierge — cero código).

Preguntamos: *¿cuál te resuelve el problema? ¿Cuál usarías el día de la cita?*

> Si la mayoría dice "con la genérica me vale", **la idea está muerta** y nos hemos ahorrado el verano.
> Este es el experimento que importa.

**Coste:** unas horas de WhatsApp. **Cero build.**

### Experimento B — Mago de Oz por WhatsApp *(apuestas 1 y 2)*
Para 5 personas del experimento A, hacemos de asistente **a mano**: les preguntamos sus 3-4
preguntas por WhatsApp, les devolvemos su checklist, y **les seguimos hasta después de la gestión**.

Medimos lo único que de verdad importa: **¿llegaron con todo a la primera?**
Y de paso descubrimos qué preguntas hacen falta *de verdad* para personalizar — que ahora mismo
son una invención nuestra.

### Experimento C — Prueba del motor 🔧 *(apuesta 3 — la visión de la compañera)*
Cogemos **10 URLs reales** de sedes electrónicas (DNI, certificado digital CAM, empadronamiento…),
se las pasamos a la IA a pelo y comparamos su extracción contra la fuente, a mano.

**Mide:** ¿cuántas de 10 extrae correctamente y sin inventarse nada?
Esto convierte "el scraping es frágil" de miedo difuso en **un número**, en una tarde y sin construir nada.

---

## Paso 4 — Medidas de validación

Sabremos que la apuesta es válida si, **durante la beta (agosto-septiembre)**, observamos:

| Medida | Umbral | Apuesta |
|---|---|---|
| Gestores que eligen la checklist personalizada sobre la guía genérica | **≥ 7 de 10** (cuantitativo) | 1 |
| Personas que, tras el Mago de Oz, **completaron el trámite a la primera** (sin volver a casa ni atascarse a mitad del formulario) | **≥ 4 de 5** (resultado real) | 1 |
| Personas que dicen que se lo pasarían a un familiar o amigo | **≥ 8 de 10** (cualitativo) | 1, 2 |
| Trámites que la IA extrae correctamente de la fuente oficial | **≥ 7 de 10**, con **0 inventados** | 3 |

**Umbral rojo (ahora señal de pivote, no de parada):** si al probar el producto la mayoría dice
que la guía genérica gratuita ya le sirve, el diferencial elegido no funciona y toca pivotar el
enfoque (ver pivotes abajo) — la app construida sobrevive, cambia dónde pone el énfasis.

**Sobre el "0 inventados":** en trámites oficiales una alucinación no es un bug, es daño real a una
persona — y roza el "contenido engañoso" que el reto prohíbe. Un solo requisito inventado en 10
invalida la apuesta técnica.

---

## Paso 5 — Decisión y pivotes

- [x] **Se construye** (decisión del equipo, 16/07/2026). El mapa de historias y la spec ya están
  hechos; la hipótesis se contrasta en producción con "¿salió a la primera?" y la beta con la
  comunidad. Los pivotes de abajo siguen preparados por si los datos del producto la tumban.

### Pivotes preparados (por si acaso)
- **Si cae la apuesta 1** (la genérica ya les vale) → el dolor está antes de lo que creemos. Pivotar a
  **desambiguación**: "no sé qué trámite necesito ni cuál es la web oficial de verdad" → un buscador
  que te lleva al trámite correcto. Es un problema distinto y puede que el bueno.
- **Si cae la apuesta 3** (el motor alucina) → **MVP con 6-8 trámites curados a mano**. Se pierde la
  visión del motor, sobrevive el producto. La app sigue en pie.
- **Si cae la apuesta 2** (no es el gestor familiar) → estrechar a **extranjería**, donde el dolor es
  máximo — asumiendo el mayor riesgo de daño con más verificación humana.

---

## Chequeo de antipatrones

| Antipatrón | ¿Caemos? |
|---|---|
| La hipótesis que es una feature | No — el "Entonces" es tiempo hasta la claridad y viaje evitado, no "tendrán checklist" |
| Saltarse los experimentos | No — los tres se hacen sin construir la app |
| La medida de niebla | No — 7/10, 4/5, 0 inventados |
| El plazo eterno | Parcial — la medición se hace en la beta de agosto-septiembre, con la entrega como límite duro |
| La épica que ya era un compromiso | ⚠️ **Caemos, y lo sabemos.** Desde el 16/07 es un compromiso de construcción; la hipótesis se testea en producción, no antes. Antídoto restante: las medidas del Paso 4 siguen escritas y son falsables |
| Enamorarse de la hipótesis | ⚠️ Riesgo aumentado al construir primero. Antídoto: "¿salió a la primera?" registra los "no" sin piedad |

---

## Nota honesta sobre el reto

El Viberano no exige validar nada: exige una URL pública que funcione. El equipo eligió ir directo
a construir, y este documento registra ese trade-off en vez de esconderlo.

Lo que se gana: siete semanas enteras de construcción y una app más pulida en septiembre.
Lo que se asume: si la apuesta de valor está mal, se descubrirá con el producto ya hecho — por eso
"¿salió a la primera?" está en el MVP y los pivotes quedan preparados.

Ante el jurado, la historia sigue siendo de discovery: "esto creíamos, así lo convertimos en
hipótesis falsable, y así la está midiendo el propio producto en producción".
