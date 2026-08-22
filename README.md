# A la Primera

**Tu trámite, con tus papeles.**

[Probar la aplicación](https://alaprimera.vercel.app)

La información oficial de un trámite existe. El problema es descubrir qué necesitas tú para tu
situación concreta antes de llegar a la ventanilla o empezar el formulario.

**A la Primera** te hace unas preguntas sencillas y prepara una checklist personalizada con los
papeles, requisitos técnicos y trámites previos que pueden frenarte. Puedes marcar lo que ya tienes,
guardar el progreso y compartir la lista con tu familia.

La aplicación está pensada para quien termina gestionando los trámites de toda la familia: los
propios, los de sus hijos y, muchas veces, los de sus padres.

## Cómo funciona

1. Busca el trámite con tus propias palabras.
2. Responde un máximo de cuatro preguntas sobre tu caso.
3. Recibe una checklist adaptada a tus respuestas y al canal elegido.
4. Marca lo que ya tienes y continúa otro día sin perder el progreso.

Si un requisito exige completar antes otro trámite, la aplicación muestra la cadena y permite
prepararlo sin perder el camino de vuelta. Si la gestión solo está disponible durante unas fechas,
avisa del estado del plazo antes de mostrar la checklist.

## Pruébala en dos minutos

1. Abre [alaprimera.vercel.app](https://alaprimera.vercel.app).
2. Busca `primer DNI` o entra en **Documentos base**.
3. Elige **El primer DNI de un niño o niña** y personaliza el caso.
4. Crea la checklist, marca varios requisitos y recarga la página para comprobar que se conservan.

También puedes elegir otra zona, preparar la vía online o presencial, imprimir la lista y generar
un enlace de solo lectura para compartirla.

## Información oficial, sin respuestas inventadas

A la Primera no genera requisitos con IA mientras la usa una persona. El camino de la demo no
depende de servicios externos en directo.

Las fichas se preparan a partir de fuentes oficiales y guardan sus citas y enlaces. Nacen marcadas
como **por verificar** y solo reciben el sello con fecha cuando el contenido se coteja contra la
fuente. Los trámites que todavía no tienen ficha aparecen como **en preparación**, sin publicar
requisitos incompletos.

El [estado del catálogo](./docs/estado-catalogo.md) se genera directamente desde los datos y muestra
cuántas fichas hay, cuáles están verificadas y cuáles siguen pendientes.

## Qué aprendimos construyéndola

Llegamos al Viberano con una idea: reunir en un mismo sitio los requisitos de los trámites. Al
construirla descubrimos que una lista genérica no resolvía el problema. Lo difícil era adaptar esa
lista al caso de cada persona, descubrir los trámites escondidos dentro de otros y saber qué
información podía afirmarse con confianza.

También aprendimos que usar IA para construir un producto no elimina la responsabilidad sobre lo
que publica. Por eso separamos la IA del camino del usuario, añadimos citas literales, revisión
humana y una red de pruebas para proteger las reglas del producto.

## Construida con IA

Proyecto del reto **Viberano**, de la Comunidad IÁgil de 233 Academy, creado mediante prompts sin
editar código a mano.

- Desarrollo principal: **Claude Code**.
- Auditoría final, correcciones y documentación: **OpenAI Codex**.
- Datos de los trámites: fuentes oficiales, con revisión antes de conceder el sello.

El historial de Git conserva el proceso de construcción como evidencia del reto.

## Estado y calidad

La aplicación está desplegada en Vercel y el recorrido principal funciona sin llamadas externas en
vivo: catálogo, personalización, checklist, canal y preparación final.

La red de seguridad incluye:

- Tests de reglas de producto, personalización, territorio y cadenas de prerrequisitos.
- Comprobaciones de accesibilidad con axe y contraste WCAG AA.
- Pruebas E2E del recorrido de la demo con Playwright.
- RLS en Supabase y escritura sensible mediante acciones de servidor.
- Documentación del catálogo generada desde los datos para evitar recuentos desactualizados.

## Ejecutar en local

Requisitos: Node.js 22 o posterior y un proyecto de Supabase para probar las funciones persistentes.

```bash
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:3000`.

Variables en `.env.local`:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
```

Comandos principales:

```bash
npm test                 # tests de regresión
npx tsc --noEmit         # comprobación de tipos
npm run lint             # análisis estático
npm run e2e              # recorrido de navegador
npm run docs             # regenera el estado del catálogo
npm run db:seed          # vuelca el catálogo a Supabase
npm run verificar <slug> # registra un cotejo humano
npm run buzon            # consulta feedback y reportes
```

El seed remoto está bloqueado salvo que la ejecución incluya `PERMITIR_SEED_REMOTO=si`. Actualiza
las fichas sin borrar checklists, feedback ni reportes.

## Documentación

- [Especificación del producto](./docs/spec.md): historias y requisitos funcionales.
- [Plan técnico](./docs/plan.md): arquitectura, datos, diseño y decisiones.
- [Tareas y estado](./docs/tasks.md): desglose de la construcción.
- [Estado del catálogo](./docs/estado-catalogo.md): recuento generado desde los datos.
- [Preparación de fichas](./docs/preparar-fichas.md): método de extracción, cotejo y mantenimiento.
- [Discovery](./docs/discovery/README.md): hipótesis, mapa de historias y decisiones descartadas.

## Equipo y licencia

Proyecto de **Alberto Chamoso y Mónica González**.

Código bajo licencia [MIT](./LICENSE). Si reutilizas las fichas de trámites, contrasta siempre su
contenido con la fuente oficial enlazada.
