-- Arregla la política de lectura de `prerequisitos`, que dejaba invisible todo
-- prerrequisito con destino por FAMILIA.
--
-- La política venía de cuando un prerrequisito apuntaba siempre a una ficha:
-- exigía que `requiere_tramite_id` fuese un trámite publicado. Al introducir las
-- familias territoriales ese campo pasa a ser NULL, el EXISTS da falso y la fila
-- desaparece para `anon`. Efecto visible: el primer DNI dejó de mostrar el
-- empadronamiento en "este trámite esconde otros trámites" —ni enlace ni aviso—,
-- que es justo el contenido que la ficha existe para dar.
--
-- Ahora la comprobación del destino solo se exige cuando hay ficha destino. Un
-- destino por familia no necesita nada más: no nombra ninguna ficha, así que no
-- puede filtrar una sin publicar.

drop policy if exists prerequisitos_publicados on public.prerequisitos;

create policy prerequisitos_publicados
  on public.prerequisitos for select to anon, authenticated
  using (
    exists (
      select 1 from public.tramites as origen
      where origen.id = prerequisitos.tramite_id and origen.estado = 'publicada'
    )
    and (
      prerequisitos.requiere_tramite_id is null
      or exists (
        select 1 from public.tramites as requerido
        where requerido.id = prerequisitos.requiere_tramite_id
          and requerido.estado = 'publicada'
      )
    )
  );
