# A la Primera

### 🌐 https://alaprimera.vercel.app

**Tu trámite, con tus papeles.** Termina cualquier gestión con la administración española
a la primera, sin que te frene a mitad un requisito que no sabías que necesitabas.

App del reto **Viberano** (Comunidad IÁgil de 233 Academy) — construida 100% mediante prompts con
Claude Code, sin editar una línea de código a mano.

Proyecto de **Alberto Chamoso y Mónica González**.

Las fichas del catálogo se extraen de sus fuentes oficiales con cita literal, y la app distingue
las cotejadas por el equipo (sello con fecha) de las que están por verificar. Si reutilizas el
catálogo, contrasta cada ficha con su fuente.

## Documentos (este repo es la fuente de verdad de la construcción)

Toda la documentación está en [`docs/`](./docs).

- [docs/spec.md](./docs/spec.md) — especificación SDD viva (el QUÉ): historias, 29 requisitos, entidades, criterios de éxito.
- [docs/plan.md](./docs/plan.md) — plan técnico (el CÓMO): stack, arquitectura, modelo de datos, identidad visual, fases.
- [docs/tasks.md](./docs/tasks.md) — el desglose en tareas y su estado.
- [docs/preparar-fichas.md](./docs/preparar-fichas.md) — cómo se prepara, verifica y mantiene una ficha, y qué aprendimos curándolas.
- [docs/estado-catalogo.md](./docs/estado-catalogo.md) — **recuento vivo del catálogo** (fichas, verificadas y pendientes por hecho vital), generado desde los datos con `npm run docs`.
- [docs/hechos-vitales.md](./docs/hechos-vitales.md) — el backlog del catálogo (~55 trámites) y el diseño de la futura navegación por hechos vitales.
- [docs/discovery/](./docs/discovery/README.md) — el *discovery* congelado: cómo se llegó a la idea (hipótesis, mapa de historias, ideas descartadas, el pivote desde SpecLens). Copiado del repo `Viberano` de la propuesta; son snapshots de julio de 2026 y no se actualizan.
- [CLAUDE.md](./CLAUDE.md) / [AGENTS.md](./AGENTS.md) — reglas del reto y del producto para cada sesión, con las skills `/preparar-ficha` y `/revisar-codigo` y la red de seguridad de tests.

## Estado (17/07/2026)

✅ **URL pública en marcha** — el requisito del reto, cumplido. Cada push a `main` despliega solo.

**Funciona de punta a punta:**
- Catálogo de **fichas curadas** con búsqueda coloquial, de **Estado, Madrid y Aragón** (recuento vivo en [docs/estado-catalogo.md](./docs/estado-catalogo.md))
- Catálogo agrupado por **hecho vital** ("nace un hijo", "me mudo"…), con un backlog de trámites **pendientes** (visibles, sin ficha aún) para validar la taxonomía
- **"Tu zona"**: se elige una vez y se recuerda; filtra el catálogo por comunidad y, si no hay ficha para la tuya, lo dice con honestidad en vez de darte la de otra
- Wizard personalizado con **veredicto de inviabilidad** ("esto no lo puedes hacer tú por ella")
- Checklist con 4 tipos de requisito y **cadenas de trámites encadenados** ⛓️
- **Aviso de plazo** cuando un trámite está fuera de fechas
- Progreso persistente **anónimo**, con login opcional (magic link) y **sincronización multi-dispositivo**
- **Compartir** por enlace de solo lectura · **"¿salió a la primera?"** · **reportar error**

Con identidad propia: **el sello** (papel de expediente, tinta y violeta de sello de caucho, IBM
Plex, iconos SVG). Ni rastro del aspecto por defecto con el que nació. Ver [plan.md §4bis](./docs/plan.md).

**Verificación del catálogo:** cada ficha nace extraída de su fuente oficial con cita literal y
marcada "por verificar"; cuando el equipo la coteja contra la fuente, recibe el sello con fecha
(`npm run verificar <slug>`). El proceso está en [docs/preparar-fichas.md](./docs/preparar-fichas.md)
y el recuento vivo en [docs/estado-catalogo.md](./docs/estado-catalogo.md).

**Fases del plan:** 0 (esqueleto), 1 (walking skeleton), 2 (cuentas y sync) y 3 (confianza y cierre)
completas. El motor de curación automático (Historia 9 de la spec) se reenfocó a extracción asistida
sin API key, y queda como R2.

🎯 Entrega: primer directo de la Comunidad IÁgil de septiembre.

## Red de seguridad (calidad)

Una red automática evita que un cambio rompa lo que ya funcionaba.

> Esta sección entera existe porque **Mónica González** la pidió: tests automáticos que validen que
> una funcionalidad nueva no rompe lo que ya funcionaba, una skill que valide que el código es
> mantenible y sigue patrones que faciliten evolucionar la plataforma, documentación generada de
> forma automática y validaciones de accesibilidad. El listado de abajo es esa petición,
> implementada.

- **Tests (Vitest, `npm test`)** — blindan las invariantes que dan confianza: la regla de oro
  (fichas ancladas a su fuente; pendientes que no publican contenido), la estructura del wizard, la
  integridad de las cadenas, el aislamiento por zona, el sello a 90 días y la taxonomía.
- **Accesibilidad** — `axe` sobre los componentes y **contraste WCAG AA** de la paleta (el público
  es gente mayor; el imprimible llega a una persona de 74 años).
- **Patrones del "sello"** — guardias que fallan si aparece un emoji en la UI (FR-028) o un color de
  Tailwind no semántico.
- **CI** — cada push y PR a `main` corre lint + tipos + tests + build en GitHub Actions.
- **Skill `/revisar-codigo`** — revisión de mantenibilidad contra los patrones del proyecto.
- **Docs sin deriva** — el estado del catálogo se genera desde los datos (`npm run docs`) y un test
  falla si se queda desfasado.

## Cómo correrlo

```bash
npm install
npm run dev            # http://localhost:3000
```

Comandos útiles: `npm test` (la red de seguridad), `npm run lint`, `npm run docs` (regenera el
estado del catálogo), `npm run db:seed` (vuelca el catálogo), `npm run verificar <slug>` (sella una
ficha cotejada), `npm run buzon` (qué te está diciendo la gente: fallos y reportes).

Variables de entorno en `.env.local` (no versionado): `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, y para tareas de servidor/seed `SUPABASE_SERVICE_ROLE_KEY` y
`DATABASE_URL`. Migraciones en `supabase/migrations/`; seed del catálogo con `npm run db:seed`.

## Autoría y licencia

Proyecto de **Alberto Chamoso y Mónica González** para el Viberano de la Comunidad IÁgil de
233 Academy.

De Mónica salen dos cosas que dan forma al proyecto: la **visión inicial del producto** (una web
donde ver requisitos y procedimientos de las gestiones con organismos oficiales, ver
[docs/discovery/ideas.md](./docs/discovery/ideas.md)) y toda la **[red de seguridad de
calidad](#red-de-seguridad-calidad)**: los tests de regresión, la skill que valida mantenibilidad,
la documentación generada sola y las validaciones de accesibilidad. Es lo que permite seguir
cambiando la app sin miedo.

El historial de git sale a nombre de una sola persona porque los commits se lanzaron desde una
máquina. En este reto el historial es la evidencia de que todo el código se escribió con Claude
Code, así que su contenido no se toca. La autoría del proyecto es de las dos personas.

Con una excepción, dicha aquí para que nadie la descubra por su cuenta: antes de abrir el repo se
reescribió la **dirección de correo del autor** en los 42 commits que existían, cambiando una
dirección personal por la de tipo `noreply` de GitHub, para no publicarla. Solo cambió la firma. Los
mensajes, las fechas, el orden y el contenido de cada commit son los mismos, y se comprobó que el
árbol de ficheros resultante es idéntico al anterior.

Código bajo licencia [MIT](./LICENSE): úsalo, cópialo y adáptalo. Si lo que te llevas son las
fichas de trámites y no el código, contrasta cada una con su fuente oficial.
