-- A la Primera — esquema inicial (plan.md §4)
-- Aplica limpio sobre un proyecto Supabase vacío.

create extension if not exists "pgcrypto";

-- ── Fichas ──────────────────────────────────────────────────────────────────

create table tramites (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  nombre_oficial  text not null,
  nombre_coloquial text not null,
  descripcion     text not null,
  organismo       text not null,
  territorio      text not null default 'España',
  canales         text[] not null check (canales <@ array['online','presencial']),
  url_fuente      text not null,
  url_cita_previa text,
  estado          text not null default 'borrador' check (estado in ('publicada','borrador')),
  verificada_en   timestamptz,
  generada_por_ia boolean not null default false,
  alias           text[] not null default '{}',
  creada_en       timestamptz not null default now()
);

create table prerequisitos (
  tramite_id          uuid not null references tramites(id) on delete cascade,
  requiere_tramite_id uuid not null references tramites(id) on delete cascade,
  nota                text,
  primary key (tramite_id, requiere_tramite_id),
  check (tramite_id <> requiere_tramite_id)
);

create table preguntas (
  id         uuid primary key default gen_random_uuid(),
  tramite_id uuid not null references tramites(id) on delete cascade,
  orden      smallint not null check (orden between 1 and 4),
  texto      text not null,
  tipo       text not null default 'normal' check (tipo in ('destinatario','normal')),
  unique (tramite_id, orden)
);

create table opciones (
  id                 uuid primary key default gen_random_uuid(),
  pregunta_id        uuid not null references preguntas(id) on delete cascade,
  texto              text not null,
  veredicto_inviable boolean not null default false,
  texto_alternativas text
);

create table requisitos (
  id          uuid primary key default gen_random_uuid(),
  tramite_id  uuid not null references tramites(id) on delete cascade,
  tipo        text not null check (tipo in ('doc_fisico','doc_digital','tecnico','tramite_previo')),
  titulo      text not null,
  explicacion text not null,
  canal       text not null default 'ambos' check (canal in ('online','presencial','ambos')),
  orden       smallint not null default 0
);

-- El requisito aplica si el usuario eligió alguna de estas opciones (sin filas = aplica siempre)
create table requisito_condiciones (
  requisito_id uuid not null references requisitos(id) on delete cascade,
  opcion_id    uuid not null references opciones(id) on delete cascade,
  primary key (requisito_id, opcion_id)
);

-- ── Estado del usuario ───────────────────────────────────────────────────────

create table profiles (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  es_curadora boolean not null default false
);

create table checklists (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade,
  tramite_id    uuid not null references tramites(id) on delete cascade,
  nombre        text not null,
  respuestas    jsonb not null default '{}',
  canal_elegido text check (canal_elegido in ('online','presencial')),
  creada_en     timestamptz not null default now()
);

create table checklist_items (
  checklist_id uuid not null references checklists(id) on delete cascade,
  requisito_id uuid not null references requisitos(id) on delete cascade,
  marcado      boolean not null default false,
  marcado_en   timestamptz,
  primary key (checklist_id, requisito_id)
);

create table shares (
  token        text primary key,
  checklist_id uuid not null references checklists(id) on delete cascade,
  creado_en    timestamptz not null default now()
);

create table feedback (
  id                  uuid primary key default gen_random_uuid(),
  checklist_id        uuid not null references checklists(id) on delete cascade unique,
  salio_a_la_primera  boolean not null,
  comentario          text,
  que_fallo           text,
  creado_en           timestamptz not null default now()
);

create table reportes (
  id          uuid primary key default gen_random_uuid(),
  tramite_id  uuid not null references tramites(id) on delete cascade,
  descripcion text not null,
  estado      text not null default 'pendiente' check (estado in ('pendiente','revisado')),
  creado_en   timestamptz not null default now()
);

-- ── Motor de curación ────────────────────────────────────────────────────────

create table extraction_jobs (
  id           uuid primary key default gen_random_uuid(),
  url          text,
  texto_pegado text,
  estado       text not null default 'pendiente'
               check (estado in ('pendiente','procesando','listo','fallido')),
  error        text,
  borrador     jsonb,
  creado_por   uuid references auth.users(id),
  creado_en    timestamptz not null default now(),
  check (url is not null or texto_pegado is not null)
);

-- ── RLS ──────────────────────────────────────────────────────────────────────

alter table tramites enable row level security;
alter table prerequisitos enable row level security;
alter table preguntas enable row level security;
alter table opciones enable row level security;
alter table requisitos enable row level security;
alter table requisito_condiciones enable row level security;
alter table profiles enable row level security;
alter table checklists enable row level security;
alter table checklist_items enable row level security;
alter table shares enable row level security;
alter table feedback enable row level security;
alter table reportes enable row level security;
alter table extraction_jobs enable row level security;

create function es_curadora() returns boolean language sql stable security definer as
  $$ select coalesce((select p.es_curadora from profiles p where p.user_id = auth.uid()), false) $$;

-- Contenido publicado: lectura pública. Borradores: solo curadoras.
create policy tramites_lectura on tramites for select
  using (estado = 'publicada' or es_curadora());
create policy tramites_curacion on tramites for all
  using (es_curadora()) with check (es_curadora());

create policy prerequisitos_lectura on prerequisitos for select using (true);
create policy preguntas_lectura on preguntas for select using (true);
create policy opciones_lectura on opciones for select using (true);
create policy requisitos_lectura on requisitos for select using (true);
create policy condiciones_lectura on requisito_condiciones for select using (true);
create policy prerequisitos_curacion on prerequisitos for all using (es_curadora()) with check (es_curadora());
create policy preguntas_curacion on preguntas for all using (es_curadora()) with check (es_curadora());
create policy opciones_curacion on opciones for all using (es_curadora()) with check (es_curadora());
create policy requisitos_curacion on requisitos for all using (es_curadora()) with check (es_curadora());
create policy condiciones_curacion on requisito_condiciones for all using (es_curadora()) with check (es_curadora());

create policy profiles_propio on profiles for select using (user_id = auth.uid());

-- Checklists: solo el dueño (el acceso por share va por endpoint con service role)
create policy checklists_dueno on checklists for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy items_dueno on checklist_items for all
  using (exists (select 1 from checklists c where c.id = checklist_id and c.user_id = auth.uid()))
  with check (exists (select 1 from checklists c where c.id = checklist_id and c.user_id = auth.uid()));

create policy shares_dueno on shares for all
  using (exists (select 1 from checklists c where c.id = checklist_id and c.user_id = auth.uid()))
  with check (exists (select 1 from checklists c where c.id = checklist_id and c.user_id = auth.uid()));

create policy feedback_dueno on feedback for all
  using (exists (select 1 from checklists c where c.id = checklist_id and c.user_id = auth.uid()))
  with check (exists (select 1 from checklists c where c.id = checklist_id and c.user_id = auth.uid()));

create policy reportes_crear on reportes for insert with check (true);
create policy reportes_curacion on reportes for select using (es_curadora());

create policy jobs_curacion on extraction_jobs for all
  using (es_curadora()) with check (es_curadora());

-- ── Validación de ciclos en prerrequisitos (FR-026) ─────────────────────────

create function valida_prerequisito_sin_ciclo() returns trigger language plpgsql as $$
begin
  if exists (
    with recursive cadena as (
      select new.requiere_tramite_id as tid
      union
      select p.requiere_tramite_id from prerequisitos p join cadena c on p.tramite_id = c.tid
    )
    select 1 from cadena where tid = new.tramite_id
  ) then
    raise exception 'Cadena de prerrequisitos circular: % ya depende de %', new.requiere_tramite_id, new.tramite_id;
  end if;
  return new;
end $$;

create trigger prerequisitos_sin_ciclos
  before insert or update on prerequisitos
  for each row execute function valida_prerequisito_sin_ciclo();
