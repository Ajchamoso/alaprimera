# Tareas de construcción

> Generadas desde [spec.md](./spec.md) + [plan.md](./plan.md) (Spec Kit: spec → plan → tasks →
> implement). Una tarea = un incremento verificable. Se marcan aquí al completarse.

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

## Fase 4 — Motor de curación (semana 4)

- [ ] **T-021** `/admin` protegido por rol curadora; cola `extraction_jobs`.
- [ ] **T-022** Extracción con Claude API: citas obligatorias por campo, fallo honesto (FR-021/023).
- [ ] **T-023** Revisión split-view + publicar con checklist de cotejo y validación de ciclos (FR-022/026).

## Fase 5 — Contenido + pulido (semanas 3-5, paralelo, humano)

- [ ] **T-024** Curar y verificar las 11 fichas contra fuente oficial (empezando por beca → certificado → DNI).
- [ ] **T-025** E2E del viaje de la demo en CI.
- [ ] **T-026** Ensayo cronometrado de la demo (<3 min) contra producción.
