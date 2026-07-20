# Mapa de historias: Asistente personal de trámites

> Viberano (233 Academy) · v3 — 16/07/2026 · **Herramienta: Claude Code** (no Lovable).
> Ventana de construcción: agosto (~4-5 semanas, 2 personas a tiempo parcial).
> Estrategia de recorte: **funcionalmente completo, volumen reducido.** Ampliamos catálogo después.
>
> **v3:** el trámite puede ser **presencial u online**. La v2 asumía ventanilla en todo el viaje.
>
> Construido sobre la hipótesis de [hipotesis.md](hipotesis.md). **Decisión del equipo (16/07): se
> construye ya**; la hipótesis se contrasta con el producto real ("¿salió a la primera?" y beta con
> la comunidad).

**Segmento**: adultos que gestionan trámites administrativos **para otros miembros de su familia**.

**Persona**: **Marta, 42 años**. Trabaja, tiene un hijo de 12 y una madre de 74. Es quien resuelve los
papeles de los tres. Digitalmente competente pero sin paciencia para sedes electrónicas. Su dolor no
es la falta de información: es no saber **qué le piden a ella, en su caso** — y descubrir lo que falta
cuando ya está en la ventanilla, o cuando lleva media hora en un formulario que se cae.

**Narrativa (JTBD)**: *"Terminar el trámite a la primera, sin que me frene a mitad un requisito que no
sabía que necesitaba."*

---

## Lo que ha cambiado en v3 (y por qué mejora el producto)

La v2 daba por hecho que todo trámite acaba en una ventanilla: el JTBD decía "llegar a la cita", la
Actividad 4 se llamaba "presentarse", y el entregable estrella era un imprimible de "qué llevar".
**Muchos trámites son 100% online y eso rompía el mapa por tres sitios.**

Lo interesante es que la corrección **refuerza** la propuesta:

1. **El fallo online es peor que el presencial.** En ventanilla hay un humano que te dice qué falta.
   Online se te caduca la sesión, Autofirma no arranca, el navegador no reconoce el certificado, el
   PDF pesa de más — y nadie te explica nada. Más dolor = más sitio para nosotros.
2. **Aparecen los requisitos técnicos**, que ninguna guía cubre bien: certificado instalado, Autofirma,
   navegador compatible, Cl@ve PIN, el escaneado en el formato correcto. La checklist deja de ser
   "papeles" y pasa a ser **todo lo que te puede frenar**.
3. **La cadena de trámites se vuelve la historia perfecta**, y es enteramente online:
   *solicitar la beca online → necesitas certificado digital → necesitas el DNI en vigor*.
   Tres eslabones, en la familia de Marta, y ninguna guía estática te lo cuenta antes de empezar.

```
Marta: "Terminar el trámite a la primera, sin que me frene un requisito que no sabía"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[1. Averiguar qué  ]→[2. Entender qué   ]→[3. Reunir todo lo]→[4. Hacer la      ]
[   trámite es     ]  [   le piden A ELLA]  [   que hace falta]  [   gestión       ]
        ↓                    ↓                    ↓                    ↓
· · · · · · · · · MVP agosto — funcionalmente completo · · · · · · · · · · · ·
  Buscador libre        Wizard 3-4 preg.      Checklist marcable    ¿Online o ventanilla?
  Catálogo 10-12        ¿Puedo yo por ella?   Progreso persistente  Online: "antes de empezar"
  Motor: pegar URL      Checklist personal.   Login (multi-disp.)   Ventanilla: imprimible
  ⛓️ Encadenados        Fuente + sello        Compartir familiar    ¿Salió a la primera?
· · · · · · · · · · · R2 — volumen y alcance · · · · · · · · · · · · · · · · ·
  Búsqueda auto web     Re-crawl programado   Recordatorios         Modo acompañamiento
  +50 trámites          Más comunidades                             Testimonios
· · · · · · · · · · · · · · Futuro · · · · · · · · · · · · · · · · · · · · · ·
  Extranjería           Verificación comunidad  Subir documentos    Cita integrada
```

---

## Columna vertebral → pasos → tareas

### Actividad 1: Averiguar qué trámite necesita
*Pasos: darse cuenta de que hay que hacerlo · averiguar cómo se llama · encontrar quién lo gestiona*

- **MVP**: buscador libre por texto ("lo del carnet de mi hijo") sobre catálogo de **10-12 trámites curados** · **motor: pegar la URL de una sede** y generar ficha nueva (asíncrono) · **⛓️ ver los trámites que este esconde** *(prerrequisitos)*
- **R2**: localizar automáticamente la web oficial sin pasarle la URL · +50 trámites y más comunidades
- **Futuro**: extranjería (mayor dolor, mayor riesgo — requiere verificación reforzada)

### Actividad 2: Entender qué le piden a ella
*Pasos: leer requisitos genéricos · descartar lo que no aplica · **averiguar si puede hacerlo ella por otra persona** · deducir qué significa para su caso*
> **Aquí vive el diferencial.** Es la actividad que hoy le come la tarde: la información existe, pero
> está escrita para todos y ella tiene que traducirla a su caso.

- **MVP**: wizard de 3-4 preguntas → **checklist personalizada** · **"¿puedo hacerlo yo por ella?"** (ver huecos) · **enlace prominente a la fuente oficial** · **"verificada el DD/MM"** con degradación a los 90 días
- **R2**: re-crawl programado de las fichas más visitadas
- **Futuro**: verificación por la comunidad (varios usuarios confirman una ficha)

### Actividad 3: Reunir todo lo que hace falta
*Pasos: mirar qué tiene ya · conseguir lo que falta · comprobar que está todo (a lo largo de días)*
> **Aquí vive lo que la hace app y no una guía.** Marta no resuelve esto de una sentada: lo hace en
> tres tardes. Un PDF no recuerda dónde lo dejó; esto sí.
>
> **"Todo" ya no son solo papeles.** Son cuatro tipos de requisito, y los tres últimos son los que
> nadie cubre:
> - 📄 **Documentos físicos** — libro de familia, foto de carnet
> - 💻 **Documentos digitales** — escaneado en PDF, tamaño máximo, formato
> - ⚙️ **Requisitos técnicos** — certificado instalado, Autofirma, navegador compatible, Cl@ve
> - ⛓️ **Trámites previos** — el certificado digital que aún no tienes

- **MVP**: marcar cada requisito como conseguido · **progreso persistente** · **login** (magic link → móvil y portátil) · **compartir la checklist con un familiar**
- **R2**: recordatorios ("te faltan 2 requisitos y la cita es el jueves")
- **Futuro**: subir el documento a la app para no perderlo

### Actividad 4: Hacer la gestión
*Pasos: **decidir el canal** (online o ventanilla) · preparar lo que ese canal pide · completarla*
> **El canal cambia los requisitos**, y elegirlo es parte del trabajo de Marta. Online necesita
> certificado y Autofirma; ventanilla necesita cita y papeles en mano. La app tiene que acompañar
> las dos rutas, no una.

- **MVP**: **elegir ruta online o presencial** (con lo que pide cada una) · **ruta online**: checklist *"antes de empezar"* con los requisitos técnicos + enlace directo a la sede · **ruta presencial**: resumen **"qué llevar"** imprimible + enlace a cita previa · **"¿salió a la primera?"** al terminar · reportar error
- **R2**: **modo acompañamiento** (la app en una pestaña mientras haces el trámite en la otra) · testimonios a partir de los "sí"
- **Futuro**: cita previa integrada

---

## Las tres decisiones que hacen viable "funcionalmente completo"

### 1. ⛓️ Los trámites encadenados suben al MVP — y mandan sobre el catálogo
*Solicitas la beca de tu hijo online → te piden certificado digital → para el certificado necesitas
el DNI en vigor → está caducado.* Tres trámites escondidos dentro de uno, descubiertos de uno en uno
y siempre tarde. Las guías estáticas lo mencionan de pasada. Nosotros lo **encadenamos y te lo
enseñamos antes de empezar**.

Sube al MVP por arquitectura, no por ambición: **el encadenamiento es el modelo de datos** (un trámite
tiene prerrequisitos que son otros trámites). Diseñarlo en agosto sale gratis; retrofitearlo en
octubre es reescribir el esquema. Si algo entra tarde, que no sea esto.

**Y esto manda sobre qué 10-12 trámites elegís:** curad por **familia coherente** (identidad +
certificados digitales + lo que cuelga de ellos), **no por popularidad**. Con 10 trámites sueltos no
aparece ni una cadena y el diferencial no se puede ni enseñar. Diez que se enganchan valen más que
treinta desconectados.

### 2. El motor entra, pero fuera del path de la request
Con Claude Code el motor es viable de verdad (fetch + Playwright para sedes con JS + parseo de PDF +
extracción con LLM). El riesgo nunca fue construirlo: era que **fallara en directo**.

Solución arquitectónica: **pipeline asíncrono, no respuesta en vivo.** Pegas URL → cola → ficha →
base de datos. La app *siempre* lee de base de datos, así que la demo nunca espera a un scraping. Las
fichas nacen marcadas **"generada por IA — sin verificar"** hasta que una persona las revisa contra
la fuente. La visión de tu compañera entra entera y la demo sigue siendo a prueba de balas.

### 3. El login entra porque ahora es barato
Con Supabase Auth (magic link) es medio día. Y desbloquea lo que el diferencial pedía: Marta empieza
en el móvil en la cola del médico y sigue en el portátil por la noche.

---

## El presupuesto real de agosto (el aviso importante)

Con Claude Code **el código deja de ser el cuello de botella**. Lo que os va a comer agosto es:

| Trabajo | Lo acelera la IA | Realidad |
|---|---|---|
| Construir la app | ✅ Mucho | Claude Code lo escupe |
| Tunear la extracción del motor | 🟡 A medias | Cada sede es un mundo |
| **Curar y verificar 10-12 trámites contra la fuente oficial** | ❌ **Nada** | **A mano. Es el cuello de botella real** |

**Proteged ese presupuesto o publicáis información falsa.** Es la única parte que no se puede
vibe-codear: alguien tiene que abrir la sede oficial y comprobar, requisito a requisito, que la ficha
dice la verdad. En un trámite oficial una alucinación no es un bug, es una persona que pierde la cita
— y es exactamente el "contenido engañoso" que el reto prohíbe.

Regla de oro: **la ficha guía, la fuente manda.**

---

## ⚠️ Aviso de elegibilidad — el riesgo nuevo de usar Claude Code

Las bases son tajantes: *"Si en algún momento abrís un editor de código y escribís manualmente, os
habéis salido del reto."* Claude Code está en su lista de herramientas recomendadas, así que usarlo
es perfectamente legal.

**Pero el riesgo es mucho mayor que con Lovable.** Allí el código no está al alcance de la mano; con
Claude Code lo tienes en tu repo, en tu editor, y a las tres de la mañana con un typo que rompe el
build la tentación de arreglarlo tú es enorme. **Ese arreglo de dos caracteres os descalifica.**

- **Todo por prompt. Sin excepciones.** Aunque sea una coma. Aunque tardéis diez veces más.
- **Ni abrir el editor.** Si no lo abres, no caes.
- Que **el historial de git sea vuestra coartada**: commits desde Claude Code, cero ediciones manuales.
- Guardad los prompts. En la presentación, *"así lo construimos sin tocar una línea"* es parte del espectáculo.

---

## Huecos y oportunidades

**🚨 "¿Puedo hacerlo yo por ella?" — el hueco que ha abierto lo online.** Marta puede hacer el trámite
de su hijo menor porque es su madre. Pero **no puede hacer online el trámite de su madre de 74 años**:
necesitaría el certificado digital *de ella*, o una representación. Es la pared con la que choca la
persona que hemos elegido, **y es la primera pregunta que se hace** — y ninguna guía la responde.

Esto convierte la pregunta del wizard *"¿es para ti o para otra persona?"* en la más importante de
todas: no personaliza la checklist, **determina si el trámite es posible siquiera por esa vía**.
`[Recomendación: subirla al MVP como pregunta 1 del wizard. Es donde el producto puede decir lo que
nadie dice: "esto no lo puedes hacer tú por ella online — estas son tus opciones".]`

**🕳️ El mapa asume que Marta sabe qué trámite necesita.** Aunque el MVP traiga buscador, seguimos
tratando la Actividad 1 como búsqueda. Si el pivote de [hipotesis.md](hipotesis.md) acierta —que el
dolor real es *"no sé ni qué necesito ni cuál es la web oficial de verdad"*— entonces **la Actividad 1
es el producto**. La señal llegará del uso real: búsquedas fallidas y el patrón de los "no" en
"¿salió a la primera?". Sigue siendo el hueco más grande.

**💡 El beneficiario invisible.** La madre de Marta es beneficiaria pero nunca toca la app. El
imprimible no es una florituras: es el **único canal hacia el beneficiario final** — y ahora, con lo
online, también el canal para decirle *"esto lo hago yo por ti, firma aquí"*.

**⚠️ El antipatrón que acecha.** Antes el riesgo era recortar de más. Con "MVP funcionalmente completo"
se invierte: **construir las 4 actividades a medias**. Si en la semana 3 vais justos, se recorta
**volumen** (10 trámites → 6), nunca funcionalidad. Es el trato que habéis elegido: mantenedlo cuando
duela.
