-- Nivel territorial de un trámite (17/07). Determina a quién sirve la ficha:
-- estatal → todos; autonomico/local → solo su comunidad. "Tu zona" filtra por esto.

alter table tramites
  add column nivel text not null default 'estatal'
    check (nivel in ('estatal', 'autonomico', 'local')),
  add column comunidad text;

-- Coherencia: lo autonómico y lo local pertenecen a una comunidad; lo estatal, a nadie.
alter table tramites
  add constraint nivel_comunidad_coherente check (
    (nivel = 'estatal' and comunidad is null)
    or (nivel in ('autonomico', 'local') and comunidad is not null)
  );
