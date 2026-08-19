-- Protege los datos creados por usuarios frente a cambios del catálogo y limita
-- la superficie pública de las políticas y funciones.

-- Las fichas son datos maestros. Borrarlas nunca debe arrastrar datos de usuario.
alter table public.checklists
  drop constraint if exists checklists_tramite_id_fkey,
  add constraint checklists_tramite_id_fkey
    foreign key (tramite_id) references public.tramites(id) on delete restrict;

alter table public.reportes
  drop constraint if exists reportes_tramite_id_fkey,
  add constraint reportes_tramite_id_fkey
    foreign key (tramite_id) references public.tramites(id) on delete restrict;

alter table public.checklists
  add constraint checklists_nombre_acotado
    check (char_length(btrim(nombre)) between 1 and 120),
  add constraint checklists_respuestas_objeto
    check (jsonb_typeof(respuestas) = 'object'),
  add constraint checklists_marcados_objeto
    check (jsonb_typeof(marcados) = 'object');

alter table public.feedback
  add constraint feedback_que_fallo_acotado
    check (que_fallo is null or char_length(que_fallo) <= 2000);

-- Índices para claves foráneas, joins de políticas y búsquedas por propietario.
create index if not exists prerequisitos_requerido_idx
  on public.prerequisitos (requiere_tramite_id);
create index if not exists opciones_pregunta_idx
  on public.opciones (pregunta_id);
create index if not exists requisitos_tramite_idx
  on public.requisitos (tramite_id);
create index if not exists requisitos_previo_idx
  on public.requisitos (tramite_previo_id)
  where tramite_previo_id is not null;
create index if not exists condiciones_opcion_idx
  on public.requisito_condiciones (opcion_id);
create index if not exists checklists_usuario_idx
  on public.checklists (user_id)
  where user_id is not null;
create index if not exists checklists_tramite_idx
  on public.checklists (tramite_id);
create index if not exists shares_checklist_idx
  on public.shares (checklist_id);
create index if not exists reportes_tramite_idx
  on public.reportes (tramite_id);
create index if not exists extraction_jobs_creador_idx
  on public.extraction_jobs (creado_por)
  where creado_por is not null;

-- El helper de curación no se expone en el esquema de la API. Usa nombres
-- cualificados y un search_path vacío porque eleva privilegios.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.es_curadora()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (
      select p.es_curadora
      from public.profiles as p
      where p.user_id = (select auth.uid())
    ),
    false
  )
$$;

revoke all on function private.es_curadora() from public, anon;
grant execute on function private.es_curadora() to authenticated;

-- Las funciones de trigger tampoco necesitan estar en el esquema expuesto.
alter function public.valida_prerequisito_sin_ciclo() set schema private;
revoke all on function private.valida_prerequisito_sin_ciclo()
  from public, anon, authenticated, service_role;

-- Este event trigger se creó directamente al configurar el proyecto y puede no
-- existir en una instalación nueva del repo. Si existe, se conserva por OID.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'alter function public.rls_auto_enable() set schema private';
    execute 'revoke all on function private.rls_auto_enable() from public, anon, authenticated, service_role';
  end if;
end
$$;

-- Se sustituyen las políticas permisivas. Las tablas hijas solo son públicas
-- cuando su ficha padre también está publicada.
drop policy if exists tramites_lectura on public.tramites;
drop policy if exists tramites_curacion on public.tramites;
drop policy if exists prerequisitos_lectura on public.prerequisitos;
drop policy if exists prerequisitos_curacion on public.prerequisitos;
drop policy if exists preguntas_lectura on public.preguntas;
drop policy if exists preguntas_curacion on public.preguntas;
drop policy if exists opciones_lectura on public.opciones;
drop policy if exists opciones_curacion on public.opciones;
drop policy if exists requisitos_lectura on public.requisitos;
drop policy if exists requisitos_curacion on public.requisitos;
drop policy if exists condiciones_lectura on public.requisito_condiciones;
drop policy if exists condiciones_curacion on public.requisito_condiciones;
drop policy if exists profiles_propio on public.profiles;
drop policy if exists checklists_dueno on public.checklists;
drop policy if exists shares_dueno on public.shares;
drop policy if exists feedback_dueno on public.feedback;
drop policy if exists reportes_curacion on public.reportes;
drop policy if exists jobs_curacion on public.extraction_jobs;

create policy tramites_publicados
  on public.tramites for select to anon, authenticated
  using (estado = 'publicada');
create policy tramites_curacion
  on public.tramites for all to authenticated
  using ((select private.es_curadora()))
  with check ((select private.es_curadora()));

create policy prerequisitos_publicados
  on public.prerequisitos for select to anon, authenticated
  using (
    exists (
      select 1 from public.tramites as origen
      where origen.id = prerequisitos.tramite_id and origen.estado = 'publicada'
    )
    and exists (
      select 1 from public.tramites as requerido
      where requerido.id = prerequisitos.requiere_tramite_id and requerido.estado = 'publicada'
    )
  );
create policy prerequisitos_curacion
  on public.prerequisitos for all to authenticated
  using ((select private.es_curadora()))
  with check ((select private.es_curadora()));

create policy preguntas_publicadas
  on public.preguntas for select to anon, authenticated
  using (
    exists (
      select 1 from public.tramites as t
      where t.id = preguntas.tramite_id and t.estado = 'publicada'
    )
  );
create policy preguntas_curacion
  on public.preguntas for all to authenticated
  using ((select private.es_curadora()))
  with check ((select private.es_curadora()));

create policy opciones_publicadas
  on public.opciones for select to anon, authenticated
  using (
    exists (
      select 1
      from public.preguntas as p
      join public.tramites as t on t.id = p.tramite_id
      where p.id = opciones.pregunta_id and t.estado = 'publicada'
    )
  );
create policy opciones_curacion
  on public.opciones for all to authenticated
  using ((select private.es_curadora()))
  with check ((select private.es_curadora()));

create policy requisitos_publicados
  on public.requisitos for select to anon, authenticated
  using (
    exists (
      select 1 from public.tramites as t
      where t.id = requisitos.tramite_id and t.estado = 'publicada'
    )
  );
create policy requisitos_curacion
  on public.requisitos for all to authenticated
  using ((select private.es_curadora()))
  with check ((select private.es_curadora()));

create policy condiciones_publicadas
  on public.requisito_condiciones for select to anon, authenticated
  using (
    exists (
      select 1
      from public.requisitos as r
      join public.tramites as t on t.id = r.tramite_id
      where r.id = requisito_condiciones.requisito_id and t.estado = 'publicada'
    )
    and exists (
      select 1
      from public.opciones as o
      join public.preguntas as p on p.id = o.pregunta_id
      join public.tramites as t on t.id = p.tramite_id
      where o.id = requisito_condiciones.opcion_id and t.estado = 'publicada'
    )
  );
create policy condiciones_curacion
  on public.requisito_condiciones for all to authenticated
  using ((select private.es_curadora()))
  with check ((select private.es_curadora()));

create policy profiles_propio
  on public.profiles for select to authenticated
  using (user_id = (select auth.uid()));

create policy checklists_dueno
  on public.checklists for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy shares_dueno
  on public.shares for all to authenticated
  using (
    exists (
      select 1 from public.checklists as c
      where c.id = shares.checklist_id and c.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.checklists as c
      where c.id = shares.checklist_id and c.user_id = (select auth.uid())
    )
  );

create policy feedback_dueno
  on public.feedback for all to authenticated
  using (
    exists (
      select 1 from public.checklists as c
      where c.id = feedback.checklist_id and c.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.checklists as c
      where c.id = feedback.checklist_id and c.user_id = (select auth.uid())
    )
  );

create policy reportes_curacion
  on public.reportes for select to authenticated
  using ((select private.es_curadora()));
create policy jobs_curacion
  on public.extraction_jobs for all to authenticated
  using ((select private.es_curadora()))
  with check ((select private.es_curadora()));

drop function if exists public.es_curadora();

-- Único camino de service role para crear, reclamar o actualizar instantáneas.
-- Una checklist con dueño nunca puede quedar anónima ni pasar a otra cuenta.
create or replace function public.guarda_checklists(
  p_user_id uuid,
  p_checklists jsonb
)
returns setof public.checklists
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_guardadas integer;
  v_esperadas integer;
begin
  if jsonb_typeof(p_checklists) <> 'array' then
    raise exception 'p_checklists debe ser un array';
  end if;

  v_esperadas := jsonb_array_length(p_checklists);
  if v_esperadas > 100 then
    raise exception 'Demasiadas checklists en una sola operación';
  end if;
  if v_esperadas = 0 then
    return;
  end if;

  return query
    insert into public.checklists (
      id,
      user_id,
      tramite_id,
      nombre,
      respuestas,
      marcados,
      canal_elegido,
      creada_en,
      actualizada_en
    )
    select
      entrada.id,
      p_user_id,
      entrada.tramite_id,
      entrada.nombre,
      entrada.respuestas,
      entrada.marcados,
      entrada.canal_elegido,
      entrada.creada_en,
      clock_timestamp()
    from jsonb_to_recordset(p_checklists) as entrada(
      id uuid,
      tramite_id text,
      nombre text,
      respuestas jsonb,
      marcados jsonb,
      canal_elegido text,
      creada_en timestamptz
    )
    on conflict (id) do update set
      user_id = coalesce(checklists.user_id, excluded.user_id),
      tramite_id = excluded.tramite_id,
      nombre = excluded.nombre,
      respuestas = excluded.respuestas,
      marcados = excluded.marcados,
      canal_elegido = excluded.canal_elegido,
      actualizada_en = clock_timestamp()
    where checklists.user_id is null or checklists.user_id = excluded.user_id
    returning checklists.*;

  get diagnostics v_guardadas = row_count;
  if v_guardadas <> v_esperadas then
    raise exception 'Una checklist ya pertenece a otra cuenta';
  end if;
end
$$;

revoke all on function public.guarda_checklists(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.guarda_checklists(uuid, jsonb) to service_role;

-- Contador atómico para limitar las Server Actions públicas sin confiar en memoria local.
create table public.limites_accion (
  clave_hash text primary key check (char_length(clave_hash) = 64),
  ventana_inicio timestamptz not null,
  intentos integer not null check (intentos > 0)
);

alter table public.limites_accion enable row level security;
revoke all on table public.limites_accion from anon, authenticated;
grant select, insert, update, delete on table public.limites_accion to service_role;

create or replace function public.consume_limite_accion(
  p_clave_hash text,
  p_limite integer,
  p_ventana_segundos integer
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_ahora timestamptz := clock_timestamp();
  v_intentos integer;
begin
  if char_length(p_clave_hash) <> 64 then
    raise exception 'Clave de límite no válida';
  end if;
  if p_limite < 1 or p_limite > 10000 then
    raise exception 'Límite no válido';
  end if;
  if p_ventana_segundos < 1 or p_ventana_segundos > 86400 then
    raise exception 'Ventana no válida';
  end if;

  insert into public.limites_accion as limite (clave_hash, ventana_inicio, intentos)
  values (p_clave_hash, v_ahora, 1)
  on conflict (clave_hash) do update set
    ventana_inicio = case
      when limite.ventana_inicio <= v_ahora - make_interval(secs => p_ventana_segundos)
        then v_ahora
      else limite.ventana_inicio
    end,
    intentos = case
      when limite.ventana_inicio <= v_ahora - make_interval(secs => p_ventana_segundos)
        then 1
      else limite.intentos + 1
    end
  returning intentos into v_intentos;

  return v_intentos <= p_limite;
end
$$;

revoke all on function public.consume_limite_accion(text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.consume_limite_accion(text, integer, integer)
  to service_role;

-- Las funciones nuevas no vuelven a quedar ejecutables por PUBLIC por defecto.
alter default privileges in schema public revoke execute on functions from public;
