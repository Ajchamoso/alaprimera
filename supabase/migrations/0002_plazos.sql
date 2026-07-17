-- Ventana de solicitud de un trámite (descubierto al curar las becas, 17/07).
-- Hay trámites que solo se pueden pedir en unas fechas; fuera de plazo, servir
-- una checklist sin avisar es engañar al usuario.

alter table tramites
  add column plazo_inicio date,
  add column plazo_fin    date,
  add column plazo_nota   text;

alter table tramites
  add constraint plazo_coherente check (
    (plazo_inicio is null and plazo_fin is null)
    or (plazo_inicio is not null and plazo_fin is not null and plazo_fin >= plazo_inicio)
  );
