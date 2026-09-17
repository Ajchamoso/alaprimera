-- La tabla del limitador crecía sin techo: una fila por sha256(accion|ip) y
-- nadie la borraba nunca (auditoría 17/09). Fuga lenta pero permanente, y de las
-- que solo se notan cuando ya molestan.
--
-- No hace falta un cron: el propio contador aprovecha que ya está escribiendo
-- para barrer unas pocas filas vencidas. Se limita a 50 por llamada para que el
-- coste sea constante y una petición de usuario nunca pague una limpieza larga.

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

  -- Barrido oportunista. Un día cubre de sobra la ventana más larga admitida
  -- (86400 s), así que nada vivo se borra por accidente. Va después de contar:
  -- si algo fallara aquí, el límite ya está aplicado.
  delete from public.limites_accion
  where clave_hash in (
    select clave_hash
    from public.limites_accion
    where ventana_inicio < v_ahora - interval '1 day'
    limit 50
  );

  return v_intentos <= p_limite;
end
$$;

revoke all on function public.consume_limite_accion(text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.consume_limite_accion(text, integer, integer)
  to service_role;

-- Para que el barrido no haga un seq scan de toda la tabla.
create index if not exists limites_accion_ventana_idx
  on public.limites_accion (ventana_inicio);
