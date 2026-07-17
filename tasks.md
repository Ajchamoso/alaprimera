# Tareas de construcción

> Generadas desde [spec.md](./spec.md) + [plan.md](./plan.md) (Spec Kit: spec → plan → tasks →
> implement). Una tarea = un incremento verificable. Se marcan aquí al completarse.

**Estado a 17/07/2026:** Fases 0-3 completas y en producción (https://alaprimera.vercel.app), con
identidad visual propia (plan.md §4bis).
Catálogo de 11 fichas extraídas con cita literal. **Deuda única: verificación humana de las 11
fichas** (T-024) — el único paso que no puede hacer una IA. La Fase 4 (motor en la app) se reenfocó
a extracción asistida sin API key (R2). Pendiente de humano además: probar el magic link con un
email real (T-014) y las 4 fichas de la CM confirmar el enlace "firma electrónica reconocida".

## Fase 0 — Esqueleto (semana 1)

- [x] **T-001** Scaffold Next.js 15 + TypeScript + Tailwind, corriendo en local. *Acepta: `npm run dev` sirve la home.* ✅ 16/07
- [x] **T-002** Esquema de BD como migración SQL versionada (todas las tablas del plan §4, RLS incluido). *Escrita; pendiente de aplicarla cuando exista el proyecto Supabase (T-004).* ✅ 16/07
- [x] **T-003** Seed con 2 fichas de prueba encadenadas (Renovación DNI ← Certificado digital FNMT). *Acepta: la cadena ⛓️ es visible en la app.* ✅ 16/07 (seed local en `lib/data/`; migra a BD en Fase 2)
- [x] **T-004a** Proyecto Supabase creado; migración aplicada vía psql y verificada (trigger anti-ciclos ✓, RLS anon ✓); seed en BD con `npm run db:seed`; la app sirve el catálogo desde BD con fallback local e ISR 5 min. ✅ 17/07
- [x] **T-004b** Cuenta Vercel + import del repo + env vars. ✅ 17/07
- [x] **T-005** Deploy a Vercel con URL pública: **https://alaprimera.vercel.app** ✅ 17/07
      *Verificado en producción: home/ficha/cuenta 200 (120 ms), catálogo desde BD, sin fugas de secretos en el HTML, viaje completo (veredicto → vuelta → checklist → marcar → preparación online) en 5,8 s, móvil 375px correcto, redirect de auth apuntando al dominio real.*
      **Requisito del reto cumplido: la app tiene URL pública funcionando.** 🎉

## Fase 1 — Walking skeleton P1 (semanas 1-2)

- [x] **T-006** Catálogo navegable con las fichas publicadas (H1). *Acepta: home lista fichas con nombre coloquial + oficial.* ✅ 16/07
- [x] **T-007** Búsqueda por alias curados con tolerancia básica (H1, FR-002). *Verificado en navegador: "lo del carné de mi hijo" → DNI; "empadronamiento" → mensaje honesto (FR-003).* ✅ 16/07
- [x] **T-008** Wizard de máx. 4 preguntas, la 1ª siempre destinatario (H2, FR-004). *Verificado: "menor+caducidad+sin cambio domicilio" da 4 requisitos y excluye denuncia y empadronamiento; el borrador se retoma sin repetir (H2.4).* ✅ 16/07
- [x] **T-009** Veredicto de inviabilidad con alternativas (H2, FR-005). *Verificado: certificado "para otra persona" → veredicto con alternativas y vuelta atrás, sin checklist.* ✅ 16/07
- [x] **T-010** Checklist personalizada: 4 tipos etiquetados + requisito trámite_previo enlazado + fuente prominente (H3, FR-007..009). ✅ 16/07
- [x] **T-011** Progreso anónimo en localStorage con guardado automático (H4, FR-010/011). *Verificado: marcar 2 → recargar → siguen marcados. Store externo (useSyncExternalStore) con sync entre pestañas.* ✅ 16/07
- [x] **T-012** Elección de canal + "antes de empezar" (online) / "qué llevar" imprimible (presencial) (H5, FR-015/016). *Verificado: canal único → preparación directa sin elección falsa (H5.6); aviso de faltantes (H5.5); imprimible con cabecera de contexto, solo-imprimible vía CSS. El selector de dos vías (EligeCanal) queda pendiente de probar con una ficha de doble canal (la beca).* ✅ 16/07
- [x] **T-013** Multi-checklist con nombre propio (FR-013). *Verificado: "menor" y "para mí (pérdida)" conviven con requisitos distintos y progreso independiente; renombrar disponible.* ✅ 16/07

## Fase 2 — Persistencia real (semana 2)

- [ ] **T-014** Login magic link (Supabase Auth) (FR-011). *Construido y conectado al proyecto real (cliente, middleware, callback, /cuenta); pendiente de probar el ciclo completo pulsando el enlace de un email real — solo el humano puede.*
- [x] **T-015** Merge anónimo→cuenta sin pérdida (FR-012). *Verificado E2E con usuario de prueba confirmado: 3 checklists anónimas subieron a la cuenta con sus marcados intactos; conflicto = gana lo local.* ✅ 17/07
- [x] **T-016** Multi-dispositivo: checklists en BD con RLS (SC-005). *Verificado: localStorage borrado (dispositivo nuevo) → recarga → las 3 checklists bajan con su progreso exacto; marcar con sesión replica a BD al momento. Diseño sync-through: la UI lee siempre local (offline-first), el espejo replica.* ✅ 17/07

## Fase 3 — Confianza + cierre (semana 3) ✅ 17/07

- [x] **T-017** Sello "verificada el DD/MM" con degradación derivada a 90 días (H6, FR-020). *Verificado con fechas reales en BD: a 100 días → "⚠️ Puede estar desactualizada (verificada el 08/04/2026)"; a 10 días → "✅ Verificada el". Los tres estados (sin verificar / vigente / caducada) correctos.*
- [x] **T-018** Compartir por token, solo lectura (H7, FR-014). *Verificado: enlace generado, abierto sin sesión muestra la lista con el progreso real (3 de 4) y sin checkboxes; token inválido → "Esta checklist ya no existe". Token de 128 bits, página `noindex`.*
- [x] **T-019** "¿Salió a la primera?" una vez por checklist (H8, FR-017). *Verificado E2E: el "no" pregunta qué falló, el motivo llega a BD con la checklist como contexto, y no se vuelve a preguntar.*
- [x] **T-020** Reportar error → cola de revisión (FR-018). *Verificado: reporte en BD como `pendiente`; la ficha no cambia hasta revisión humana.*
- [x] **RLS auditada**: con la anon key, `checklists`, `shares`, `feedback` y `reportes` devuelven vacío. Los datos de usuario no se filtran; solo el endpoint del share (service role, server-side) los sirve por token válido.

## Fase 4 — Motor de curación ⟶ **reenfocada el 17/07**

**Decisión:** el motor NO se construye como feature de la app (sin API key). En su lugar, la
extracción se hace **en sesión de Claude Code** y las fichas se vuelcan con `npm run db:seed`.
Mismo flujo que diseñamos (IA extrae con citas → humano verifica → sello), sin pipeline que
mantener, sin coste y más rápido hasta las 11 fichas. Ver [docs/preparar-fichas.md](docs/preparar-fichas.md).

Motivo técnico: la app desplegada corre en Vercel; una suscripción de Claude Code no puede vivir
ahí. La alternativa era una API key, que el equipo descarta.

Coste asumido: la **Historia 9 de la spec** (curadora pega URL en `/admin`) sale del MVP a R2 —
solo compensa a escala de +50 fichas. Las tablas `extraction_jobs` y el rol curadora ya existen en
BD para cuando llegue.

- [x] **T-021/022/023** ⟶ sustituidas por el flujo de curación asistida documentado. ✅ 17/07
      *Probado con fuente real (FNMT): extracción citada correcta, y cazó una invención del seed
      de desarrollo (la "vídeo identificación" era un proceso distinto). Cuando la fuente no
      decía algo, respondió "No especificado en la página" en vez de inventarlo — la regla
      "cita o vacío" (FR-021/023) se cumple.*

## Fase 3bis — Producción y presentación *(17/07, no estaba planificado)*

- [x] **Caída de producción**: 500 MIDDLEWARE_INVOCATION_FAILED en todas las rutas. El código era
      idéntico al que funcionaba y el disparador exacto quedó sin identificar (sin acceso al log de
      Vercel), pero la investigación destapó un fallo de diseño peor: el middleware llamaba a
      Supabase **en cada petición**, incluidas páginas estáticas, así que cualquier hipo tumbaba la
      web entera — contra el principio nº1 del plan. Migrado a `proxy.ts` (convención de Next 16;
      `middleware` está deprecado ahí), envuelto para que **no pueda lanzar nunca**, y acotado a
      `/cuenta` y `/auth/*`. *Verificado: con Supabase apuntando a un host inexistente, la web sirve
      el catálogo con 200 en todo. Ese escenario era un 500.* ✅ 17/07
- [x] **Rediseño: la app dejaba oler a IA.** Auditoría del sitio en vivo: la copia estaba bien, la
      identidad visual era el default que llega solo (emerald-600 sobre stone, ✅ de logo, Geist sin
      tocar, 9 emoji por pantalla, 4 rayas largas, 2 tricolons). Nueva identidad **el sello**: papel
      de expediente, tinta y violeta de sello; el estado se estampa; IBM Plex en tres cortes;
      iconos SVG propios; cero verde. Tokens semánticos en `@theme` → la próxima paleta es un
      bloque de CSS. Ver plan.md §4bis y las reglas 6-9 de AGENTS.md. ✅ 17/07
      - Añadidos **FR-028** (iconos sin depender del sistema: el ⛓️ se rompía) y **FR-029** (estado
        distinguible sin color, para el imprimible en B/N).

## Fase 5 — Contenido + pulido (semanas 3-5, paralelo, humano)

- [ ] **T-024** Curar y verificar las 11 fichas contra fuente oficial (empezando por beca → certificado → DNI).
      **✅ 11 de 11 extraídas con citas el 17/07 — todas ⚠️ pendientes de verificación humana:**
      - [x] Renovación DNI (re-extraída) · DNI primera vez · Pasaporte
      - [x] Certificado de nacimiento · Empadronamiento Madrid
      - [x] Certificado digital FNMT · Cl@ve · Apoderamiento
      - [x] Tarjeta sanitaria · Familia numerosa · Beca comedor Madrid
      - **Cadenas citadas por la fuente**: pasaporte→DNI · DNI primera vez→{certificado nacimiento,
        empadronamiento} · tarjeta sanitaria→empadronamiento · familia numerosa→empadronamiento
      - **El veredicto de Cl@ve es el único citado literalmente**: «no cabe instar registros en
        CL@VE mediante representación por parte de un tercero o apoderado». Corta la cadena
        apoderamiento→Cl@ve, que era justo la salida que ofrecíamos a Marta con su madre.
      - **⚠️ La verificación humana es ahora la única deuda del proyecto.** 11 fichas sin cotejar.
      - [x] **FR-027 (plazos)**: descubierto al curar la beca — su convocatoria cerró el 28/05 y la app
            habría servido una checklist para un trámite no solicitable. Añadido campo `plazo`,
            migración `0002_plazos.sql` y aviso en la ficha.
- [ ] **T-025** E2E del viaje de la demo en CI (Playwright). **Parcial**: la CI ya corre lint +
      tipos + tests + build en cada push (ver Fase 6), pero falta el clic-a-clic del recorrido.
- [ ] **T-026** Ensayo cronometrado de la demo (<3 min) contra producción.

## Fase 6 — Red de seguridad e infraestructura *(17/07, no estaba planificado)*

Como todo se construye por prompts, se montó una red que caza regresiones antes que un humano.

- [x] **T-027** Tests de invariantes (Vitest): regla de oro, wizard, cadenas, aislamiento por zona,
      sello a 90 días (extraído a `lib/sello.ts`), taxonomía. Verificados por mutación.
- [x] **T-028** Accesibilidad: `axe` sobre componentes + contraste WCAG AA de la paleta. Destapó que
      `tinta-tenue` daba 2.2:1; corregido a `#726957`. Guardias: cero emoji (FR-028), color semántico.
- [x] **T-029** CI en GitHub Actions: lint + tipos + tests + build en cada push y PR a `main`.
- [x] **T-030** Skill `/revisar-codigo` de mantenibilidad (encontró y arregló 2 emoji en la UI).
- [x] **T-031** Documentación generada desde los datos (`npm run docs` → `docs/estado-catalogo.md`),
      con test anti-deriva.
- [x] **T-032** Ficha de inscripción de nacimiento curada con cita (arranque de la cadena "nace un
      hijo"). La prestación por nacimiento queda aplazada (seg-social bloquea la extracción).
