# Pantallas de A la Primera

Las cinco pantallas del MVP, agrupadas en los dos momentos del recorrido: encontrar el
trámite y prepararlo. De cada una se cuenta qué hace el usuario, qué resuelve, por qué
importa y qué se ve.

Las maquetas navegables están en `../pantallas/`, las capturas a ancho de móvil en esta
misma carpeta, y las tres versiones por las que pasó el diseño se comparan en
`../comparador.html`.

---

## 001 · Encontrar el trámite

### Home · Buscador

**Qué hace el usuario.** Explora el catálogo de trámites por hecho vital (ej. "Nace un
hijo", "Empieza el cole") y busca el suyo específico.

**Qué resuelve.** Llegar al trámite correcto sin saber cómo se llama. Nadie busca
"renovación del documento nacional de identidad": busca "lo del carnet de mi hijo".

**Por qué importa.** Es la primera decisión y la que condiciona todas las demás: si te
equivocas de ficha, la lista de papeles que salga después no te sirve de nada. Por eso el
catálogo se ordena por lo que te está pasando y no por el organigrama del Estado.

**Qué se ve.**

- Buscador en lenguaje llano, con el placeholder "Lo del carnet de mi hijo…".
- El sello "VERIFICADO CONTRA LA FUENTE" ya en la portada: el argumento del producto no
  espera a la segunda pantalla.
- Tarjetas de hecho vital con el número de fichas que hay dentro.
- Los hechos vitales que aún no tienen ficha se marcan "en preparación", en ocre. No es un
  aviso: es un hueco reconocido.

### Detalle de trámite ⭐ (pantalla estrella)

**Qué hace el usuario.** Consulta toda la información del trámite: descripción, requisitos,
datos oficiales, canales y fuente verificada.

**Qué resuelve.** Saber si esta es de verdad su ficha, y si se puede fiar de ella, antes de
invertir tiempo en preparar nada.

**Por qué importa.** Es donde vive el argumento entero del producto. Una app de trámites
solo vale si te puedes fiar de lo que dice, y aquí es donde se demuestra: el sello
declara que una persona cotejó la ficha contra la fuente, con la fecha del cotejo, y el
enlace a esa fuente está a un toque. Si nadie la ha mirado todavía, lo dice.

**Qué se ve.**

- El sello de verificación con su fecha, arriba del todo y bajo el título, no en un pie de
  página.
- "Una persona cotejó esta ficha contra la fuente oficial. Nada de lo que ves lo ha
  generado una IA."
- La ficha en pares clave/valor: nivel, canales, plazo, tasa y fuente oficial. Todo dato
  que venga de un documento va en monoespaciada.
- Los avisos duros ("hay que ir en persona") antes del botón, no después.

---

## 002 · Prepararlo sin sorpresas

### Wizard

**Qué hace el usuario.** Responde 4 preguntas sobre su caso (destinatario, plazo, canal y
acompañamiento) para personalizar los requisitos.

**Qué resuelve.** Convertir una ficha que vale para todo el mundo en la lista concreta de
tu caso.

**Por qué importa.** Es lo que separa esta app de una página de la administración. Un
requisito que solo aplica a menores no tiene por qué salirte si el trámite es para ti, y
un plazo que ya se te ha pasado tiene que avisarte ahora y no cuando estés en la cola.

**Qué se ve.**

- "Pregunta N de 4" y una barra fina de progreso: siempre se sabe cuánto queda.
- Cada opción es una tarjeta entera pulsable, con su aclaración debajo. Objetivos táctiles
  de 48px, porque esto se usa con el dedo y lo usan personas mayores.
- Iconos SVG propios, nunca emoji (FR-028): los emoji los dibuja el sistema de cada
  usuario y se rompen.

### Resumen

**Qué hace el usuario.** Elige cómo y dónde hacer el trámite (online o en persona) antes de
ver su lista personalizada de papeles.

**Qué resuelve.** Fijar el canal, que es lo que más cambia la lista: por internet hacen
falta certificado digital y ficheros; en persona hacen falta cita, originales y
desplazamiento.

**Por qué importa.** Es la última decisión antes de generar la lista, así que es el último
punto barato para rectificar. Después ya estás preparando papeles que a lo mejor no
necesitas.

**Qué se ve.**

- "Antes de empezar" y una sola pregunta: nada más, para que la decisión no compita con
  otra cosa.
- Las dos opciones a la misma altura y con el mismo peso: la app no empuja hacia ninguna.

### Checklist

**Qué hace el usuario.** Ve la lista de papeles que necesita para el trámite, agrupados por
sección, marcando los que ya tiene.

**Qué resuelve.** Saber exactamente qué meter en la carpeta, y no volver de la ventanilla
porque faltaba una fotocopia.

**Por qué importa.** Es la pantalla que se lleva puesta a la oficina. Se consulta con
prisa, se imprime y a veces la lee otra persona distinta de la que la preparó. El progreso
se guarda, así que se puede ir juntando papeles a lo largo de varios días sin perder la
cuenta.

**Qué se ve.**

- Progreso en cabeza: "0 de 8 preparados", con barra y porcentaje.
- Tres secciones separadas: "Documentos que necesitas", "Pasos, en orden" y "Lo que
  cuesta". Un papel, una gestión y un pago no son la misma clase de cosa.
- Los requisitos condicionales se marcan "solo en algunos casos" en vez de esconderse.
- Formatos y cifras exactas donde importan (32 × 26 mm, tasas, teléfonos), siempre en
  monoespaciada.
- Casilla cuadrada, no redonda: esto es un expediente, no una app de tareas.
- Al marcarlo todo aparece el cierre "Lo tienes todo", que es el momento que la app
  existe para provocar.
