# Ideas consideradas

Registro de decisión: qué se propuso, qué se descartó y por qué. Actualizado el 16/07/2026.

## ✅ Idea elegida: A la Primera

Asistente personal de trámites con la administración española. Ver [README.md](../../README.md) y
[spec.md](../spec.md).

**Origen:** la visión inicial la aportó la compañera de equipo ("una web donde ver requisitos y
procedimientos de gestiones con organismos oficiales"). Se afinó en tres vueltas:

1. **De biblioteca a asistente.** El análisis competitivo mostró que las guías ya existen
   (tramites.pro: 170 guías gratis). El hueco real: personalización + estado persistente.
2. **De respuesta al vuelo a motor + curación.** Extraer información en vivo con IA arriesga
   alucinaciones en requisitos oficiales (daño real, "contenido engañoso" prohibido por el reto).
   El motor de IA genera borradores; una persona verifica antes de publicar.
3. **De "llegar a la cita" a agnóstico del canal.** Los trámites 100% online existen y su fallo es
   peor (Autofirma, certificados, sesiones caducadas). De ahí los requisitos técnicos como tipo de
   requisito de primera clase — territorio que ninguna guía cubre.

**Por qué encaja en el reto:** impacto social directo (la temática que el Viberano recomienda),
demo de 3 minutos que emociona (la cadena beca → certificado → DNI caducado), viable en agosto
con vibe coding, y una historia de discovery que contar a un jurado de product managers.

## ❌ Descartada: SpecLens

Generaba una `spec.md` a partir de una app, web, repo o idea existente.

**Por qué se descartó:** al aplicar el test *skill vs. app* ("¿el valor central es algo que un chat
no puede dar?") resultó ser una skill — texto → razonamiento → documento, sin estado, sin
colaboración, sin bucle temporal. Y esa skill **ya existe**: `crear-spec-sdd` en el repo de skills
de 233 Academy. Construir una app cuyo único valor es lo que una skill gratuita ya hace era la forma
más rápida de perder.

**Qué sobrevivió de ella:** el método. La cadena hipótesis → mapa → spec con la que se ha definido
A la Primera es exactamente el flujo Spec-Driven Development que SpecLens quería facilitar.

## Otras alternativas evaluadas (no elegidas)

| Idea | A favor | Por qué no |
|---|---|---|
| **Story Mapping colaborativo** | Máxima afinidad con el jurado (Jeff Patton); imposible como skill (tablero compartido en vivo) | Menos impacto social; tiempo real multiplica el riesgo técnico del verano |
| **PromptCanvas** (problema → prompt/spec para Lovable/v0) | Viral dentro de la comunidad: la herramienta del propio reto | Demasiado cerca de ser una skill; poco impacto fuera de la burbuja |
| **OKR Tracker con check-ins** | Añade justo lo que la skill de OKRs no puede (seguimiento temporal) | Mucha competencia; menos demo-able en 3 minutos |
| **Retro Copilot en sala** | Demo en vivo brutal; Management 3.0, territorio del jurado | Tiempo real + salas = complejidad alta para vibe coding |
| **Pair Replay, Meeting Copilot, Product Roast, Prompt Builder** (lista original) | — | Descartadas en la primera criba: dependencias de importación, competencia saturada o riesgo de resultado genérico |
