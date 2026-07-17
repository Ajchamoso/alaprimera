# Especificación de Feature: A la Primera (MVP)

**Rama**: `001-a-la-primera`
**Creada**: 2026-07-16
**Estado**: **Spec viva.** Cerrada el 16/07 (5 preguntas resueltas); evoluciona con la construcción
— añadido FR-027 (plazos) el 17/07 al descubrir el modo de fallo curando las becas. Esta copia, en
el repo de construcción, es la canónica; la del repo `Viberano` es el snapshot congelado de la
propuesta.
**Input**: Descripción del usuario: "Asistente personal de trámites con la administración española: TU trámite, TU checklist, TU progreso. MVP funcionalmente completo con volumen reducido (10-12 trámites), construido solo con prompts para el reto Viberano."

> **Estado de construcción (17/07):** Fases 0-3 completas y desplegadas en
> https://alaprimera.vercel.app. Historias 1-8 implementadas y verificadas en navegador; la 9 (motor
> de curación en la app) se reenfocó a extracción asistida sin API key → R2. Catálogo de 11 fichas
> extraídas con cita literal, **todas pendientes de verificación humana**. Detalle en `tasks.md`.
>
> Esta spec sustituye a la anterior (SpecLens, idea descartada). Nace de la cadena
> hipótesis → mapa de historias (v3), que viven en el repo `Viberano`. La decisión de construir está
> tomada (16/07): la hipótesis se contrasta con el producto real, con la métrica "¿salió a la
> primera?" como señal principal.
>
> **Regla de oro de esta spec:** describe el QUÉ y el PORQUÉ. El CÓMO (stack, tablas, librerías)
> se decide en el plan, no aquí.
>
> **Nota de alcance:** es la spec del MVP completo porque el walking skeleton solo tiene sentido
> entero. La prioridad interna (P1/P2/P3) marca el **orden de construcción en agosto**: P1 es el
> esqueleto sin el cual no hay demo, P2 completa el MVP, P3 es el motor (interno). Todo está en
> alcance; nada de R2/futuro lo está.

---

## Escenarios de usuario y pruebas *(obligatorio)*

**Persona de referencia en todos los escenarios:** Marta, 42 años, gestiona los trámites de su
familia: el DNI de su hijo de 12 y los papeles de su madre de 74.

### Historia de Usuario 1 - Encontrar el trámite (Prioridad: P1)

Como gestora familiar, quiero encontrar el trámite que necesito escribiéndolo con mis palabras
("lo del carnet de mi hijo"), para no tener que saber su nombre oficial ni qué organismo lo gestiona.

**Por qué esta prioridad**: es la puerta de entrada; sin ella no arranca ningún viaje.

**Test independiente**: se prueba buscando con frases coloquiales y comprobando que aparece el
trámite correcto del catálogo, sin necesidad de wizard ni checklist.

**Escenarios de aceptación**:
1. **Dado** que el catálogo contiene "Renovación de DNI de un menor", **Cuando** Marta busca "carnet de mi hijo", **Entonces** ese trámite aparece entre los resultados con una descripción en lenguaje llano.
2. **Dado** que Marta no busca nada todavía, **Cuando** entra en la app, **Entonces** ve el catálogo completo navegable por categorías con el nombre coloquial y el oficial de cada trámite.
3. **Dado** que el trámite buscado no está en el catálogo, **Cuando** Marta lo busca, **Entonces** el sistema lo dice honestamente ("aún no lo tenemos"), ofrece dejar constancia de la petición y **nunca** genera una respuesta inventada.

### Historia de Usuario 2 - Personalizar mi caso (Prioridad: P1)

Como gestora familiar, quiero responder unas pocas preguntas sobre mi caso concreto, para que la
lista de requisitos sea la mía y no la genérica "para todos" que ya dan los portales.

**Por qué esta prioridad**: es el diferencial del producto frente a las guías estáticas. Sin
personalización, esto es tramites.pro con menos contenido.

**Test independiente**: se prueba completando el wizard de un trámite con distintas combinaciones
de respuestas y comprobando que la checklist resultante cambia en consecuencia.

**Escenarios de aceptación**:
1. **Dado** que Marta eligió "Renovación de DNI", **Cuando** inicia la personalización, **Entonces** la primera pregunta es siempre "¿es para ti o para otra persona?" y el total de preguntas no pasa de cuatro.
2. **Dado** que respondió "para mi hijo menor de 14 años", **Cuando** termina el wizard, **Entonces** la checklist incluye los requisitos propios de ese caso (p. ej. presencia del menor, documentación del representante) y excluye los que no aplican.
3. **Dado** que el trámite elegido exige actuación personal por la vía online (p. ej. certificado digital de su madre), **Cuando** Marta indica que quiere hacerlo ella en nombre de su madre, **Entonces** el sistema le comunica con claridad que esa vía no está disponible para su caso y le muestra las alternativas reales (acompañarla presencialmente, representación, hacerlo la madre con apoyo).
4. **Dado** que Marta abandona el wizard a medias, **Cuando** vuelve al trámite, **Entonces** puede retomarlo sin repetir las respuestas ya dadas.

### Historia de Usuario 3 - Ver mi checklist completa, con sus trámites escondidos (Prioridad: P1)

Como gestora familiar, quiero ver en una sola lista todo lo que me puede frenar — papeles, archivos,
requisitos técnicos y trámites previos — para descubrirlo ahora y no a mitad del proceso.

**Por qué esta prioridad**: es la promesa central del producto ("terminar a la primera") y contiene
el elemento más diferencial: la cadena de trámites.

**Test independiente**: se prueba generando la checklist de un trámite con prerrequisitos y
comprobando que aparecen los cuatro tipos de requisito y la cadena completa.

**Escenarios de aceptación**:
1. **Dado** que completó el wizard, **Cuando** ve su checklist, **Entonces** cada requisito está etiquetado con su tipo — 📄 documento físico, 💻 documento digital, ⚙️ requisito técnico, ⛓️ trámite previo — y con una explicación en lenguaje llano.
2. **Dado** que la solicitud de beca requiere certificado digital y este a su vez DNI en vigor, **Cuando** Marta ve la checklist de la beca, **Entonces** ve la cadena completa de trámites previos **antes** de los requisitos propios del trámite.
3. **Dado** que un prerrequisito es a su vez un trámite del catálogo, **Cuando** Marta lo abre, **Entonces** navega a la checklist de ese trámite y conserva un camino visible de vuelta al trámite original.
4. **Dado** que está viendo cualquier ficha, **Cuando** busca la fuente, **Entonces** el enlace a la página oficial es visible sin buscarlo ("la ficha guía, la fuente manda").

### Historia de Usuario 4 - Guardar mi progreso a lo largo de días (Prioridad: P1)

Como gestora familiar que reúne papeles en varias tardes, quiero marcar lo que ya tengo y que la app
lo recuerde sola, para retomar donde lo dejé sin volver a pensar.

**Por qué esta prioridad**: es lo que hace de esto una app y no una guía. Un PDF no recuerda dónde
lo dejaste.

**Test independiente**: se prueba marcando requisitos, cerrando la sesión del navegador y
comprobando que al volver el estado sigue intacto.

**Escenarios de aceptación**:
1. **Dado** que Marta marcó 3 de 7 requisitos, **Cuando** vuelve al día siguiente, **Entonces** los 3 siguen marcados y ve cuántos le faltan.
2. **Dado** que marcó un requisito por error, **Cuando** lo desmarca, **Entonces** el estado se actualiza sin pasos adicionales (el guardado es automático, sin botón "guardar").
3. **Dado** que Marta se identificó con su email, **Cuando** abre la app en otro dispositivo e introduce el mismo email, **Entonces** ve sus checklists con el progreso intacto.
4. **Dado** que no se ha identificado aún, **Cuando** marca requisitos, **Entonces** el progreso se guarda en su navegador sin pedirle nada, y la app le ofrece (sin obligar) identificarse para no perderlo y verlo en otros dispositivos.
5. **Dado** que tiene progreso anónimo en el navegador, **Cuando** se identifica con su email, **Entonces** ese progreso se conserva íntegro en su cuenta (nada se pierde en la transición).

### Historia de Usuario 5 - Hacer la gestión por mi canal (Prioridad: P1)

Como gestora familiar, quiero elegir si haré el trámite online o en ventanilla y recibir la
preparación específica de ese canal, para no quedarme atascada a mitad de formulario ni volver a
casa por un papel.

**Por qué esta prioridad**: cierra el viaje (walking skeleton). Sin este paso, la checklist se queda
en lista de la compra.

**Test independiente**: se prueba eligiendo cada canal en un trámite que admita ambos y comprobando
que la preparación mostrada es distinta y correcta.

**Escenarios de aceptación**:
1. **Dado** que el trámite admite ambos canales, **Cuando** Marta llega al final de su checklist, **Entonces** puede elegir entre "hacerlo online" y "hacerlo presencial", viendo qué exige cada vía antes de elegir.
2. **Dado** que eligió online, **Cuando** ve la preparación, **Entonces** recibe la lista "antes de empezar" (certificado instalado, programa de firma, navegador compatible, archivos en el formato exigido) y el enlace directo a la sede oficial.
3. **Dado** que eligió presencial, **Cuando** ve la preparación, **Entonces** recibe el resumen "qué llevar" y el enlace a la cita previa oficial.
4. **Dado** que el resumen "qué llevar" está en pantalla, **Cuando** lo imprime, **Entonces** la versión impresa es legible para una persona mayor (letra amplia, sin depender del color) y contiene el trámite, los requisitos y la fuente oficial con fecha de verificación.
5. **Dado** que le faltan requisitos por marcar, **Cuando** intenta pasar a "hacer la gestión", **Entonces** el sistema le avisa de qué le falta exactamente — pero no le impide continuar.
6. **Dado** que el trámite solo admite un canal, **Cuando** llega a este paso, **Entonces** no se le ofrece una elección falsa: ve directamente la preparación del único canal posible.

### Historia de Usuario 6 - Confiar en lo que leo (Prioridad: P2)

Como gestora familiar escarmentada de información desactualizada, quiero saber cuándo se verificó
cada ficha y contra qué fuente, para decidir cuánto fiarme.

**Por qué esta prioridad**: la confianza es condición de uso, pero el mecanismo del sello se
construye sobre fichas que ya existen (P1). Segunda ola de agosto.

**Test independiente**: se prueba con fichas de fechas de verificación distintas, comprobando el
estado del sello en cada una.

**Escenarios de aceptación**:
1. **Dado** que una ficha fue verificada por una persona, **Cuando** Marta la ve, **Entonces** muestra "✅ Verificada el DD/MM/AAAA" junto al enlace a la fuente.
2. **Dado** que han pasado más de 90 días desde esa verificación, **Cuando** cualquier usuario ve la ficha, **Entonces** el sello ha pasado automáticamente a "⚠️ Puede estar desactualizada — confirma en la fuente oficial".
3. **Dado** que Marta detecta un error en una ficha, **Cuando** pulsa "reportar error" y describe el problema, **Entonces** el reporte queda registrado para revisión y la ficha no cambia hasta que una persona la revise.

### Historia de Usuario 7 - Compartir la checklist con mi familia (Prioridad: P2)

Como gestora familiar, quiero pasarle la checklist a mi pareja o a mi madre, para repartir la tarea
o dejarle claro a la beneficiaria qué se necesita.

**Por qué esta prioridad**: amplifica el valor pero el viaje funciona sin ella.

**Test independiente**: se prueba generando el enlace y abriéndolo desde un navegador sin sesión.

**Escenarios de aceptación**:
1. **Dado** que Marta tiene una checklist con progreso, **Cuando** pulsa "compartir", **Entonces** obtiene un enlace que cualquiera puede abrir sin registrarse y que muestra la checklist con su estado actual.
2. **Dado** que su pareja abre el enlace, **Cuando** ve la checklist, **Entonces** puede verla pero no modificar el progreso de Marta (solo lectura; la co-edición queda para R2).

### Historia de Usuario 8 - Contar si salió a la primera (Prioridad: P2)

Como equipo del producto, queremos preguntar "¿salió a la primera?" tras la gestión, para medir la
promesa central de la hipótesis y recoger testimonios reales.

**Por qué esta prioridad**: es la métrica del proyecto (ver hipotesis.md (repo Viberano)) y la
fábrica de historias para septiembre. Son dos botones: barata y de alto valor.

**Test independiente**: se prueba completando el flujo hasta el final y comprobando que la
respuesta queda registrada asociada al trámite.

**Escenarios de aceptación**:
1. **Dado** que Marta llegó a la preparación final de un trámite, **Cuando** vuelve a la app después, **Entonces** se le pregunta "¿salió a la primera?" con dos opciones (sí / no) y un campo opcional de comentario.
2. **Dado** que responde "no", **Cuando** envía la respuesta, **Entonces** se le pregunta qué falló (opcional) y esa señal queda asociada a la ficha para revisión del contenido.
3. **Dado** que ya respondió una vez, **Cuando** vuelve a la checklist, **Entonces** no se le vuelve a preguntar por ese mismo trámite.

### Historia de Usuario 9 - Preparar fichas nuevas desde una fuente oficial (Prioridad: P3)

Como curadora del catálogo, quiero aportar la URL de una página oficial y recibir un borrador de
ficha preparado de forma diferida, para curar trámites nuevos en minutos en vez de horas.

**Por qué esta prioridad**: multiplica la velocidad de curación (y preserva la visión a largo plazo
del producto), pero el usuario final nunca lo ve: el MVP funciona con fichas curadas a mano.

**Test independiente**: se prueba aportando una URL oficial y comprobando que el borrador aparece
para revisión sin bloquear ni afectar a nada visible por usuarios finales.

**Escenarios de aceptación**:
1. **Dado** que la curadora aporta la URL de una sede oficial, **Cuando** la envía, **Entonces** la petición queda "en preparación" y ella puede seguir trabajando (la preparación es diferida, nunca la espera en pantalla).
2. **Dado** que el borrador está listo, **Cuando** la curadora lo abre, **Entonces** está etiquetado "🤖 Generada por IA — sin verificar", es visible **solo** para curadoras, y muestra la fuente de cada dato extraído.
3. **Dado** que la curadora revisa el borrador contra la fuente y lo aprueba, **Cuando** lo publica, **Entonces** la ficha entra al catálogo con "✅ Verificada el [fecha de hoy]".
4. **Dado** que la URL es inaccesible o el contenido no se puede extraer con confianza, **Cuando** la preparación termina, **Entonces** la curadora recibe el aviso del fallo y **nada parcial ni dudoso se publica**.

### Casos límite

- ¿Qué pasa si dos trámites se referencian mutuamente como prerrequisitos (cadena circular)? El sistema debe detectarlo en la curación e impedir guardarlo.
- ¿Qué pasa si un prerrequisito apunta a un trámite que aún no está en el catálogo? Se muestra como aviso de texto ("necesitarás X, que aún no tenemos en detalle") con enlace a la fuente oficial — nunca como enlace roto.
- ¿Qué pasa si Marta responde el wizard de forma que ningún caso curado la cubre? El sistema lo dice honestamente y remite a la fuente oficial; **jamás** improvisa una checklist.
- ¿Qué pasa con el enlace compartido si Marta borra su checklist? El enlace muestra "esta checklist ya no existe".
- ¿Qué pasa si la sede oficial cambia su URL y el enlace de la ficha rompe? El reporte de error es el mecanismo de detección en MVP (el re-crawl queda para R2).
- ¿Qué pasa si el mismo usuario inicia el mismo trámite dos veces (dos hijos)? Se permiten múltiples checklists del mismo trámite, cada una con nombre propio ("DNI Hugo", "DNI Vera"); la app propone el nombre a partir de la respuesta "¿para quién es?" del wizard.
- ¿Qué pasa en comunidades autónomas no cubiertas? El wizard debe preguntar la comunidad solo cuando el trámite varía por territorio, y decir honestamente qué territorios cubre la ficha.

---

## Requisitos *(obligatorio)*

### Requisitos funcionales

**Catálogo y búsqueda**
- **FR-001**: El sistema DEBE ofrecer un catálogo navegable con los 11 trámites curados definidos en "Decisiones cerradas", cada uno con nombre oficial, nombre coloquial y descripción en lenguaje llano.
- **FR-002**: El sistema DEBE devolver el trámite correcto ante búsquedas en lenguaje coloquial, verificable con un juego de consultas de prueba definido junto al catálogo (p. ej. "carnet de mi hijo" → Renovación de DNI de un menor).
- **FR-003**: Ante una búsqueda sin resultado, el sistema DEBE comunicarlo honestamente, permitir registrar la petición y NO generar contenido al vuelo.

**Personalización**
- **FR-004**: El sistema DEBE personalizar cada trámite mediante un máximo de 4 preguntas, siendo la primera siempre "¿es para ti o para otra persona?".
- **FR-005**: El sistema DEBE emitir un veredicto de viabilidad cuando el destinatario no es el solicitante: si la vía elegida no es posible para ese caso, DEBE decirlo explícitamente y mostrar las alternativas reales.
- **FR-006**: La checklist resultante DEBE incluir únicamente los requisitos aplicables a las respuestas dadas.

**Checklist y cadena**
- **FR-007**: Cada requisito DEBE mostrar su tipo (documento físico, documento digital, requisito técnico o trámite previo) y una explicación en lenguaje llano.
- **FR-008**: Los trámites previos DEBEN mostrarse como cadena antes de los demás requisitos, y navegar a un prerrequisito DEBE conservar el camino de vuelta al trámite de origen.
- **FR-009**: Toda ficha DEBE mostrar de forma prominente el enlace a su fuente oficial y su estado de verificación con fecha.

**Progreso e identidad**
- **FR-010**: El sistema DEBE guardar automáticamente cada marca de requisito, sin acción explícita de guardado.
- **FR-011**: El sistema DEBE permitir el uso anónimo completo (el progreso se conserva en el navegador) y ofrecer, sin obligar, la identificación sin contraseña (enlace de acceso al email) para acceder al mismo estado desde cualquier dispositivo.
- **FR-012**: Al identificarse un usuario con progreso anónimo previo, el sistema DEBE conservar íntegro ese progreso en su cuenta.
- **FR-013**: El sistema DEBE permitir varias checklists simultáneas del mismo trámite por usuario, cada una con un nombre editable propuesto a partir de la respuesta "¿para quién es?".
- **FR-014**: El sistema DEBE generar enlaces de compartición de solo lectura accesibles sin registro.

**Canal y cierre**
- **FR-015**: El sistema DEBE ofrecer la preparación específica del canal elegido: "antes de empezar" con requisitos técnicos y enlace a la sede (online), o "qué llevar" imprimible y enlace a cita previa (presencial).
- **FR-016**: La versión imprimible DEBE ser legible sin depender del color y con cuerpo de letra apto para personas mayores, e incluir trámite, requisitos, fuente y fecha de verificación.
- **FR-017**: El sistema DEBE preguntar "¿salió a la primera?" una única vez por checklist completada y registrar la respuesta asociada a la ficha.
- **FR-018**: El sistema DEBE permitir reportar un error desde cualquier ficha; el reporte queda en cola de revisión sin alterar el contenido publicado.

**Confianza y contenido (la regla que no se negocia)**
- **FR-019**: Toda información mostrada a usuarios finales DEBE proceder de fichas curadas o revisadas por una persona. El sistema NUNCA genera requisitos en el momento de la consulta.
- **FR-020**: El sello "verificada" DEBE degradar automáticamente a "puede estar desactualizada" a los 90 días de la fecha de verificación.

**Motor de curación (rol curador)**
- **FR-021**: El sistema DEBE permitir a una curadora aportar la URL de una fuente oficial y preparar un borrador de ficha de forma diferida, sin bloquear su pantalla ni afectar a usuarios finales.
- **FR-022**: Los borradores DEBEN nacer etiquetados "Generada por IA — sin verificar", ser visibles solo para curadoras y requerir aprobación humana explícita para publicarse.
- **FR-023**: Si la extracción falla o carece de confianza suficiente, el sistema DEBE avisar del fallo y NO publicar contenido parcial.

**Plazos** *(FR-027 añadido el 17/07: lo reveló la curación real, no el diseño)*
- **FR-027**: Cuando un trámite solo pueda solicitarse en una ventana de fechas, el sistema DEBE mostrar el estado del plazo (abierto / aún no abierto / cerrado) antes que la checklist, y DEBE decir explícitamente que está cerrado cuando lo esté. Servir una checklist impecable de un trámite no solicitable contradice el JTBD ("que no te frene algo que no sabías") y roza el "contenido engañoso" que el reto prohíbe.

**Generales**
- **FR-024**: La aplicación DEBE ser plenamente utilizable en móvil y en escritorio.
- **FR-025**: Toda la interfaz y el contenido DEBEN estar en español.
- **FR-026**: El sistema DEBE impedir guardar cadenas de prerrequisitos circulares en la curación.

### Entidades clave

- **Trámite (ficha)**: un procedimiento administrativo curado. Nombre oficial y coloquial, descripción llana, organismo, territorio de validez, canales admitidos (online/presencial/ambos), enlace a fuente oficial, enlace a cita previa, estado de verificación y su fecha. Se relaciona con sus requisitos, sus preguntas de personalización y sus prerrequisitos.
- **Prerrequisito**: relación dirigida entre dos trámites ("para A necesitas B"). **Es la relación que sostiene el diferencial** ⛓️ y existe desde el día 1. No admite ciclos.
- **Pregunta de personalización**: pregunta de opción cerrada asociada a un trámite (máx. 4, la primera siempre el destinatario). Sus respuestas activan o desactivan requisitos y pueden disparar el veredicto de viabilidad.
- **Requisito**: algo que puede frenar el trámite. Tipo (documento físico / documento digital / requisito técnico / trámite previo), explicación llana, condiciones de aplicabilidad según respuestas del wizard.
- **Checklist personal**: instancia de un trámite para una persona usuaria: nombre propio editable ("DNI Hugo"), sus respuestas al wizard, el estado de cada requisito aplicable, el canal elegido y su respuesta a "¿salió a la primera?". Un usuario puede tener varias del mismo trámite. Es el **estado persistente** que diferencia la app de una guía.
- **Persona usuaria**: anónima (progreso en su navegador) o identificada por email sin contraseña; al identificarse conserva el progreso anónimo. Posee checklists. Un subconjunto tiene rol **curadora**.
- **Enlace compartido**: acceso de solo lectura a una checklist personal concreta.
- **Reporte de error**: aviso de una usuaria sobre una ficha; entra en cola de revisión con su descripción y fecha.
- **Borrador de ficha**: resultado diferido del motor a partir de una URL oficial. Etiquetado "generada por IA — sin verificar", visible solo para curadoras, con trazabilidad de fuente por dato. Al aprobarse se convierte en Trámite verificado.

---

## Criterios de éxito *(obligatorio)*

### Resultados medibles

- **SC-001**: Una persona nueva pasa de la portada a su checklist personalizada en **menos de 3 minutos** sin ayuda (probado con 5 personas de la comunidad).
- **SC-002**: El **100%** de los requisitos mostrados a usuarios finales es trazable a una ficha revisada por una persona; **cero** contenido generado al vuelo (auditable revisando el catálogo completo).
- **SC-003**: Al menos **7 de cada 10** respuestas a "¿salió a la primera?" son "sí" durante el piloto de septiembre.
- **SC-004**: El catálogo contiene al menos **2 cadenas de prerrequisitos de 2+ eslabones** demostrables en la demo (p. ej. beca → certificado digital → DNI).
- **SC-005**: Una usuaria que marca progreso en un dispositivo lo ve intacto en otro dispositivo en el **100%** de los casos probados.
- **SC-006**: Al menos **5 personas de la comunidad IÁgil** completan una checklist de un trámite real antes del directo de septiembre.
- **SC-007**: La demo completa del viaje (buscar → personalizar → checklist → marcar → preparación final) se realiza en **menos de 3 minutos** sin depender de ninguna operación en vivo frágil.

---

## Suposiciones

- **La hipótesis se valida con el producto real** (hipotesis.md (repo Viberano)): la señal principal es "¿salió a la primera?" (SC-003) y el uso de la beta por la comunidad. Vigilancia especial: si los usuarios llegan sin saber qué trámite necesitan (búsquedas fallidas), la Actividad 1 pasa a ser el centro del producto.
- **Extranjería queda fuera** del MVP (máximo dolor, máximo riesgo de daño; requiere verificación reforzada).
- **La curación humana existe**: el equipo (2 personas) reserva tiempo de agosto para verificar cada ficha contra su fuente oficial. Es el cuello de botella real y asumido.
- **Solo español** en MVP. Sin soporte multi-idioma.
- **Los 90 días** de degradación del sello son un valor inicial razonable, no validado.
- **Restricción del reto**: la app se construye íntegramente mediante prompts (Claude Code), sin ediciones manuales de código. El historial de commits sirve de evidencia.
- **Fuera de alcance explícito** (R2/futuro): búsqueda automática de la web oficial, +50 trámites, re-crawl programado, recordatorios, modo acompañamiento, testimonios públicos, extranjería, verificación por comunidad, subida de documentos, cita previa integrada, co-edición de checklists compartidas.

## Decisiones cerradas (2026-07-16)

Las cinco preguntas abiertas del borrador quedaron resueltas:

1. **Nombre: "A la Primera".** La promesa es el nombre; "¿salió a la primera?" cierra el círculo.
2. **Catálogo: 11 trámites, Comunidad de Madrid** en el bloque autonómico. Elegidos por familia coherente para que existan cadenas reales, cruzando tres niveles de administración:

   | # | Trámite | Organismo |
   |---|---|---|
   | 1 | Empadronamiento (alta y certificado) | Ayuntamiento |
   | 2 | Certificado de nacimiento | Registro Civil |
   | 3 | DNI primera vez (menor) | Policía Nacional |
   | 4 | Renovación de DNI (adulto y menor) | Policía Nacional |
   | 5 | Pasaporte | Policía Nacional |
   | 6 | Certificado digital FNMT | FNMT |
   | 7 | Cl@ve | Estado |
   | 8 | Tarjeta sanitaria | Comunidad de Madrid |
   | 9 | Título de familia numerosa | Comunidad de Madrid |
   | 10 | Beca comedor/libros ⭐ (la demo) | Comunidad de Madrid |
   | 11 | Apoderamiento (actuar por otra persona) | Estado |

   Cadena estrella de la demo: **beca (10) → certificado digital (6) → DNI en vigor (4)**. El
   apoderamiento (11) es la respuesta materializada a "¿puedo hacerlo yo por mi madre?".
3. **Progreso: anónimo primero, login opcional.** Marcar no exige registro (se guarda en el navegador); identificarse añade multi-dispositivo y conserva lo anónimo. Es el flujo más generoso con el usuario y el más exigente de construir — asumido.
4. **Compartir: solo lectura.** Co-edición a R2.
5. **Varias checklists por trámite, con nombre propio** ("DNI Hugo", "DNI Vera"), propuesto desde la respuesta "¿para quién es?".
