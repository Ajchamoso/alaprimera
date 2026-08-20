-- FR-003: una búsqueda sin resultado puede dejar señal sin abrir escritura a anon.
create table public.peticiones_catalogo (
  id uuid primary key default gen_random_uuid(),
  consulta text not null check (char_length(btrim(consulta)) between 2 and 200),
  comunidad text check (comunidad is null or char_length(comunidad) between 2 and 40),
  estado text not null default 'pendiente' check (estado in ('pendiente', 'revisada')),
  creado_en timestamptz not null default now()
);

alter table public.peticiones_catalogo enable row level security;
revoke all on table public.peticiones_catalogo from anon, authenticated;
grant select, insert, update, delete on table public.peticiones_catalogo to service_role;

create index peticiones_catalogo_pendientes_idx
  on public.peticiones_catalogo (creado_en desc)
  where estado = 'pendiente';
