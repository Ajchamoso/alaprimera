-- Familias territoriales: el mismo trámite hecho en sitios distintos.
--
-- Nace de la auditoría del 17/09. `dni-primera-vez` es estatal y apuntaba en
-- duro a `empadronamiento-madrid`, así que a quien vive en Zaragoza le decía
-- "Empadronarse en Madrid" teniendo su ficha en el catálogo. La cita de la
-- fuente era correcta y neutral ("del Ayuntamiento donde la persona solicitante
-- tenga su domicilio"): era el enlace el que inventaba el territorio.
--
-- La solución es que un trámite previo pueda apuntar a una FAMILIA en vez de a
-- una ficha, y que el enlace se resuelva con la zona de quien lee. Así una ficha
-- estatal ya no puede nombrar una local: no tiene dónde escribirlo.

alter table tramites add column familia text;

comment on column tramites.familia is
  'Fichas equivalentes en distintos territorios (empadronamiento-madrid y '
  'empadronamiento-zaragoza comparten familia). Se resuelve por la zona de quien lee.';

-- Solo lo territorial pertenece a una familia: una ficha estatal ya vale para todos.
alter table tramites
  add constraint familia_solo_territorial check (familia is null or nivel <> 'estatal');

-- ── Prerrequisitos: a una ficha o a una familia, nunca a las dos ─────────────
-- La clave primaria era (tramite_id, requiere_tramite_id), que exige columna no
-- nula. Se sustituye por dos únicos parciales, uno por cada tipo de destino.

alter table prerequisitos
  drop constraint prerequisitos_pkey,
  alter column requiere_tramite_id drop not null,
  add column requiere_familia text;

alter table prerequisitos
  add constraint prerequisito_un_solo_destino check (
    (requiere_tramite_id is not null and requiere_familia is null)
    or (requiere_tramite_id is null and requiere_familia is not null)
  );

create unique index prerequisitos_por_ficha
  on prerequisitos (tramite_id, requiere_tramite_id)
  where requiere_tramite_id is not null;
create unique index prerequisitos_por_familia
  on prerequisitos (tramite_id, requiere_familia)
  where requiere_familia is not null;

-- ── Requisitos: mismo destino alternativo ───────────────────────────────────

alter table requisitos add column tramite_previo_familia text;

alter table requisitos
  add constraint requisito_un_solo_previo check (
    tramite_previo_id is null or tramite_previo_familia is null
  );
