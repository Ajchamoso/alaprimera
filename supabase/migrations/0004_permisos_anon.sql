-- Endurecer los permisos del rol anon antes de abrir el repo al público (20/07).
--
-- El repo público publica el esquema: nombres de tabla y de columna dejan de ser un obstáculo.
-- La anon key ya viaja en el JavaScript de la web, así que la única defensa real son los permisos
-- y las políticas. Auditando la BD aparecieron dos puertas abiertas que la app no usa.

-- 1. reportes: la política de alta permitía escribir a cualquiera (`with check (true)`).
-- La app nunca la usa: `reportaError` (app/actions/feedback.ts) escribe con la service role desde
-- una server action, que se salta RLS. Es decir, era un endpoint público de escritura sin dueño:
-- cualquiera podía llenar la tabla desde fuera. Se cierra.
drop policy if exists reportes_crear on reportes;

-- Cinturón y tirantes: aunque la política ya no exista, se acotan los textos. Si algún día se
-- reabre el alta pública (reportar sin cuenta es deseable), el tamaño ya está limitado en la BD y
-- no solo en el código. El 2000 coincide con el recorte que hace `reportaError`.
alter table reportes
  add constraint reportes_descripcion_acotada
    check (char_length(descripcion) between 5 and 2000),
  add constraint reportes_tramite_id_acotado
    check (char_length(tramite_id) <= 120);

-- 2. Permisos de tabla: Supabase concede por defecto ALL (incluido TRUNCATE) al rol anon sobre
-- todo el esquema public. Importa porque **RLS no se aplica a TRUNCATE**: las políticas, por bien
-- escritas que estén, no lo frenan. Hoy no es explotable (PostgREST no expone TRUNCATE por HTTP),
-- pero es un permiso que nadie necesita y que sobreviviría a un descuido futuro con las políticas.
--
-- anon solo tiene que hacer una cosa: leer el catálogo publicado (lib/data/index.ts). Nada más.
-- Se le quita todo y se le devuelve solo esa lectura. El rol authenticated no se toca: lo necesita
-- la sincronización de checklists (lib/sync.ts) y la curación.
revoke all on all tables in schema public from anon;

grant select on tramites, preguntas, opciones, requisitos, requisito_condiciones, prerequisitos
  to anon;

-- Las tablas nuevas también nacerán sin permisos para anon, en lugar de con ALL. Acompaña al
-- event trigger rls_auto_enable, que ya activa RLS sola: una tabla nueva nace cerrada por las dos
-- vías, sin depender de que nadie se acuerde.
alter default privileges in schema public revoke all on tables from anon;
