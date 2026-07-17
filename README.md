# A la Primera

### 🌐 https://alaprimera.vercel.app

**Tu trámite, con tus papeles.** Termina cualquier gestión con la administración española
a la primera, sin que te frene a mitad un requisito que no sabías que necesitabas.

App del reto **Viberano** (Comunidad IÁgil de 233 Academy) — construida 100% mediante prompts con
Claude Code, sin editar una línea de código a mano.

## Documentos (este repo es la fuente de verdad de la construcción)

- [spec.md](./spec.md) — especificación SDD viva (el QUÉ): historias, 29 requisitos, entidades, criterios de éxito.
- [plan.md](./plan.md) — plan técnico (el CÓMO): stack, arquitectura, modelo de datos, identidad visual, fases.
- [tasks.md](./tasks.md) — el desglose en tareas y su estado.
- [docs/preparar-fichas.md](./docs/preparar-fichas.md) — cómo se prepara, verifica y mantiene una ficha, y qué aprendimos curándolas.
- [docs/estado-catalogo.md](./docs/estado-catalogo.md) — **recuento vivo del catálogo** (fichas, verificadas y pendientes por hecho vital), generado desde los datos con `npm run docs`.
- [docs/hechos-vitales.md](./docs/hechos-vitales.md) — el backlog del catálogo (~55 trámites) y el diseño de la futura navegación por hechos vitales.
- [CLAUDE.md](./CLAUDE.md) / [AGENTS.md](./AGENTS.md) — reglas del reto y del producto para cada sesión, con las skills `/preparar-ficha` y `/revisar-codigo` y la red de seguridad de tests.
- El *discovery* (hipótesis, mapa de historias, análisis competitivo, el pivote desde SpecLens) vive
  en el repo `Viberano` de la propuesta.

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
Plex, iconos SVG). Ni rastro del aspecto por defecto con el que nació. Ver [plan.md §4bis](./plan.md).

**La única deuda del proyecto:** las fichas están extraídas de fuentes oficiales **con cita
literal**, pero marcadas "⚠️ Generada por IA — sin verificar". Falta el cotejo humano contra la
fuente — el único paso que ninguna IA puede hacer. Ver [docs/preparar-fichas.md](./docs/preparar-fichas.md).

**Fases del plan:** 0 (esqueleto), 1 (walking skeleton), 2 (cuentas y sync) y 3 (confianza y cierre)
completas. El motor de curación automático (Historia 9 de la spec) se reenfocó a extracción asistida
sin API key, y queda como R2.

🎯 Entrega: primer directo de la Comunidad IÁgil de septiembre.

## Red de seguridad (calidad)

Como se construye 100% por prompts, hay una red que evita que un cambio rompa lo que funcionaba:

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
