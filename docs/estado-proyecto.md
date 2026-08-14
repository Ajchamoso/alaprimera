# Estado del proyecto: qué hay y qué falta

Foto a **14/08/2026**, escrita a mano. Los recuentos del catálogo son de esa fecha; el recuento
vivo está en [estado-catalogo.md](./estado-catalogo.md) (generado con `npm run docs`). El QUÉ
completo vive en [spec.md](./spec.md) y el CÓMO en [plan.md](./plan.md).

## Qué funciona ya

- **La ficha personalizada** (pantalla estrella): eliges el trámite, contestas unas pocas
  preguntas (según el trámite) y sale la lista exacta de papeles de tu caso, con veredicto de
  inviabilidad y alternativas cuando no puedes hacerlo tú.
- **Trámites encadenados**: te avisa si antes de este hay que hacer otro, y resuelve la cadena
  completa.
- **Catálogo con 22 fichas publicadas** (estatales, Madrid y Aragón), 2 ya selladas contra su
  fuente, más **22 pendientes visibles "en preparación"** que dan el mapa completo (44 entradas).
- **"Tu zona"**: eliges comunidad una vez, se recuerda, filtra el catálogo y muestra la sección
  "De tu zona" con tus fichas. Si tu comunidad no tiene, te lo dice con honestidad en vez de
  enseñarte la de otra.
- **Búsqueda coloquial** («lo del carnet de mi hijo»), determinista, sin IA en runtime.
- **Sello de verificación con fecha**, que caduca solo a los 90 días.
- **Aviso de plazo** cuando el trámite está fuera de fechas.
- **Checklist imprimible** que funciona sin depender de ninguna API.
- **Progreso guardado en local sin registrarte**; con el correo (enlace mágico, sin contraseñas)
  lo recuperas en otro dispositivo.
- **Compartir por enlace de solo lectura**, **"¿salió a la primera?"** y **reportar error** (con
  buzón para leer lo que llega: `npm run buzon`).
- **112 pruebas automáticas**: 102 de invariantes (regla de oro, wizard, cadenas, zona, sello,
  taxonomía, contraste) y 10 E2E del recorrido completo contra el build de producción, todo en CI
  en cada push y PR.
- **Accesibilidad**: contraste WCAG AA garantizado por test en toda la paleta y axe sobre los
  componentes clave.
- **Documentación que se genera sola** desde los datos, con un test que caza la deriva.

## Qué no hay todavía

- **Más comunidades**: solo Madrid y Aragón tienen fichas propias. Se va comunidad a comunidad
  porque cada una pide cosas distintas y copiar una ficha sería inventárnosla.
- **Verificar el resto del catálogo**: 20 de las 22 fichas siguen "por verificar" (el flujo
  existe; falta el cotejo humano de cada una).
- **Revisión automática de fichas**: hoy la revisión contra la fuente es asistida y a demanda
  (skill `/preparar-ficha` en modo revisar); no hay comprobación programada.
- **Interfaz de administración en la app** para curar fichas (Historia 9 de la spec, aplazada
  a R2).
- **Aviso al usuario cuando cambia un trámite** que estaba gestionando.
- **Pedir un trámite que no está** (hoy solo puedes reportar error sobre los que existen).
- **"Mis trámites"**: guardar una lista de trámites de interés.
- **Multi-idioma**: solo español.

## Aclaraciones que evitan malentendidos

- El login **no usa contraseña a propósito**: enlace mágico al correo (el público es gente
  mayor). No es un hueco por cerrar, es una decisión de producto.
- La **validación humana de fichas ya existe** y es el corazón del producto: toda ficha nace
  "por verificar" y solo el cotejo de una persona la sella (`npm run verificar <slug>`). Lo que
  falta es la interfaz de administración, no el proceso.
- Los E2E corren **contra el build de producción**, no contra la URL desplegada, y emulan Chrome
  de escritorio (la app se diseña móvil primero, pero el test no emula un móvil).
