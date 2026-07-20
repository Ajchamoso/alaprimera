# Guion del duelo — Experimento A (+ B)

> Operativa del experimento definido en [hipotesis.md](hipotesis.md). Coste: unas horas de
> WhatsApp. Cero código.
>
> **Estado (16/07/2026): opcional, en paralelo a la construcción.** El equipo decidió construir ya,
> así que este duelo ya no es puerta de entrada — pero sigue siendo la forma más barata de detectar
> un error de enfoque *mientras* se construye, cuando corregir aún es barato. Si se corre, que sea
> en las primeras semanas de agosto.

## Umbral, escrito antes de empezar (no se negocia después)

| Resultado del duelo | Qué significa para la construcción |
|---|---|
| **≥ 7 de 10** eligen la personalizada | ✅ Seguir como está, con confianza |
| 5-6 de 10 | ⚠️ Revisar wizard y checklist: el diferencial no está aterrizando |
| **< 5 de 10** | ❌ La guía genérica ya les sirve → pivotar el énfasis del producto (ver pivotes en [hipotesis.md](hipotesis.md)) antes de invertir más agosto |

---

## Paso 1 — Reclutar (esta semana)

**Perfil:** 10 personas que encajen con el gestor familiar — adulto que tiene **ahora mismo o en
los próximos meses** un trámite pendiente, propio o de un familiar (hijo menor, padre/madre mayor).
Vale gente del trabajo, familia, amigos y comunidad IÁgil. **No vale** gente sin trámite real: sin
dolor presente, la respuesta es teatro.

**Mensaje de reclutamiento (copiar/pegar):**

> ¡Hola! Estamos montando un proyecto para ayudar con los trámites de la administración (DNI,
> certificado digital, becas, empadronamiento…). ¿Tienes alguno pendiente tú o alguien de tu
> familia? Te pido 10 minutos por WhatsApp: te enseño dos formas de prepararlo y me dices cuál te
> sirve más. Sin compromiso y me ayudas un montón 🙏

**Registrad de cada persona:** nombre, trámite pendiente, para quién es (¿ellos mismos u otra
persona?), y canal previsto (online / ventanilla / no lo sabe).

## Paso 2 — Preparar los dos materiales por participante

Para **su** trámite concreto (no uno genérico):

**Material A — la guía genérica.** El enlace de [tramites.pro](https://tramites.pro/) para su
trámite (o la página oficial si no existe en tramites.pro). Tal cual, sin editar: es el competidor
real jugando con sus cartas.

**Material B — la checklist personalizada, hecha a mano por vosotras** (test concierge). Antes de
escribirla, haced las 3-4 preguntas del wizard por WhatsApp:

> 1. ¿Es para ti o para otra persona? (¿quién?)
> 2. ¿Primera vez o renovación?
> 3. ¿Lo harás online o prefieres ir presencialmente?
> 4. (Si aplica) ¿En qué comunidad/municipio?

**Plantilla del Material B:**

```
📋 TU CHECKLIST — [Trámite] para [ti / tu hijo / tu madre]

⛓️ ANTES DE ESTE TRÁMITE NECESITAS:
   □ [trámite previo, si lo hay — ej. "DNI en vigor (el tuyo caducó: renuévalo antes)"]

📄 DOCUMENTOS FÍSICOS:
   □ [solo los de SU caso]

💻 DOCUMENTOS DIGITALES: (solo si va online)
   □ [ej. escaneado en PDF, máx X MB]

⚙️ ANTES DE EMPEZAR (online):
   □ [ej. certificado digital instalado / Cl@ve activada / Autofirma]

📍 EL DÍA X:
   → [enlace a cita previa / enlace directo a la sede]

Fuente oficial: [enlace] · Verificado por nosotras el [fecha]
```

**Regla de honestidad del experimento:** cada dato del Material B se comprueba contra la fuente
oficial antes de enviarlo. Si el concierge ya reparte información errónea, el experimento mide otra
cosa (y hace daño).

## Paso 3 — El duelo (10 min por persona, por WhatsApp o llamada)

1. Enviad **los dos materiales a la vez**, alternando el orden entre participantes (a la mitad A
   primero, a la otra mitad B primero) para no sesgar.
2. Dejad que los miren. Sin vender ninguno de los dos. Guion literal:

> — Te paso dos formas de preparar tu trámite. Míralas con calma.
> — ¿Cuál de las dos usarías el día que vayas a hacerlo? **¿Por qué?**
> — ¿Qué le falta a la que has elegido?
> — Del 0 al 10, ¿qué probabilidad hay de que se la pases a un amigo con un trámite?
> — (Si eligió B) ¿Qué pregunta de las que te hice sobraba? ¿Cuál faltó?

3. **No defendáis el Material B si critican algo.** Cada crítica anotada vale oro; cada defensa
   vuestra contamina el dato.

## Paso 4 — Registro

| # | Persona | Trámite | ¿Para quién? | Canal | Orden | **Elige** | Por qué (literal) | Pasaría a un amigo (0-10) |
|---|---------|---------|--------------|-------|-------|-----------|--------------------|---------------------------|
| 1 | | | | | A/B | | | |
| … | | | | | | | | |

Apuntad las frases **literales**: son los testimonios de la presentación de septiembre y la materia
prima de las preguntas reales del wizard.

## Paso 5 — Experimento B encadenado (Mago de Oz, con 5 de los 10)

A los 5 que tengan el trámite más próximo en el tiempo: seguidles hasta **después** de hacerlo.

> — ¿Al final lo hiciste? ¿Online o presencial?
> — **¿Salió a la primera?** Si no: ¿qué te frenó exactamente?
> — ¿La checklist tenía eso que te frenó, o nos lo saltamos nosotras?

**Medida:** ≥ 4 de 5 completan a la primera. Y cada "nos lo saltamos" es un tipo de requisito que
el producto tiene que cubrir — es el dato más valioso de todo julio.

## Paso 6 — Experimento C en paralelo (una tarde, sin usuarios)

Pasadle a la IA las URLs oficiales de los 11 trámites del catálogo ([spec.md](../spec.md), Decisiones)
y pedidle extraer requisitos, documentos y pasos. Comparad a mano contra la fuente.

**Medida:** ≥ 7 de 11 correctas y **0 requisitos inventados**. Un solo requisito inventado invalida
la apuesta técnica del motor → el plan de contingencia (curación 100% manual) ya está en la spec.

## La lectura de resultados

Reunión de pareja con la tabla delante, aplicando el umbral de arriba tal como está escrito.
Los pivotes preparados están en [hipotesis.md](hipotesis.md#paso-5--decisión-y-pivotes); las frases
literales de los participantes van directas a dos sitios: las preguntas reales del wizard y los
testimonios de la presentación de septiembre.
