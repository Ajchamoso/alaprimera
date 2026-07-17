import type { TramiteContenido } from "@/lib/types";

/**
 * Fichas del catálogo.
 *
 * ⚠️ REGLA DE ORO (FR-019): el contenido sale de la fuente oficial, nunca de la
 * memoria de un modelo. Cada requisito lleva su cita literal dentro de su
 * `explicacion`, precedida de "Fuente:".
 *
 * Aquí solo va CONTENIDO. Quién ha verificado cada ficha y cuándo vive en el
 * registro (`verificaciones.ts`): una ficha que no esté allí sale como "generada
 * por IA — sin verificar", que es la verdad hasta que alguien la coteje.
 *
 * Flujo de curación: se extrae de la fuente con IA (con cita obligatoria; sin
 * cita, el campo va vacío) → se vuelca a BD con `npm run db:seed` → una persona
 * revisa y sella. Ver docs/curacion.md.
 */
export const tramites: TramiteContenido[] = [
  // ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
  {
    slug: "renovacion-dni",
    nivel: "estatal",
    nombreOficial: "Renovación del DNI",
    nombreColoquial: "Renovar el carnet de identidad",
    descripcion:
      "Renovar el DNI cuando está caducado o a punto de caducar, se ha deteriorado o has perdido el anterior. Hay que ir en persona y con cita previa a una oficina de expedición.",
    organismo: "Policía Nacional (Ministerio del Interior)",
    territorio: "España",
    canales: ["presencial"],
    urlFuente: "https://www.dnielectronico.es/PortalDNIe/PRF1_Cons02.action?pag=REF_420&id_menu=7_8",
    urlCitaPrevia: "https://www.citapreviadnie.es/",
    alias: ["dni", "carnet", "carné", "carnet de identidad", "documento de identidad", "renovar dni"],
    preguntas: [
      {
        id: "dni-p1",
        orden: 1,
        texto: "¿Para quién es la renovación?",
        tipo: "destinatario",
        opciones: [
          { id: "dni-p1-yo", texto: "Para mí" },
          { id: "dni-p1-menor", texto: "Para un menor a mi cargo" },
          {
            id: "dni-p1-adulto",
            texto: "Para otra persona adulta (mi madre, mi padre…)",
            veredictoInviable: true,
            textoAlternativas:
              "El DNI es personal y no puedes renovarlo tú por ella. Fuente: «para solicitar la renovación del Documento Nacional de Identidad será imprescindible la presencia física de la persona». Lo que sí puedes hacer: pedirle tú la cita previa, prepararle esta checklist y acompañarla el día de la cita.",
          },
        ],
      },
      {
        id: "dni-p2",
        orden: 2,
        texto: "¿Por qué motivo lo renuevas?",
        tipo: "normal",
        opciones: [
          { id: "dni-p2-caducidad", texto: "Caducado o a punto de caducar" },
          { id: "dni-p2-perdida", texto: "Pérdida o robo" },
          { id: "dni-p2-deterioro", texto: "Deterioro" },
        ],
      },
      {
        id: "dni-p3",
        orden: 3,
        texto: "¿Has cambiado de domicilio desde el último DNI?",
        tipo: "normal",
        opciones: [
          { id: "dni-p3-si", texto: "Sí" },
          { id: "dni-p3-no", texto: "No" },
        ],
      },
      {
        id: "dni-p4",
        orden: 4,
        texto: "¿Ha cambiado algún dato personal (nombre, apellidos, estado civil)?",
        tipo: "normal",
        opciones: [
          { id: "dni-p4-si", texto: "Sí" },
          { id: "dni-p4-no", texto: "No" },
        ],
      },
    ],
    requisitos: [
      {
        id: "dni-r1",
        tipo: "doc_fisico",
        titulo: "Una fotografía de 32×26 mm, de menos de 2 años",
        explicacion:
          "Fuente: «32 por 26 milímetros, con fondo uniforme blanco y liso, tomada de frente, con la cabeza totalmente descubierta y sin gafas de cristales oscuros o cualquier otra prenda que pueda impedir o dificultar la identificación de la persona», con antigüedad «máxima de 2 años». Se admiten prendas de cabeza por motivos religiosos o médicos si dejan descubierto el óvalo del rostro, y gafas oscuras a personas invidentes.",
        canal: "presencial",
      },
      {
        id: "dni-r2",
        tipo: "doc_fisico",
        titulo: "El DNI que vas a renovar",
        explicacion: "Se entrega en el momento de la renovación.",
        canal: "presencial",
        soloSiOpciones: ["dni-p2-caducidad", "dni-p2-deterioro"],
      },
      {
        id: "dni-r3",
        tipo: "doc_fisico",
        titulo: "La denuncia por pérdida o robo",
        explicacion:
          "Fuente: en casos de pérdida o robo debe presentarse denuncia ante oficina policial o unidad de documentación.",
        canal: "presencial",
        soloSiOpciones: ["dni-p2-perdida"],
      },
      {
        id: "dni-r4",
        tipo: "doc_fisico",
        titulo: "Certificado de empadronamiento de menos de 3 meses",
        explicacion:
          "Para actualizar la dirección. Fuente: certificado de empadronamiento con máximo 3 meses de antigüedad, o consulta al padrón municipal.",
        canal: "presencial",
        soloSiOpciones: ["dni-p3-si"],
      },
      {
        id: "dni-r5",
        tipo: "doc_fisico",
        titulo: "Certificado del Registro Civil de menos de 6 meses",
        explicacion:
          "Solo si cambian tus datos personales. Fuente: certificado del Registro Civil con máximo 6 meses de antigüedad.",
        canal: "presencial",
        soloSiOpciones: ["dni-p4-si"],
      },
      {
        id: "dni-r6",
        tipo: "doc_fisico",
        titulo: "La tasa: 12 € (efectivo o tarjeta)",
        explicacion:
          "Fuente: la tasa «se actualiza mediante la Ley de Presupuestos Generales del Estado, estando actualmente fijada en 12 euros, pudiéndose realizar el pago en las Unidades de Documentación en efectivo o mediante tarjeta bancaria», o por internet al pedir la cita. Es gratis si renuevas solo por cambio de datos con el DNI en vigor, o si acreditas familia numerosa.",
        canal: "presencial",
      },
      {
        id: "dni-r7",
        tipo: "doc_fisico",
        titulo: "El DNI de quien acompaña al menor",
        explicacion:
          "Fuente: los menores deben acudir acompañados por quien tenga patria potestad o tutela, presentando «su DNI, Tarjeta de Identificación de Extranjero (TIE) o Certificado de Registro de Ciudadano de la Unión». Ojo: lo que se presenta es el documento del adulto, no el libro de familia.",
        canal: "presencial",
        soloSiOpciones: ["dni-p1-menor"],
      },
      {
        id: "dni-r8",
        tipo: "doc_fisico",
        titulo: "Cita previa pedida",
        explicacion:
          "Fuente: «previa petición de cita previa por teléfono en el número 060, o por Internet en la página Web: www.citapreviadnie.es».",
        canal: "presencial",
      },
    ],
    prerequisitos: [],
  },

  // ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
  {
    slug: "dni-primera-vez",
    nivel: "estatal",
    nombreOficial: "Primera inscripción del DNI",
    nombreColoquial: "El primer DNI (de un niño o niña)",
    descripcion:
      "Sacar el DNI por primera vez. Hay que ir en persona con cita previa, y trae dos trámites escondidos: el certificado de nacimiento del Registro Civil y el empadronamiento. Los dos caducan.",
    organismo: "Policía Nacional (Ministerio del Interior)",
    territorio: "España",
    canales: ["presencial"],
    urlFuente: "https://www.dnielectronico.es/PortalDNIe/PRF1_Cons02.action?pag=REF_410",
    urlCitaPrevia: "https://www.citapreviadnie.es/",
    alias: [
      "primer dni",
      "dni primera vez",
      "dni de mi hijo",
      "sacar el dni",
      "primera inscripcion",
      "dni niño",
    ],
    preguntas: [
      {
        id: "dni1-p1",
        orden: 1,
        texto: "¿Para quién es el primer DNI?",
        tipo: "destinatario",
        opciones: [
          { id: "dni1-p1-menor", texto: "Para un menor a mi cargo" },
          { id: "dni1-p1-yo", texto: "Para mí" },
          {
            id: "dni1-p1-adulto",
            texto: "Para otra persona adulta",
            veredictoInviable: true,
            textoAlternativas:
              "El DNI es personal: la fuente exige «la presencia física de la persona a quien se haya de expedir». No puedes sacarlo tú por otra persona adulta. Sí puedes pedirle la cita, prepararle la lista y acompañarla.",
          },
        ],
      },
      {
        id: "dni1-p2",
        orden: 2,
        texto: "¿Dónde reside la persona?",
        tipo: "normal",
        opciones: [
          { id: "dni1-p2-espana", texto: "En España" },
          { id: "dni1-p2-extranjero", texto: "En el extranjero" },
        ],
      },
      {
        id: "dni1-p3",
        orden: 3,
        texto: "¿Es una primera inscripción por nacionalización?",
        tipo: "normal",
        opciones: [
          { id: "dni1-p3-no", texto: "No" },
          { id: "dni1-p3-si", texto: "Sí, tengo TIE o Certificado de Registro con NIE" },
        ],
      },
    ],
    requisitos: [
      {
        id: "dni1-r1",
        tipo: "tramite_previo",
        titulo: "Certificación literal de nacimiento (menos de 6 meses)",
        explicacion:
          "Ojo: tiene que pedirse expresamente para esto. Fuente: «Certificación literal de nacimiento (emitida solo a efectos de la obtención del Documento Nacional de Identidad) expedida por el Registro Civil […] con una antelación máxima de seis meses a la fecha de presentación».",
        canal: "presencial",
        tramitePrevioSlug: "certificado-nacimiento",
      },
      {
        id: "dni1-r2",
        tipo: "tramite_previo",
        titulo: "Certificado o volante de empadronamiento (menos de 3 meses)",
        explicacion:
          "Fuente: «Certificado o volante de empadronamiento del Ayuntamiento donde la persona solicitante tenga su domicilio, expedido con una antelación máxima de tres meses a la fecha de la tramitación».",
        canal: "presencial",
        tramitePrevioSlug: "empadronamiento-madrid",
        soloSiOpciones: ["dni1-p2-espana"],
      },
      {
        id: "dni1-r3",
        tipo: "doc_fisico",
        titulo: "Certificación del consulado (si residís fuera de España)",
        explicacion:
          "Fuente: «Las personas con nacionalidad española residentes en el extranjero acreditarán el domicilio mediante certificación de la Representación Diplomática o Consular donde estén inscritos como residentes, expedida con una antelación máxima de tres meses».",
        canal: "presencial",
        soloSiOpciones: ["dni1-p2-extranjero"],
      },
      {
        id: "dni1-r4",
        tipo: "doc_fisico",
        titulo: "Una fotografía de 32×26 mm, de menos de 2 años",
        explicacion:
          "Fuente: «tamaño 32 por 26 milímetros, con fondo uniforme blanco y liso, tomada de frente, con la cabeza totalmente descubierta y sin gafas de cristales oscuros», con «antigüedad máxima de 2 años». Se admiten prendas de cabeza por motivos religiosos o médicos si dejan descubierto el óvalo del rostro.",
        canal: "presencial",
      },
      {
        id: "dni1-r5",
        tipo: "doc_fisico",
        titulo: "El DNI de quien acompaña al menor",
        explicacion:
          "Fuente: se hará «en presencia de quien tenga encomendada la patria potestad o tutela […] el cual deberá aportar su DNI, Tarjeta de Identificación de Extranjero (TIE) o Certificado de Registro de Ciudadano de la Unión». Ojo: aquí la fuente habla en singular. A diferencia del pasaporte, NO exige el consentimiento de ambos progenitores.",
        canal: "presencial",
        soloSiOpciones: ["dni1-p1-menor"],
      },
      {
        id: "dni1-r6",
        tipo: "doc_fisico",
        titulo: "Tu TIE o Certificado de Registro con el NIE",
        explicacion:
          "Fuente: en primera inscripción como nacionalizado con TIE o Certificado de Registro donde conste el NIE, «deberá aportarlo, como requisito indispensable, en el momento de la tramitación».",
        canal: "presencial",
        soloSiOpciones: ["dni1-p3-si"],
      },
      {
        id: "dni1-r7",
        tipo: "doc_fisico",
        titulo: "La tasa: 12 € (efectivo o tarjeta)",
        explicacion:
          "Fuente: la tasa está «actualmente fijada en 12 euros, pudiéndose realizar el pago en las Unidades de Documentación en efectivo o mediante tarjeta bancaria», o por internet al pedir la cita. Gratis si acreditáis familia numerosa, y para menores de 14 años en unidad de convivencia con ingreso mínimo vital.",
        canal: "presencial",
      },
      {
        id: "dni1-r8",
        tipo: "doc_fisico",
        titulo: "Cita previa pedida",
        explicacion:
          "Fuente: «la tramitación del Documento Nacional de Identidad se realizará con la presencia física de la persona, a través de los sistemas de cita previa».",
        canal: "presencial",
      },
    ],
    prerequisitos: [
      { slug: "certificado-nacimiento", nota: "Pídelo «a los solos efectos» del DNI: caduca a los 6 meses." },
      { slug: "empadronamiento-madrid", nota: "El certificado caduca a los 3 meses." },
    ],
  },

  // ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
  {
    slug: "pasaporte",
    nivel: "estatal",
    nombreOficial: "Pasaporte ordinario",
    nombreColoquial: "El pasaporte",
    descripcion:
      "Sacar o renovar el pasaporte. Se hace en persona con cita previa. Para menores hace falta el consentimiento de TODAS las personas con patria potestad, no solo de quien tiene la custodia.",
    organismo: "Policía Nacional (Ministerio del Interior)",
    territorio: "España",
    canales: ["presencial"],
    urlFuente: "https://www.dnielectronico.es/PortalDNIe/PRF1_Cons02.action?pag=REF_1084",
    urlCitaPrevia: "https://www.citapreviadnie.es/",
    alias: ["pasaporte", "renovar pasaporte", "sacar pasaporte", "pasaporte de mi hijo"],
    preguntas: [
      {
        id: "pas-p1",
        orden: 1,
        texto: "¿Para quién es el pasaporte?",
        tipo: "destinatario",
        opciones: [
          { id: "pas-p1-yo", texto: "Para mí" },
          { id: "pas-p1-menor", texto: "Para un menor a mi cargo" },
          {
            id: "pas-p1-adulto",
            texto: "Para otra persona adulta",
            veredictoInviable: true,
            textoAlternativas:
              "Fuente: «será imprescindible la presencia física de la persona a quien se haya de expedir». No puedes sacarlo tú por otra persona adulta. Sí puedes pedirle la cita y acompañarla.",
          },
        ],
      },
      {
        id: "pas-p2",
        orden: 2,
        texto: "¿El menor tiene ya DNI?",
        tipo: "normal",
        opciones: [
          { id: "pas-p2-si", texto: "Sí, tiene DNI" },
          { id: "pas-p2-no", texto: "No tiene DNI todavía" },
        ],
      },
      {
        id: "pas-p3",
        orden: 3,
        texto: "¿Tienes ya un pasaporte anterior?",
        tipo: "normal",
        opciones: [
          { id: "pas-p3-no", texto: "No, es el primero" },
          { id: "pas-p3-vigor", texto: "Sí, y está en vigor" },
          { id: "pas-p3-perdido", texto: "Lo perdí o me lo robaron" },
        ],
      },
    ],
    requisitos: [
      {
        id: "pas-r1",
        tipo: "tramite_previo",
        titulo: "DNI en vigor",
        explicacion:
          "El encadenamiento clásico: si tu DNI está caducado, primero toca renovarlo. Fuente: «Documento Nacional de Identidad en vigor del solicitante en su versión física o digital, para comprobar los datos de este documento con los reflejados en la solicitud».",
        canal: "presencial",
        tramitePrevioSlug: "renovacion-dni",
        soloSiOpciones: ["pas-p1-yo", "pas-p2-si"],
      },
      {
        id: "pas-r2",
        tipo: "tramite_previo",
        titulo: "Certificación literal de nacimiento (menos de 6 meses)",
        explicacion:
          "Sustituye al DNI cuando el menor aún no lo tiene. Fuente: «deberá aportar una certificación literal de nacimiento expedida por el Registro Civil correspondiente con una antelación máxima de seis meses […] y que contengan la anotación de que se ha emitido a los solos efectos de la obtención de este documento».",
        canal: "presencial",
        tramitePrevioSlug: "certificado-nacimiento",
        soloSiOpciones: ["pas-p2-no"],
      },
      {
        id: "pas-r3",
        tipo: "doc_fisico",
        titulo: "El consentimiento de TODAS las personas con patria potestad",
        explicacion:
          "Aquí es donde más gente se atasca. Fuente: «El consentimiento ha de ser prestado por TODAS las personas que ostenten la patria potestad o tutela, (y no únicamente la guardia y custodia)». Pueden ir juntos o por separado, incluso a equipos de expedición distintos, o hacerlo ante notario. Si hay sentencia que priva o limita la patria potestad de uno, basta la autorización del otro.",
        canal: "presencial",
        soloSiOpciones: ["pas-p1-menor"],
      },
      {
        id: "pas-r4",
        tipo: "doc_fisico",
        titulo: "DNI del progenitor o tutor, y acreditar el parentesco",
        explicacion:
          "Fuente: al prestar el consentimiento «deberán acreditar su identidad con el documento nacional de identidad en vigor» y «se deberá acreditar la relación de parentesco, o condición de tutor, mediante la presentación de cualquier documento oficial al efecto».",
        canal: "presencial",
        soloSiOpciones: ["pas-p1-menor"],
      },
      {
        id: "pas-r5",
        tipo: "doc_fisico",
        titulo: "Una fotografía reciente de 32×26 mm",
        explicacion:
          "Fuente: «tamaño 32 x 26 milímetros, con fondo uniforme blanco y liso, tomada de frente y sin gafas de cristales oscuros», «de alta resolución y en papel fotográfico de buena calidad». No hace falta si has sacado o renovado el DNI el mismo día.",
        canal: "presencial",
      },
      {
        id: "pas-r6",
        tipo: "doc_fisico",
        titulo: "El pasaporte anterior, para anularlo",
        explicacion:
          "Fuente: si el pasaporte está en vigor y no se ha perdido, «deberá presentar el mismo en el equipo de expedición […] a efectos de que sea inutilizado físicamente».",
        canal: "presencial",
        soloSiOpciones: ["pas-p3-vigor"],
      },
      {
        id: "pas-r7",
        tipo: "doc_fisico",
        titulo: "La tasa: 30 € (efectivo o tarjeta)",
        explicacion:
          "Fuente: «Primera obtención, renovación, extravío, sustracción, anticipo o deterioro: 30,00 euros, abonados bien en efectivo o a través de tarjeta de crédito/débito en la Unidad de Documentación, o utilizando el pago por vía telemática». Gratis si acreditáis familia numerosa.",
        canal: "presencial",
      },
      {
        id: "pas-r8",
        tipo: "doc_fisico",
        titulo: "Cita previa pedida",
        explicacion: "Se pide en citapreviadnie.es, donde también puedes pagar la tasa.",
        canal: "presencial",
      },
    ],
    prerequisitos: [
      { slug: "renovacion-dni", nota: "El pasaporte exige el DNI en vigor." },
    ],
  },

  // ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
  {
    slug: "certificado-nacimiento",
    nivel: "estatal",
    nombreOficial: "Certificación de nacimiento (Registro Civil)",
    nombreColoquial: "El certificado de nacimiento",
    descripcion:
      "El documento del Registro Civil que acredita tu nacimiento. Hace falta para el primer DNI y para el pasaporte de un menor sin DNI. Se puede pedir por internet, en persona o por correo.",
    organismo: "Registro Civil · Ministerio de la Presidencia, Justicia y Relaciones con las Cortes",
    territorio: "España",
    canales: ["online", "presencial"],
    urlFuente: "https://www.mjusticia.gob.es/es/ciudadania/tramite?k=solicitud-certificado-nacimiento-presencial",
    alias: [
      "certificado de nacimiento",
      "partida de nacimiento",
      "certificacion literal",
      "registro civil",
      "certificado nacimiento",
    ],
    preguntas: [
      {
        id: "nac-p1",
        orden: 1,
        texto: "¿De quién es el certificado?",
        tipo: "destinatario",
        opciones: [
          { id: "nac-p1-yo", texto: "Mío" },
          { id: "nac-p1-hijo", texto: "De un hijo o menor a mi cargo" },
          { id: "nac-p1-otro", texto: "De otra persona" },
        ],
      },
      {
        id: "nac-p2",
        orden: 2,
        texto: "¿El nacimiento fue posterior a 1950?",
        tipo: "normal",
        opciones: [
          { id: "nac-p2-si", texto: "Sí" },
          { id: "nac-p2-no", texto: "No, o no lo sé" },
        ],
      },
      {
        id: "nac-p3",
        orden: 3,
        texto: "¿Cómo quieres pedirlo?",
        tipo: "normal",
        opciones: [
          { id: "nac-p3-online", texto: "Por internet" },
          { id: "nac-p3-presencial", texto: "En persona o por correo" },
        ],
      },
    ],
    requisitos: [
      {
        id: "nac-r1",
        tipo: "tecnico",
        titulo: "Cl@ve o certificado digital",
        explicacion:
          "Fuente: «Para acceder a este trámite es necesario disponer de certificado digital o estar registrado en Clave para identificarse de forma única». Sin ellos también se puede pedir online, pero llega por correo postal.",
        canal: "online",
        soloSiOpciones: ["nac-p3-online"],
      },
      {
        id: "nac-r2",
        tipo: "doc_fisico",
        titulo: "Ir al Registro Civil donde consta el nacimiento",
        explicacion:
          "Fuente: se presenta «En el registro civil en el que conste inscrito el nacimiento». Ojo: no vale cualquiera. Y «Para realizar presencialmente este trámite utilice el servicio de cita previa».",
        canal: "presencial",
        soloSiOpciones: ["nac-p3-presencial"],
      },
      {
        id: "nac-r3",
        tipo: "doc_fisico",
        titulo: "Tu DNI y los datos de la persona",
        explicacion:
          "Fuente: «DNI de la persona que solicite el certificado» e «Identificación (nombre, apellidos, fecha y lugar de nacimiento) de la persona sobre la que se solicita el certificado».",
        canal: "presencial",
        soloSiOpciones: ["nac-p3-presencial"],
      },
      {
        id: "nac-r4",
        tipo: "doc_digital",
        titulo: "Autorización de la persona inscrita",
        explicacion:
          "Fuente: «En caso de solicitar el certificado como tercero autorizado por el inscrito o por su representante […] se podrá exigir la aportación de una autorización del inscrito».",
        canal: "ambos",
        soloSiOpciones: ["nac-p1-otro"],
      },
      {
        id: "nac-r5",
        tipo: "doc_fisico",
        titulo: "Pedirlo en persona: antes de 1950 no hay vía online",
        explicacion:
          "Fuente: «No podrán expedirse certificaciones por este procedimiento cuando los asientos se practicasen antes de 1950 o se hubieran realizado en un registro civil delegado (juzgados de paz) o en un registro consular».",
        canal: "ambos",
        soloSiOpciones: ["nac-p2-no"],
      },
    ],
    prerequisitos: [],
  },

  // ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
  {
    slug: "empadronamiento-madrid",
    nivel: "local",
    comunidad: "madrid",
    nombreOficial: "Padrón Municipal: alta y cambio de domicilio (Ayuntamiento de Madrid)",
    nombreColoquial: "Empadronarse en Madrid",
    descripcion:
      "Inscribirse en el padrón del Ayuntamiento de Madrid, o cambiar de domicilio dentro de la ciudad. Es la base de casi todo lo demás: el DNI, la tarjeta sanitaria o el colegio te lo van a pedir.",
    organismo: "Servicio de Padrón de Habitantes · Ayuntamiento de Madrid",
    territorio: "Madrid (municipio)",
    canales: ["online", "presencial"],
    urlFuente:
      "https://sede.madrid.es/portal/site/tramites/menuitem.1f3361415fda829be152e15284f1a5a0/?vgnextoid=aa17f9ca0b30b310VgnVCM1000000b205a0aRCRD",
    alias: [
      "empadronamiento",
      "empadronarme",
      "padron",
      "volante de empadronamiento",
      "certificado de empadronamiento",
      "cambio de domicilio",
    ],
    preguntas: [
      {
        id: "emp-p1",
        orden: 1,
        texto: "¿Quién se empadrona?",
        tipo: "destinatario",
        opciones: [
          { id: "emp-p1-yo", texto: "Yo (con mi familia si procede)" },
          { id: "emp-p1-menor", texto: "Un menor, conmigo o con su otro progenitor" },
          { id: "emp-p1-otro", texto: "Otra persona, y yo hago el trámite por ella" },
        ],
      },
      {
        id: "emp-p2",
        orden: 2,
        texto: "¿Qué nacionalidad tiene quien se empadrona?",
        tipo: "normal",
        opciones: [
          { id: "emp-p2-es", texto: "Española" },
          { id: "emp-p2-ue", texto: "De la UE, Islandia, Liechtenstein, Noruega o Suiza" },
          { id: "emp-p2-otra", texto: "De otro país" },
        ],
      },
      {
        id: "emp-p3",
        orden: 3,
        texto: "¿Cómo puedes acreditar que vives ahí?",
        tipo: "normal",
        opciones: [
          { id: "emp-p3-propiedad", texto: "Soy propietario (escritura, compraventa o nota simple)" },
          { id: "emp-p3-alquiler", texto: "Tengo contrato de alquiler" },
          { id: "emp-p3-autorizacion", texto: "Vivo en casa de otra persona" },
        ],
      },
    ],
    requisitos: [
      {
        id: "emp-r1",
        tipo: "doc_fisico",
        titulo: "DNI o pasaporte en vigor",
        explicacion:
          "Fuente: «Mayores de 14 años: DNI o pasaporte en vigor (original de la persona que presenta la solicitud y original o copia de las demás personas que se empadronan)».",
        canal: "ambos",
        soloSiOpciones: ["emp-p2-es"],
      },
      {
        id: "emp-r2",
        tipo: "doc_fisico",
        titulo: "NIE junto con pasaporte o documento de identidad",
        explicacion:
          "Fuente: «NIE (Número de Inscripción en el Registro Central de Extranjeros) en el caso de disponer de él, junto a pasaporte o a su documento nacional de identidad originales en vigor». Si tu documento no lleva firma (caso rumano, polaco u otros), hay que presentar el pasaporte o acudir en persona.",
        canal: "ambos",
        soloSiOpciones: ["emp-p2-ue"],
      },
      {
        id: "emp-r3",
        tipo: "doc_fisico",
        titulo: "Permiso de residencia (o pasaporte si no lo tienes)",
        explicacion:
          "Fuente: «De otras nacionalidades: permiso de residencia (si no se dispone de él, se aportará el pasaporte)». Y: «El ayuntamiento puede exigir la traducción jurada oficial de los documentos expedidos por autoridades extranjeras».",
        canal: "ambos",
        soloSiOpciones: ["emp-p2-otra"],
      },
      {
        id: "emp-r4",
        tipo: "doc_fisico",
        titulo: "Libro de familia o certificado de nacimiento del menor",
        explicacion:
          "Fuente: «Menores de 14 años: libro de familia o certificado de nacimiento originales (si tuvieran DNI o pasaporte deberán aportarlo)». Si se empadrona con un solo progenitor, hace falta además la autorización del otro. Si va con personas distintas a sus progenitores, «Es necesaria la autorización de los dos progenitores o, en casos de tutela o acogimiento, la resolución judicial o administrativa».",
        canal: "ambos",
        soloSiOpciones: ["emp-p1-menor"],
      },
      {
        id: "emp-r5",
        tipo: "doc_fisico",
        titulo: "Escritura, contrato de compraventa o nota simple",
        explicacion:
          "Fuente: son válidos «únicamente si, desde la fecha que figura en ellos, no se ha empadronado ninguna otra persona en la vivienda». Si sí hubo empadronados que ya no residen, hace falta además una factura de suministro de menos de 3 meses.",
        canal: "ambos",
        soloSiOpciones: ["emp-p3-propiedad"],
      },
      {
        id: "emp-r6",
        tipo: "doc_fisico",
        titulo: "Contrato de alquiler en vigor (mínimo 6 meses, con referencia catastral)",
        explicacion:
          "Fuente: «Su duración mínima será de seis meses. Incluirá el código de referencia catastral». Debe reflejar los datos del propietario y estar firmado por todos. Si está prorrogado o firmado electrónicamente, hace falta también el justificante de pago del último recibo.",
        canal: "ambos",
        soloSiOpciones: ["emp-p3-alquiler"],
      },
      {
        id: "emp-r7",
        tipo: "doc_fisico",
        titulo: "Autorización de quien sí tiene la titularidad de la vivienda",
        explicacion:
          "Fuente: esa persona «debe autorizar el empadronamiento en su domicilio, firmará y rellenará con sus datos el apartado 'autorización de empadronamiento' de la hoja padronal, adjuntando el documento de titularidad del uso de la vivienda y su documento de identidad».",
        canal: "ambos",
        soloSiOpciones: ["emp-p3-autorizacion"],
      },
      {
        id: "emp-r8",
        tipo: "doc_fisico",
        titulo: "Hoja padronal rellena y firmada a mano",
        explicacion:
          "Fuente: «descargue la hoja padronal disponible en el apartado Modelos de formularios. Rellénela con letra mayúscula […] Todas las personas mayores de edad deben firmar, y la firma debe ser manuscrita».",
        canal: "presencial",
      },
      {
        id: "emp-r9",
        tipo: "doc_fisico",
        titulo: "Autorización de la persona a la que empadronas",
        explicacion:
          "Fuente: si no figuras en la hoja padronal, necesitas «una autorización para el empadronamiento de, al menos, una de las personas que van a ser empadronadas», más tu documento de identidad original y el del representado.",
        canal: "ambos",
        soloSiOpciones: ["emp-p1-otro"],
      },
      {
        id: "emp-r10",
        tipo: "tecnico",
        titulo: "Identificación electrónica",
        explicacion:
          "Fuente: «Tramitación en línea: a través del enlace que se encuentra disponible en el apartado Tramitar - En línea (requiere identificación electrónica)». La fuente no especifica cuáles admite: consúltalo en la sede.",
        canal: "online",
      },
      {
        id: "emp-r11",
        tipo: "doc_fisico",
        titulo: "Cita previa (obligatoria para el presencial)",
        explicacion:
          "Fuente: «Tramitación presencial con cita previa obligatoria en las Oficinas de Atención a la Ciudadanía». Ojo: «En ningún caso podrá utilizarse la tramitación en línea y la tramitación de forma presencial […] de manera simultánea».",
        canal: "presencial",
      },
    ],
    prerequisitos: [],
  },

  // ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
  {
    slug: "clave",
    nivel: "estatal",
    nombreOficial: "Registro en el sistema Cl@ve",
    nombreColoquial: "Cl@ve, la identidad electrónica del Estado",
    descripcion:
      "El sistema con el que el Estado te identifica por internet, alternativa al certificado digital. Se puede sacar por vídeo, con una carta que te mandan a casa, con certificado, o en persona en una oficina.",
    organismo: "Cl@ve · Gobierno de España",
    territorio: "España",
    canales: ["online", "presencial"],
    urlFuente: "https://clave.gob.es/registro/como-puedo-registrarme",
    alias: ["clave", "cl@ve", "clave pin", "clave permanente", "identidad electronica", "clave movil"],
    preguntas: [
      {
        id: "clv-p1",
        orden: 1,
        texto: "¿Para quién es el registro en Cl@ve?",
        tipo: "destinatario",
        opciones: [
          { id: "clv-p1-yo", texto: "Para mí" },
          {
            id: "clv-p1-otra",
            texto: "Para otra persona (mi madre, mi padre…)",
            veredictoInviable: true,
            textoAlternativas:
              "Aquí la fuente es tajante y ni siquiera vale un apoderamiento: «Para el registro en Cl@ve de forma presencial es imprescindible la presencia física de la persona que se va a registrar, así como que acuda con su DNI. Por tanto, no cabe instar registros en CL@VE mediante representación por parte de un tercero o apoderado». Tus opciones reales: (1) sentaros juntos y que se registre ella (por vídeo desde su móvil es lo más cómodo); (2) acompañarla a una oficina de registro con su DNI.",
          },
        ],
      },
      {
        id: "clv-p2",
        orden: 2,
        texto: "¿Cómo prefieres registrarte?",
        tipo: "normal",
        opciones: [
          { id: "clv-p2-video", texto: "Por vídeo, desde el móvil" },
          { id: "clv-p2-carta", texto: "Con una carta que me manden a casa" },
          { id: "clv-p2-cert", texto: "Con mi certificado digital o DNIe" },
          { id: "clv-p2-oficina", texto: "En persona, en una oficina" },
        ],
      },
      {
        id: "clv-p3",
        orden: 3,
        texto: "¿Qué documento de identidad tienes?",
        tipo: "normal",
        opciones: [
          { id: "clv-p3-dni", texto: "DNI español" },
          { id: "clv-p3-nie", texto: "NIE" },
        ],
      },
    ],
    requisitos: [
      {
        id: "clv-r1",
        tipo: "tramite_previo",
        titulo: "DNI en vigor (la vía de vídeo solo admite DNI español)",
        explicacion:
          "Fuente: «Temporalmente solo se ofrecerá el registro por videoidentificación a ciudadanos españoles con un DNI en vigor». Si tienes NIE, esta vía está cerrada ahora mismo: usa la carta de invitación o el certificado.",
        canal: "online",
        tramitePrevioSlug: "renovacion-dni",
        soloSiOpciones: ["clv-p2-video"],
      },
      {
        id: "clv-r2",
        tipo: "tecnico",
        titulo: "App Cl@ve, móvil con cámara y micro, y un sitio tranquilo",
        explicacion:
          "Fuente: «Tener instalada la APP Cl@ve. Un teléfono móvil con buena conexión, cámara y micrófono. Una dirección de correo electrónico y un número de teléfono personal. Un lugar tranquilo, bien iluminado, con fondo neutro».",
        canal: "online",
        soloSiOpciones: ["clv-p2-video"],
      },
      {
        id: "clv-r3",
        tipo: "doc_fisico",
        titulo: "El documento original, sin funda ni plastificar",
        explicacion:
          "Fuente: «Documento original en buen estado. No se pueden usar fundas, fotocopias o plastificados» y «El ciudadano debe ser el titular del documento».",
        canal: "online",
        soloSiOpciones: ["clv-p2-video"],
      },
      {
        id: "clv-r4",
        tipo: "doc_fisico",
        titulo: "La fecha de validez de tu DNI",
        explicacion:
          "Fuente: «DNI: indica la fecha de validez. DNI permanente (con fecha de validez 01-01-9999) solo es posible utilizar la fecha de expedición».",
        canal: "ambos",
        soloSiOpciones: ["clv-p3-dni"],
      },
      {
        id: "clv-r5",
        tipo: "doc_fisico",
        titulo: "El número de soporte de tu NIE",
        explicacion:
          "Fuente: «NIE: se solicitará el número de soporte que aparece en su documento».",
        canal: "ambos",
        soloSiOpciones: ["clv-p3-nie"],
      },
      {
        id: "clv-r6",
        tipo: "doc_fisico",
        titulo: "La carta de invitación con su código de 16 caracteres",
        explicacion:
          "Llega por correo postal a tu domicilio fiscal, el que conste en Hacienda (ojo con eso). Fuente: «Localiza el Código Seguro de Verificación (CSV) en la carta. Es un código de 16 números y letras en mayúsculas».",
        canal: "ambos",
        soloSiOpciones: ["clv-p2-carta"],
      },
      {
        id: "clv-r7",
        tipo: "tecnico",
        titulo: "Un móvil por persona, y un email",
        explicacion:
          "Fuente: «además del DNI, necesitas un número de teléfono móvil (solo se podrá asociar un DNI/NIE a un mismo número de móvil) y una dirección de correo electrónico». Si compartís móvil en casa, esto os va a frenar.",
        canal: "ambos",
        soloSiOpciones: ["clv-p2-carta"],
      },
      {
        id: "clv-r8",
        tipo: "tramite_previo",
        titulo: "Certificado digital o DNIe, con su número de soporte",
        explicacion:
          "Fuente: «Identifícate con tu certificado o DNI electrónico, además será necesario que consignes el número de soporte del documento para verificar la validez del mismo». Esta vía da nivel avanzado.",
        canal: "online",
        tramitePrevioSlug: "certificado-digital-fnmt",
        soloSiOpciones: ["clv-p2-cert"],
      },
      {
        id: "clv-r9",
        tipo: "doc_fisico",
        titulo: "Ir en persona con tu DNI (y mirar si piden cita)",
        explicacion:
          "Fuente: «es imprescindible la presencia física de la persona que se va a registrar, así como que acuda con su DNI» y «Recuerda, asimismo, que muchas oficinas requieren cita previa». Oficinas: AEAT, Seguridad Social, SEPE y Delegaciones del Gobierno.",
        canal: "presencial",
        soloSiOpciones: ["clv-p2-oficina"],
      },
    ],
    prerequisitos: [],
  },

  // ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
  {
    slug: "apoderamiento",
    nivel: "estatal",
    nombreOficial: "Registro Electrónico de Apoderamientos (REA) de la AGE",
    nombreColoquial: "Poder actuar en nombre de otra persona",
    descripcion:
      "La vía oficial para que alguien pueda hacer trámites en tu nombre ante la Administración del Estado, o para que tú los hagas por un familiar. No sirve para todo: solo para los trámites que estén marcados como apoderables.",
    organismo: "Administración General del Estado · Punto de Acceso General",
    territorio: "España",
    canales: ["online", "presencial"],
    urlFuente: "https://sede.administracion.gob.es/servicios-electronicos/rea",
    alias: [
      "apoderamiento",
      "apoderar",
      "poder notarial",
      "actuar en nombre de",
      "representar a mi madre",
      "rea",
      "representacion",
    ],
    preguntas: [
      {
        id: "apo-p1",
        orden: 1,
        texto: "¿Qué lado eres tú?",
        tipo: "destinatario",
        opciones: [
          { id: "apo-p1-poderdante", texto: "Quiero autorizar a alguien a actuar por mí" },
          { id: "apo-p1-apoderado", texto: "Quiero que un familiar me autorice a actuar por él o ella" },
        ],
      },
      {
        id: "apo-p2",
        orden: 2,
        texto: "¿Quién va a inscribir el apoderamiento?",
        tipo: "normal",
        opciones: [
          { id: "apo-p2-poderdante", texto: "La persona que da el poder" },
          { id: "apo-p2-apoderado", texto: "La persona que lo recibe" },
        ],
      },
      {
        id: "apo-p3",
        orden: 3,
        texto: "¿Para qué lo necesitas?",
        tipo: "normal",
        opciones: [
          { id: "apo-p3-todo", texto: "Para cualquier trámite (poder general)" },
          { id: "apo-p3-concreto", texto: "Para un trámite concreto" },
        ],
      },
    ],
    requisitos: [
      {
        id: "apo-r1",
        tipo: "tramite_previo",
        titulo: "DNI electrónico o certificado digital en vigor",
        explicacion:
          "La fuente lo marca como imprescindible: «¿Cómo acredito mi identidad? Con DNI electrónico o certificado digital reconocido en vigor (requisito imprescindible)». Ojo: esta fuente NO menciona Cl@ve como alternativa.",
        canal: "ambos",
        tramitePrevioSlug: "certificado-digital-fnmt",
      },
      {
        id: "apo-r2",
        tipo: "tecnico",
        titulo: "Que el trámite esté marcado como apoderable",
        explicacion:
          "El límite grande: no todo se puede apoderar. Fuente: se podrá inscribir «en todos aquellos trámites y actuaciones que con carácter previo hayan sido inscritos en el Sistema de Información Administrativa (SIA) con capacidad para ser iniciados por apoderado». Comprueba tu trámite antes de montar todo esto.",
        canal: "ambos",
      },
      {
        id: "apo-r3",
        tipo: "doc_fisico",
        titulo: "Poder notarial o documento privado firmado por ambos",
        explicacion:
          "Solo si lo inscribe quien recibe el poder. Fuente: «será necesario que aporte un poder notarial o un documento privado firmado electrónicamente por ella y por la persona poderdante». Los documentos privados con firma electrónica «solo se podrán presentar por comparecencia electrónica».",
        canal: "ambos",
        soloSiOpciones: ["apo-p2-apoderado"],
      },
      {
        id: "apo-r4",
        tipo: "tramite_previo",
        titulo: "Bastanteo por los servicios jurídicos",
        explicacion:
          "Un paso intermedio que bloquea. Fuente: el poder «tendrá que ser bastanteado […] El apoderamiento no estará autorizado y no surtirá efecto sin haber pasado por este trámite».",
        canal: "ambos",
        soloSiOpciones: ["apo-p2-apoderado"],
      },
      {
        id: "apo-r5",
        tipo: "tramite_previo",
        titulo: "Que la otra persona acepte después",
        explicacion:
          "Fuente: si lo inscribe quien da el poder, «la persona apoderada deberá comparecer a posteriori para aceptar el apoderamiento. Solo en este momento el apoderamiento pasará a estar autorizado y podrá ser usado».",
        canal: "ambos",
        soloSiOpciones: ["apo-p2-poderdante"],
      },
      {
        id: "apo-r6",
        tipo: "doc_fisico",
        titulo: "Decidir el tipo de poder y su fecha de fin",
        explicacion:
          "Fuente: hay tres tipos. «Tipo a: apoderamiento general para cualquier actuación administrativa ante cualquier Administración Pública. Tipo b: […] para una Administración y sus Organismos Públicos […]. Tipo c: apoderamiento para determinados trámites». Y: «El plazo máximo de vigencia no podrá ser superior a los 5 años».",
        canal: "ambos",
      },
    ],
    prerequisitos: [
      { slug: "certificado-digital-fnmt", nota: "La fuente lo marca como requisito imprescindible." },
    ],
  },

  // ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
  {
    slug: "tarjeta-sanitaria-madrid",
    nivel: "autonomico",
    comunidad: "madrid",
    nombreOficial: "Tarjeta Sanitaria Individual (Comunidad de Madrid)",
    nombreColoquial: "La tarjeta sanitaria",
    descripcion:
      "La tarjeta del médico. Se pide en el centro de salud o por internet. Hace falta estar empadronado en la Comunidad de Madrid y tener reconocido el derecho a la asistencia por el INSS.",
    organismo: "Servicio Madrileño de Salud · Consejería de Sanidad",
    territorio: "Comunidad de Madrid",
    canales: ["online", "presencial"],
    urlFuente: "https://sede.comunidad.madrid/prestacion-social/tarjeta-sanitaria",
    alias: [
      "tarjeta sanitaria",
      "tarjeta del medico",
      "sanidad",
      "medico de cabecera",
      "tsi",
      "tarjeta sanitaria de mi hijo",
    ],
    preguntas: [
      {
        id: "san-p1",
        orden: 1,
        texto: "¿Para quién es la tarjeta?",
        tipo: "destinatario",
        opciones: [
          { id: "san-p1-yo", texto: "Para mí" },
          { id: "san-p1-otro", texto: "Para otra persona (hijo, madre…) y la pido yo" },
        ],
      },
      {
        id: "san-p2",
        orden: 2,
        texto: "¿Qué necesitas hacer?",
        tipo: "normal",
        opciones: [
          { id: "san-p2-primera", texto: "Sacarla por primera vez" },
          { id: "san-p2-repo", texto: "Se ha perdido, roto o hay que cambiar datos" },
        ],
      },
      {
        id: "san-p3",
        orden: 3,
        texto: "¿Qué nacionalidad tiene el titular?",
        tipo: "normal",
        opciones: [
          { id: "san-p3-es", texto: "Española" },
          { id: "san-p3-ext", texto: "Extranjera" },
        ],
      },
    ],
    requisitos: [
      {
        id: "san-r1",
        tipo: "tramite_previo",
        titulo: "Estar empadronado en la Comunidad de Madrid",
        explicacion: "Fuente, literal: «Estar empadronado en la Comunidad de Madrid».",
        canal: "ambos",
        tramitePrevioSlug: "empadronamiento-madrid",
        soloSiOpciones: ["san-p2-primera"],
      },
      {
        id: "san-r2",
        tipo: "tramite_previo",
        titulo: "Tener reconocido el derecho a la asistencia por el INSS",
        explicacion:
          "Fuente: «Tener derecho a la asistencia sanitaria por el Instituto Nacional de la Seguridad Social (INSS)». Ojo: es tener el derecho reconocido, no aportar el documento de afiliación: la fuente no lo pide.",
        canal: "ambos",
        soloSiOpciones: ["san-p2-primera"],
      },
      {
        id: "san-r3",
        tipo: "doc_fisico",
        titulo: "Permiso de residencia en vigor o en trámite",
        explicacion:
          "Fuente: «En caso de personas extranjeras, disponer de un permiso de residencia en vigor o en trámite de renovación». Y hay que «Acreditar la vigencia del permiso de residencia, cada vez que se renueve»: la tarjeta de personas extranjeras sí caduca, la de españolas no.",
        canal: "ambos",
        soloSiOpciones: ["san-p3-ext"],
      },
      {
        id: "san-r4",
        tipo: "doc_fisico",
        titulo: "Certificado de nacimiento (menores de 14 sin DNI)",
        explicacion:
          "Fuente: «Certificado de nacimiento (solo en menores de 14 años, en ausencia de DNI o TIE)».",
        canal: "ambos",
        soloSiOpciones: ["san-p1-otro"],
      },
      {
        id: "san-r5",
        tipo: "doc_fisico",
        titulo: "Documento que acredite la representación",
        explicacion:
          "Fuente: «En caso de actuar por medio de un representante, documento que acredite la representación o vinculación familiar (Libro de familia, Sentencia judicial de incapacitación, Resolución de acogimiento o tutela, poderes o autorización)».",
        canal: "ambos",
        soloSiOpciones: ["san-p1-otro"],
      },
      {
        id: "san-r6",
        tipo: "doc_fisico",
        titulo: "Volante de empadronamiento de menos de 90 días",
        explicacion:
          "Fuente: «Volante de empadronamiento expedido con menos de 90 días a su presentación». Curiosamente la fuente lo pide para esto, y no para la primera tarjeta.",
        canal: "ambos",
        tramitePrevioSlug: "empadronamiento-madrid",
        soloSiOpciones: ["san-p2-repo"],
      },
      {
        id: "san-r7",
        tipo: "tecnico",
        titulo: "Firma electrónica reconocida",
        explicacion:
          "Fuente: «Para realizar este trámite por medios electrónicos necesitas uno de los sistemas de firma electrónica reconocidos por la Comunidad de Madrid». Si vas al centro de salud, no hace falta ni el formulario: «El personal de la Unidad Administrativa te indicará la documentación necesaria en tu caso concreto».",
        canal: "online",
      },
    ],
    prerequisitos: [
      { slug: "empadronamiento-madrid", nota: "Hay que estar empadronado en la Comunidad de Madrid." },
    ],
  },

  // ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
  {
    slug: "familia-numerosa-madrid",
    nivel: "autonomico",
    comunidad: "madrid",
    nombreOficial: "Título de Familia Numerosa (Comunidad de Madrid)",
    nombreColoquial: "El título de familia numerosa",
    descripcion:
      "El título que da descuentos y ventajas, entre ellas el DNI y el pasaporte gratis. Ya no es un papel: es una tarjeta digital. Se puede pedir todo el año.",
    organismo: "Dirección General de Infancia, Familia y Fomento de la Natalidad · Comunidad de Madrid",
    territorio: "Comunidad de Madrid",
    canales: ["online", "presencial"],
    urlFuente:
      "https://sede.comunidad.madrid/autorizaciones-licencias-permisos-carnes/titulo-familia-numerosa",
    alias: [
      "familia numerosa",
      "titulo de familia numerosa",
      "carnet familia numerosa",
      "descuentos familia numerosa",
    ],
    preguntas: [
      {
        id: "fn-p1",
        orden: 1,
        texto: "¿El título es para tu familia?",
        tipo: "destinatario",
        opciones: [
          { id: "fn-p1-yo", texto: "Sí, soy progenitor, tutor o acogedor" },
          {
            id: "fn-p1-otro",
            texto: "No, es para la familia de otra persona",
            veredictoInviable: true,
            textoAlternativas:
              "El título lo pide la propia unidad familiar. Si hay separación o divorcio y lo pide el progenitor no custodio, la fuente exige documentación específica: sentencia y/o convenio regulador, los tres últimos recibos de la pensión y un escrito firmado del progenitor custodio dando por conocida la inclusión de los hijos. Si no eres de la familia, no puedes pedirlo tú.",
          },
        ],
      },
      {
        id: "fn-p2",
        orden: 2,
        texto: "¿Qué nacionalidad tienen los miembros de la familia?",
        tipo: "normal",
        opciones: [
          { id: "fn-p2-es", texto: "Española" },
          { id: "fn-p2-ue", texto: "De la UE" },
          { id: "fn-p2-otra", texto: "De fuera de la UE" },
        ],
      },
      {
        id: "fn-p3",
        orden: 3,
        texto: "¿Hay hijos de entre 21 y 25 años?",
        tipo: "normal",
        opciones: [
          { id: "fn-p3-no", texto: "No" },
          { id: "fn-p3-si", texto: "Sí" },
        ],
      },
      {
        id: "fn-p4",
        orden: 4,
        texto: "¿Hay separación, divorcio o custodia compartida?",
        tipo: "normal",
        opciones: [
          { id: "fn-p4-no", texto: "No" },
          { id: "fn-p4-si", texto: "Sí" },
        ],
      },
    ],
    requisitos: [
      {
        id: "fn-r1",
        tipo: "tramite_previo",
        titulo: "Certificado o volante de empadronamiento de menos de 3 meses",
        explicacion:
          "De todos los que vayan en el título. Fuente: «expedido como máximo, dentro de los tres meses inmediatos anteriores a la fecha de solicitud. No se requiere que figuren los hijos menores de seis meses».",
        canal: "ambos",
        tramitePrevioSlug: "empadronamiento-madrid",
      },
      {
        id: "fn-r2",
        tipo: "doc_fisico",
        titulo: "Copia del libro de familia (o certificados de matrimonio y nacimiento)",
        explicacion:
          "Fuente: «Copia del Libro de Familia donde conste, en su caso, el matrimonio y nacimiento de los hijos o, en su defecto copia de los certificados de matrimonio y nacimiento de los hijos. En el caso de que los miembros de la familia figuren en distintos Libros de Familia se aportará copia de todos ellos».",
        canal: "ambos",
        soloSiOpciones: ["fn-p2-es"],
      },
      {
        id: "fn-r3",
        tipo: "doc_fisico",
        titulo: "Certificado de inscripción en el Registro Central de Extranjeros",
        explicacion:
          "Fuente (personas comunitarias): «Copia del certificado de inscripción en el Registro Central de Extranjeros». Y la documentación familiar «análoga, si ésta existe en el Estado del que son nacionales».",
        canal: "ambos",
        soloSiOpciones: ["fn-p2-ue"],
      },
      {
        id: "fn-r4",
        tipo: "doc_fisico",
        titulo: "Permiso de residencia o visado de reagrupación familiar",
        explicacion:
          "Fuente (extracomunitarias): «copia de la documentación acreditativa de la residencia legal: permiso de residencia o visado de reagrupación familiar». Si está caducado, hace falta copia de la solicitud de prórroga y el Anexo V.",
        canal: "ambos",
        soloSiOpciones: ["fn-p2-otra"],
      },
      {
        id: "fn-r5",
        tipo: "doc_fisico",
        titulo: "Certificado de estudios de los hijos de 21 a 25 años",
        explicacion:
          "Fuente: «Copia del certificado del Centro donde cursen estudios, matrícula oficial donde conste el curso que va a realizar, preinscripción o cualquier otro documento válido en derecho».",
        canal: "ambos",
        soloSiOpciones: ["fn-p3-si"],
      },
      {
        id: "fn-r6",
        tipo: "doc_fisico",
        titulo: "Sentencia, convenio regulador y recibos de la pensión",
        explicacion:
          "Fuente: si lo pide el progenitor no custodio, «copia de sentencia judicial y/o convenio regulador donde se determine la custodia de los hijos, tres últimos recibos bancarios correspondientes al pago de la pensión alimenticia de sus hijos y escrito firmado por el progenitor custodio». En custodia compartida, «acuerdo entre progenitores sobre titularidad y tiempos del Título».",
        canal: "ambos",
        soloSiOpciones: ["fn-p4-si"],
      },
      {
        id: "fn-r7",
        tipo: "tecnico",
        titulo: "Firma electrónica reconocida (también para usar el título)",
        explicacion:
          "No solo para pedirlo: el título ya no existe en papel. Fuente: «El título en soporte físico ha sido sustituido por una tarjeta digital en la aplicación de Familias Numerosas. Para acceder tienes que disponer de uno de los sistemas de firma electrónica reconocidos por la Comunidad de Madrid».",
        canal: "ambos",
      },
      {
        id: "fn-r8",
        tipo: "doc_fisico",
        titulo: "Cita previa (para la vía presencial)",
        explicacion:
          "Fuente: «si deseas presentar la solicitud de forma presencial, es preciso tener cita previa. Para obtenerla, pulsa en el siguiente enlace o llama al teléfono 012».",
        canal: "presencial",
      },
    ],
    prerequisitos: [
      { slug: "empadronamiento-madrid", nota: "El empadronamiento caduca a los 3 meses para este trámite." },
    ],
  },

  // ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
  {
    slug: "beca-comedor-madrid",
    nivel: "autonomico",
    comunidad: "madrid",
    nombreOficial: "Becas de comedor escolar 2026-2027 (Comunidad de Madrid)",
    nombreColoquial: "La beca de comedor del cole",
    descripcion:
      "Ayuda para el comedor escolar de alumnos de Infantil, Primaria y Secundaria en centros sostenidos con fondos públicos de la Comunidad de Madrid. La piden los progenitores o tutores, y depende de la renta familiar.",
    organismo: "Consejería de Educación · Comunidad de Madrid",
    territorio: "Comunidad de Madrid",
    canales: ["online", "presencial"],
    urlFuente:
      "https://sede.comunidad.madrid/ayudas-becas-subvenciones/becas-comedor-escolar-2026-2027",
    plazo: {
      inicio: "2026-04-29",
      fin: "2026-05-28",
      nota: "En la convocatoria 2026-2027 el plazo fue del 29/04 al 28/05. Suele abrirse en primavera: consulta la fuente oficial para la próxima.",
    },
    alias: [
      "beca comedor",
      "beca de comedor",
      "comedor escolar",
      "ayuda comedor",
      "beca del cole",
      "becas comedor madrid",
    ],
    preguntas: [
      {
        id: "beca-p1",
        orden: 1,
        texto: "¿Para quién solicitas la beca?",
        tipo: "destinatario",
        opciones: [
          { id: "beca-p1-hijo", texto: "Para un hijo o menor a mi cargo" },
          {
            id: "beca-p1-otro",
            texto: "Para el hijo de otra persona",
            veredictoInviable: true,
            textoAlternativas:
              "La beca la piden quienes tienen la guarda del menor. Fuente: son destinatarios los «Progenitores, tutores, acogedores o personas encargadas de la guarda y custodia» del alumno. Si no eres una de esas figuras, no puedes solicitarla tú: tiene que hacerlo quien la tenga.",
          },
        ],
      },
      {
        id: "beca-p2",
        orden: 2,
        texto: "¿Cómo quieres presentarla?",
        tipo: "normal",
        opciones: [
          { id: "beca-p2-online", texto: "Por internet" },
          { id: "beca-p2-presencial", texto: "En papel / en el colegio" },
        ],
      },
      {
        id: "beca-p3",
        orden: 3,
        texto: "¿Vivís en un municipio de la Comunidad de Madrid?",
        tipo: "normal",
        opciones: [
          { id: "beca-p3-si", texto: "Sí" },
          { id: "beca-p3-no", texto: "No, residimos fuera" },
        ],
      },
      {
        id: "beca-p4",
        orden: 4,
        texto: "¿Vuestros ingresos tributan por IRPF?",
        tipo: "normal",
        opciones: [
          { id: "beca-p4-irpf", texto: "Sí, hacemos la declaración" },
          { id: "beca-p4-no-irpf", texto: "No / no todos" },
        ],
      },
    ],
    requisitos: [
      {
        id: "beca-r1",
        tipo: "tramite_previo",
        titulo: "Un sistema de firma electrónica reconocido",
        explicacion:
          "Fuente: «Para realizar este trámite por medios electrónicos necesitas uno de los sistemas de firma electrónica reconocidos por la Comunidad de Madrid». El certificado digital de la FNMT es uno de los habituales; confirma en la fuente cuáles admite tu convocatoria.",
        canal: "online",
        tramitePrevioSlug: "certificado-digital-fnmt",
        soloSiOpciones: ["beca-p2-online"],
      },
      {
        id: "beca-r2",
        tipo: "doc_fisico",
        titulo: "Libro de familia completo (o certificado de nacimiento de los menores)",
        explicacion:
          "Fuente: «Libro de familia completo, certificado del Registro Civil o Partida de Nacimiento de todos los menores».",
        canal: "ambos",
      },
      {
        id: "beca-r3",
        tipo: "doc_fisico",
        titulo: "Certificado de empadronamiento familiar",
        explicacion: "Fuente: hace falta el empadronamiento familiar si residís fuera de Madrid.",
        canal: "ambos",
        soloSiOpciones: ["beca-p3-no"],
      },
      {
        id: "beca-r4",
        tipo: "doc_digital",
        titulo: "Certificado de la Agencia Tributaria con código seguro de verificación",
        explicacion:
          "De la renta de 2024. Fuente: «Certificado expedido por la Agencia Tributaria con código seguro de verificación» para ingresos sometidos a IRPF (2024).",
        canal: "ambos",
        soloSiOpciones: ["beca-p4-irpf"],
      },
      {
        id: "beca-r5",
        tipo: "doc_digital",
        titulo: "Vida laboral, nóminas y certificación tributaria",
        explicacion:
          "Para ingresos que no tributan por IRPF. Fuente: certificación tributaria + «Informe de vida laboral de la Seguridad Social» + nóminas del empleador.",
        canal: "ambos",
        soloSiOpciones: ["beca-p4-no-irpf"],
      },
      {
        id: "beca-r6",
        tipo: "doc_fisico",
        titulo: "Sentencia de separación o divorcio, o certificado de defunción",
        explicacion: "Fuente: sentencias de separación/divorcio o certificados de defunción, si aplica a vuestro caso.",
        canal: "ambos",
      },
      {
        id: "beca-r7",
        tipo: "doc_fisico",
        titulo: "Renta familiar por persona por debajo del límite",
        explicacion:
          "Fuente: «Disponer de una renta familiar por persona inferior a 8.400 euros durante el año económico 2024»; para familias numerosas, «renta familiar por persona a partir de 8.400 e inferior a 10.000 euros». También hay vías por Renta Mínima de Inserción, Ingreso Mínimo Vital, víctimas de violencia de género o terrorismo, Fuerzas de Seguridad, acogimiento familiar y protección internacional.",
        canal: "ambos",
      },
      {
        id: "beca-r8",
        tipo: "doc_fisico",
        titulo: "Plaza matriculada o reservada en el centro",
        explicacion:
          "Fuente: el alumno debe estar «matriculado o tiene una reserva de plaza» en un centro público o privado sostenido con fondos públicos, en Infantil, Primaria o Secundaria Obligatoria.",
        canal: "ambos",
      },
    ],
    prerequisitos: [
      {
        slug: "certificado-digital-fnmt",
        nota: "Si la presentas por internet necesitas firma electrónica reconocida.",
      },
    ],
  },

  // ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
  {
    slug: "certificado-digital-fnmt",
    nivel: "estatal",
    nombreOficial: "Certificado digital de persona física (software) — acreditación presencial",
    nombreColoquial: "El certificado para hacer trámites por internet",
    descripcion:
      "El certificado digital te identifica en las sedes electrónicas y te permite hacer trámites online (becas, Hacienda, Seguridad Social…) sin desplazarte. El proceso tiene cuatro pasos: instalar un programa, solicitarlo por internet, acreditar tu identidad en una oficina y descargarlo.",
    organismo: "FNMT — Fábrica Nacional de Moneda y Timbre",
    territorio: "España",
    canales: ["online"],
    urlFuente: "https://www.sede.fnmt.gob.es/certificados/persona-fisica/obtener-certificado-software",
    alias: [
      "certificado digital",
      "certificado electrónico",
      "fnmt",
      "firma digital",
      "certificado para tramites online",
      "configurador fnmt",
    ],
    preguntas: [
      {
        id: "cert-p1",
        orden: 1,
        texto: "¿Para quién es el certificado?",
        tipo: "destinatario",
        opciones: [
          { id: "cert-p1-yo", texto: "Para mí" },
          {
            id: "cert-p1-otra",
            texto: "Para otra persona (mi madre, mi padre…)",
            veredictoInviable: true,
            textoAlternativas:
              "El certificado es personal: la fuente oficial dice que «el solicitante y futuro titular del certificado deberá acudir personalmente a una Oficina de Acreditación de Identidad». No puedes acreditarte tú por ella. Tus opciones reales: (1) que lo solicite ella desde su ordenador con tu ayuda y la acompañes a la oficina; (2) si lo que necesitas es poder actuar por ella ante la administración, el camino es un apoderamiento, no su certificado.",
          },
        ],
      },
      {
        id: "cert-p2",
        orden: 2,
        texto: "¿Con qué documento de identidad vas a acreditarte?",
        tipo: "normal",
        opciones: [
          { id: "cert-p2-es", texto: "DNI español" },
          { id: "cert-p2-ue", texto: "Soy de la UE (tengo NIE)" },
          { id: "cert-p2-extranjero", texto: "Soy de fuera de la UE (tengo NIE)" },
        ],
      },
      {
        id: "cert-p3",
        orden: 3,
        texto: "¿Desde qué sistema operativo lo vas a hacer?",
        tipo: "normal",
        opciones: [
          { id: "cert-p3-windows", texto: "Windows" },
          { id: "cert-p3-mac", texto: "macOS" },
          { id: "cert-p3-linux", texto: "GNU/Linux" },
        ],
      },
    ],
    requisitos: [
      {
        id: "cert-r1",
        tipo: "tramite_previo",
        titulo: "Un documento de identidad en vigor",
        explicacion:
          "Sin él no puedes acreditar tu identidad en la oficina. Si tu DNI está caducado, primero toca renovarlo.",
        canal: "ambos",
        tramitePrevioSlug: "renovacion-dni",
        soloSiOpciones: ["cert-p2-es"],
      },
      {
        id: "cert-r2",
        tipo: "tecnico",
        titulo: "Instalar el CONFIGURADOR FNMT-RCM",
        explicacion:
          "Es el programa oficial que genera las claves. Sin él no se puede ni empezar la solicitud. Fuente: «La Fábrica Nacional de Moneda y Timbre ha desarrollado esta aplicación para solicitar las claves necesarias en la obtención de un certificado digital».",
        canal: "online",
      },
      {
        id: "cert-r3",
        tipo: "tecnico",
        titulo: "Un navegador actualizado",
        explicacion:
          "Fuente: «Última versión de cualquiera de los siguientes navegadores: Mozilla Firefox, Google Chrome, Microsoft EDGE, Opera, Safari».",
        canal: "online",
      },
      {
        id: "cert-r4",
        tipo: "tecnico",
        titulo: "Windows de 64 bits",
        explicacion: "El configurador se distribuye para Windows 64 bits.",
        canal: "online",
        soloSiOpciones: ["cert-p3-windows"],
      },
      {
        id: "cert-r5",
        tipo: "tecnico",
        titulo: "GNU/Linux de 64 bits (paquete DEB o RPM)",
        explicacion: "El configurador se distribuye para GNU/Linux 64 bits en formatos DEB y RPM.",
        canal: "online",
        soloSiOpciones: ["cert-p3-linux"],
      },
      {
        id: "cert-r6",
        tipo: "tecnico",
        titulo: "Antivirus o proxy que no bloqueen el configurador",
        explicacion:
          "Fuente: «Los antivirus y proxies pueden impedir el uso de esta aplicación, por favor no utilice proxy o permita el acceso a esta aplicación en su proxy».",
        canal: "online",
      },
      {
        id: "cert-r7",
        tipo: "tecnico",
        titulo: "El mismo ordenador y usuario de principio a fin, y no formatearlo",
        explicacion:
          "El fallo más caro de este trámite. Fuente: «Se debe realizar todo el proceso de obtención desde el mismo equipo y mismo usuario» y «No formatear el ordenador, entre el proceso de solicitud y el de descarga del certificado».",
        canal: "online",
      },
      {
        id: "cert-r8",
        tipo: "doc_digital",
        titulo: "Una dirección de email a la que tengas acceso",
        explicacion:
          "Ahí llega el Código de Solicitud. Fuente: «Al finalizar el proceso de solicitud, recibirás en tu cuenta de correo electrónico un Código de Solicitud».",
        canal: "online",
      },
      {
        id: "cert-r9",
        tipo: "doc_fisico",
        titulo: "El código de solicitud y tu DNI, pasaporte o carné de conducir",
        explicacion:
          "Para la cita de acreditación. Fuente (ciudadanos españoles): «El código de solicitud que le ha sido remitido a su cuenta de correo electrónico y el Documento Nacional de Identidad (DNI), pasaporte o carné de conducir».",
        canal: "presencial",
        soloSiOpciones: ["cert-p2-es"],
      },
      {
        id: "cert-r10",
        tipo: "doc_fisico",
        titulo: "El código de solicitud, tu NIE y tu pasaporte o documento de identidad",
        explicacion:
          "Fuente (ciudadanos de la UE): «El código de solicitud […] y Documento Nacional de Identificación de Extranjeros donde conste el NIE junto con Pasaporte o documento de identidad de país de origen».",
        canal: "presencial",
        soloSiOpciones: ["cert-p2-ue"],
      },
      {
        id: "cert-r11",
        tipo: "doc_fisico",
        titulo: "El código de solicitud, tu tarjeta de extranjería y tu pasaporte",
        explicacion:
          "Fuente (ciudadanos extranjeros): «El código de solicitud […] y Tarjeta Roja/Verde/Blanca de Identificación de Extranjeros donde consta el NIE junto con el pasaporte».",
        canal: "presencial",
        soloSiOpciones: ["cert-p2-extranjero"],
      },
      {
        id: "cert-r12",
        tipo: "doc_fisico",
        titulo: "Acudir en persona a una Oficina de Acreditación (mira si pide cita previa)",
        explicacion:
          "Fuente: «el solicitante y futuro titular del certificado deberá acudir personalmente a una Oficina de Acreditación de Identidad» y «En las oficinas de la AEAT, Seguridad Social y en otras oficinas se requiere de cita previa, consulte con la propia oficina».",
        canal: "presencial",
      },
    ],
    prerequisitos: [
      {
        slug: "renovacion-dni",
        nota: "Necesitas un documento de identidad en vigor para acreditarte en la oficina.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  //  ARAGÓN — mismos conceptos que Madrid, fuente distinta. Curadas 17/07/2026,
  //  pendientes de verificación humana. Segundo territorio: prueba el modelo.
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
  {
    slug: "tarjeta-sanitaria-aragon",
    nivel: "autonomico",
    comunidad: "aragon",
    nombreOficial: "Tarjeta Sanitaria Individual (Aragón)",
    nombreColoquial: "La tarjeta sanitaria",
    descripcion:
      "La tarjeta del médico en Aragón. Se pide en persona, con cita previa. Hace falta estar empadronado en algún municipio de Aragón. Ojo: aquí el trámite es solo presencial.",
    organismo: "Servicio Aragonés de Salud (SALUD)",
    territorio: "Aragón",
    canales: ["presencial"],
    urlFuente:
      "https://www.aragon.es/tramitador/-/tramite/solicitud-tarjeta-sanitaria-emision-inicial-sucesiva",
    urlCitaPrevia: "https://citaprevia.aragon.es",
    alias: [
      "tarjeta sanitaria",
      "tarjeta del medico",
      "salud aragon",
      "medico de cabecera",
      "tarjeta sanitaria aragon",
    ],
    preguntas: [
      {
        id: "san-ar-p1",
        orden: 1,
        texto: "¿Para quién es la tarjeta?",
        tipo: "destinatario",
        opciones: [
          { id: "san-ar-p1-yo", texto: "Para mí" },
          { id: "san-ar-p1-menor", texto: "Para un menor a mi cargo" },
        ],
      },
      {
        id: "san-ar-p2",
        orden: 2,
        texto: "¿Qué nacionalidad tiene el titular?",
        tipo: "normal",
        opciones: [
          { id: "san-ar-p2-es", texto: "Española" },
          { id: "san-ar-p2-ext", texto: "Extranjera" },
        ],
      },
    ],
    requisitos: [
      {
        id: "san-ar-r1",
        tipo: "tramite_previo",
        titulo: "Estar empadronado en un municipio de Aragón",
        explicacion:
          "Fuente: para españoles, «Tener vecindad administrativa en alguno de los municipios de la Comunidad Autónoma de Aragón», y en la documentación se pide «Certificación de empadronamiento».",
        canal: "presencial",
        tramitePrevioSlug: "empadronamiento-zaragoza",
      },
      {
        id: "san-ar-r2",
        tipo: "tramite_previo",
        titulo: "Tener reconocido el derecho a la asistencia por el INSS",
        explicacion:
          "Fuente (extranjeros): «Tener reconocido el derecho a la asistencia sanitaria por el Instituto Nacional de la Seguridad Social».",
        canal: "presencial",
        soloSiOpciones: ["san-ar-p2-ext"],
      },
      {
        id: "san-ar-r3",
        tipo: "doc_fisico",
        titulo: "Documento de identidad (DNI, NIE o pasaporte)",
        explicacion: "Fuente: «Documento que acredite identidad DNI/NIE/Pasaporte».",
        canal: "presencial",
      },
      {
        id: "san-ar-r4",
        tipo: "doc_fisico",
        titulo: "Número de usuario/a de la Seguridad Social",
        explicacion: "Fuente (con nacionalidad española): «Número de usuario/a de Seguridad Social».",
        canal: "presencial",
        soloSiOpciones: ["san-ar-p2-es"],
      },
      {
        id: "san-ar-r5",
        tipo: "doc_fisico",
        titulo: "El libro de familia (o documento que acredite el parentesco)",
        explicacion: "Fuente: «Libro familia o documento que acredite parentesco. En caso de menores».",
        canal: "presencial",
        soloSiOpciones: ["san-ar-p1-menor"],
      },
      {
        id: "san-ar-r6",
        tipo: "doc_fisico",
        titulo: "Certificación de no exportación y declaración jurada",
        explicacion:
          "Solo si eres extranjero sin derecho reconocido por el INSS. Fuente: «Certificación de no exportación» y «Declaración jurada de no existir terceros obligados al pago».",
        canal: "presencial",
        soloSiOpciones: ["san-ar-p2-ext"],
      },
      {
        id: "san-ar-r7",
        tipo: "doc_fisico",
        titulo: "La solicitud cumplimentada, y pedir cita previa",
        explicacion:
          "Fuente: «Solicitud cumplimentada», y se presenta pidiendo «cita previa en una de nuestras oficinas de información y registro».",
        canal: "presencial",
      },
    ],
    prerequisitos: [
      { slug: "empadronamiento-zaragoza", nota: "Hay que estar empadronado en un municipio de Aragón." },
    ],
  },

  // ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
  {
    slug: "beca-comedor-aragon",
    nivel: "autonomico",
    comunidad: "aragon",
    nombreOficial: "Becas de comedor escolar (Aragón)",
    nombreColoquial: "La beca de comedor del cole",
    descripcion:
      "Ayuda para el comedor escolar en Aragón, para alumnos de Infantil, Primaria y Educación Especial. Depende de la renta familiar. La lista exacta de documentos está en la orden de convocatoria de cada curso.",
    organismo: "Departamento de Educación · Gobierno de Aragón",
    territorio: "Aragón",
    canales: ["online", "presencial"],
    urlFuente:
      "https://www.aragon.es/tramitador/-/tramite/becas-comedor-escolar-y-periodo-estival-no-lectivo",
    plazo: {
      inicio: "2026-06-08",
      fin: "2026-06-19",
      nota: "En la convocatoria 2026-2027 el plazo fue del 08/06 al 19/06. Suele abrirse a finales de curso: consulta la fuente oficial para la próxima.",
    },
    alias: [
      "beca comedor",
      "beca de comedor",
      "comedor escolar aragon",
      "ayuda comedor",
      "beca del cole",
    ],
    preguntas: [
      {
        id: "beca-ar-p1",
        orden: 1,
        texto: "¿Para quién solicitas la beca?",
        tipo: "destinatario",
        opciones: [
          { id: "beca-ar-p1-hijo", texto: "Para un hijo o menor a mi cargo" },
          {
            id: "beca-ar-p1-otro",
            texto: "Para el hijo de otra persona",
            veredictoInviable: true,
            textoAlternativas:
              "La beca la piden quienes tienen la guarda del menor. Si no eres progenitor, tutor o acogedor, no puedes solicitarla tú: tiene que hacerlo quien la tenga.",
          },
        ],
      },
      {
        id: "beca-ar-p2",
        orden: 2,
        texto: "¿Cómo quieres presentarla?",
        tipo: "normal",
        opciones: [
          { id: "beca-ar-p2-online", texto: "Por internet" },
          { id: "beca-ar-p2-presencial", texto: "En papel / en una oficina de registro" },
        ],
      },
    ],
    requisitos: [
      {
        id: "beca-ar-r1",
        tipo: "doc_fisico",
        titulo: "Tener el domicilio en Aragón",
        explicacion: "Fuente: «Tener su domicilio en el territorio de la Comunidad Autónoma de Aragón».",
        canal: "ambos",
      },
      {
        id: "beca-ar-r2",
        tipo: "doc_fisico",
        titulo: "Renta familiar por debajo de 2 veces el IPREM",
        explicacion:
          "Fuente: «El máximo de renta familiar para tener acceso a las becas de comedor escolar será de dos veces el Indicador Público de Renta de Efectos Múltiples (IPREM) vigente para el periodo objeto de la convocatoria».",
        canal: "ambos",
      },
      {
        id: "beca-ar-r3",
        tipo: "doc_fisico",
        titulo: "Estar matriculado en una etapa que da derecho",
        explicacion:
          "Fuente: «Alumnado que vaya a cursar estudios del tercer curso del primer ciclo de Educación Infantil, del segundo ciclo de Educación Infantil, de Educación Primaria y de Educación Especial».",
        canal: "ambos",
      },
      {
        id: "beca-ar-r4",
        tipo: "doc_digital",
        titulo: "Solicitud por la aplicación de becas (online)",
        explicacion:
          "Fuente: «Las solicitudes serán cumplimentadas a través de la aplicación informática de gestión de becas de comedor escolar y material curricular accesible a través del enlace disponible en educa.aragon.es». La fuente no detalla qué identificación digital pide la aplicación: confírmalo antes.",
        canal: "online",
        soloSiOpciones: ["beca-ar-p2-online"],
      },
      {
        id: "beca-ar-r5",
        tipo: "doc_fisico",
        titulo: "El resto de documentación de la convocatoria",
        explicacion:
          "Ojo: la ficha oficial no lista los documentos, los remite a la orden. Fuente: «Documentación descrita en el artículo undécimo de la orden de convocatoria». Consulta esa orden (en el BOA) para la lista exacta.",
        canal: "ambos",
      },
    ],
    prerequisitos: [],
  },

  // ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
  {
    slug: "familia-numerosa-aragon",
    nivel: "autonomico",
    comunidad: "aragon",
    nombreOficial: "Título de Familia Numerosa (Aragón)",
    nombreColoquial: "El título de familia numerosa",
    descripcion:
      "El título que da descuentos y ventajas, entre ellas el DNI y el pasaporte gratis. En Aragón lo regula el Decreto 75/2023 y lo gestiona el Gobierno de Aragón. Se puede pedir todo el año.",
    organismo: "Departamento de Bienestar Social y Familia · Gobierno de Aragón",
    territorio: "Aragón",
    canales: ["online", "presencial"],
    urlFuente: "https://www.aragon.es/-/familias-numerosas",
    urlCitaPrevia: "https://citaprevia.aragon.es",
    alias: [
      "familia numerosa",
      "titulo de familia numerosa",
      "carnet familia numerosa",
      "familia numerosa aragon",
    ],
    preguntas: [
      {
        id: "fn-ar-p1",
        orden: 1,
        texto: "¿El título es para tu familia?",
        tipo: "destinatario",
        opciones: [
          { id: "fn-ar-p1-yo", texto: "Sí, soy progenitor, tutor o acogedor" },
          {
            id: "fn-ar-p1-otro",
            texto: "No, es para la familia de otra persona",
            veredictoInviable: true,
            textoAlternativas:
              "El título lo pide la propia unidad familiar. Si no eres progenitor, tutor o acogedor de esos menores, no puedes solicitarlo tú: tiene que hacerlo quien tenga la guarda.",
          },
        ],
      },
      {
        id: "fn-ar-p2",
        orden: 2,
        texto: "¿Hay miembros extranjeros no comunitarios?",
        tipo: "normal",
        opciones: [
          { id: "fn-ar-p2-no", texto: "No" },
          { id: "fn-ar-p2-si", texto: "Sí" },
        ],
      },
      {
        id: "fn-ar-p3",
        orden: 3,
        texto: "¿Hay hijos de entre 21 y 25 años que estudian?",
        tipo: "normal",
        opciones: [
          { id: "fn-ar-p3-no", texto: "No" },
          { id: "fn-ar-p3-si", texto: "Sí" },
        ],
      },
    ],
    requisitos: [
      {
        id: "fn-ar-r1",
        tipo: "tramite_previo",
        titulo: "Volante de empadronamiento colectivo de toda la familia",
        explicacion: "Fuente: «Volante de empadronamiento colectivo de todos los miembros de la familia».",
        canal: "ambos",
        tramitePrevioSlug: "empadronamiento-zaragoza",
      },
      {
        id: "fn-ar-r2",
        tipo: "doc_fisico",
        titulo: "Libro de familia o acta de nacimiento",
        explicacion: "Fuente: «Libro de familia o acta de nacimiento».",
        canal: "ambos",
      },
      {
        id: "fn-ar-r3",
        tipo: "doc_fisico",
        titulo: "Documento de firmas para autorizar la consulta de datos",
        explicacion: "Fuente: «Documento de firmas para autorización de la consulta de datos».",
        canal: "ambos",
      },
      {
        id: "fn-ar-r4",
        tipo: "doc_fisico",
        titulo: "Certificado o matrícula de estudios de los hijos de 21 a 25 años",
        explicacion:
          "Fuente: «Certificado o matrícula del centro donde cursen estudios los hijos/as». Cuentan «hasta los 25 años inclusive, si cursan estudios».",
        canal: "ambos",
        soloSiOpciones: ["fn-ar-p3-si"],
      },
      {
        id: "fn-ar-r5",
        tipo: "doc_fisico",
        titulo: "Tarjetas de residencia (miembros extranjeros no comunitarios)",
        explicacion:
          "Fuente: «residencia (solo para personas extranjeras no comunitarias): Tarjetas de residencia de miembros de la unidad familiar».",
        canal: "ambos",
        soloSiOpciones: ["fn-ar-p2-si"],
      },
      {
        id: "fn-ar-r6",
        tipo: "doc_fisico",
        titulo: "Cita previa (para la vía presencial)",
        explicacion:
          "Fuente: se atiende «con cita previa, que puede solicitarse online en citaprevia.aragon.es» o por teléfono.",
        canal: "presencial",
      },
    ],
    prerequisitos: [
      { slug: "empadronamiento-zaragoza", nota: "Hace falta el volante de empadronamiento colectivo." },
    ],
  },

  // ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
  {
    slug: "empadronamiento-zaragoza",
    nivel: "local",
    comunidad: "aragon",
    nombreOficial: "Alta en el Padrón Municipal (Ayuntamiento de Zaragoza)",
    nombreColoquial: "Empadronarse en Zaragoza",
    descripcion:
      "Inscribirse en el padrón del Ayuntamiento de Zaragoza. Es la base de casi todo lo demás en Aragón: la tarjeta sanitaria y la familia numerosa te lo van a pedir. El alta es siempre presencial y sin cita previa.",
    organismo: "Gestión del Padrón · Ayuntamiento de Zaragoza",
    territorio: "Zaragoza (municipio)",
    canales: ["presencial"],
    urlFuente: "https://www.zaragoza.es/sede/servicio/tramite/3317",
    alias: [
      "empadronamiento",
      "empadronarme",
      "padron",
      "empadronarse en zaragoza",
      "volante de empadronamiento",
      "certificado de empadronamiento",
    ],
    preguntas: [
      {
        id: "emp-za-p1",
        orden: 1,
        texto: "¿Quién se empadrona?",
        tipo: "destinatario",
        opciones: [
          { id: "emp-za-p1-yo", texto: "Yo (con mi familia si procede)" },
          { id: "emp-za-p1-menor", texto: "Un menor a mi cargo" },
        ],
      },
      {
        id: "emp-za-p2",
        orden: 2,
        texto: "¿Cómo puedes acreditar que vives ahí?",
        tipo: "normal",
        opciones: [
          { id: "emp-za-p2-propio", texto: "Vivienda propia o de alquiler a mi nombre" },
          { id: "emp-za-p2-ajeno", texto: "Vivo en casa de otra persona" },
        ],
      },
    ],
    requisitos: [
      {
        id: "emp-za-r1",
        tipo: "doc_fisico",
        titulo: "Documento de identidad de todos los que se empadronan",
        explicacion:
          "Fuente: «hay que llevar siempre los documentos de identidad de las personas que se vayan a dar de alta». Requisito de base: «vivir en Zaragoza la mayor parte del año».",
        canal: "presencial",
      },
      {
        id: "emp-za-r2",
        tipo: "doc_fisico",
        titulo: "Documento que acredite que la vivienda es tu residencia habitual",
        explicacion:
          "Fuente: «los documentos que prueben que la vivienda es su residencia habitual» — por ejemplo «contrato de alquiler, escritura de propiedad, último recibo de luz, agua, etc.».",
        canal: "presencial",
        soloSiOpciones: ["emp-za-p2-propio"],
      },
      {
        id: "emp-za-r3",
        tipo: "doc_fisico",
        titulo: "Autorización del titular de la vivienda (impreso M005)",
        explicacion:
          "Si te empadronas en casa de otra persona. Fuente: «[M005] - Autorización para la Inscripción Padronal en el domicilio de otra persona».",
        canal: "presencial",
        soloSiOpciones: ["emp-za-p2-ajeno"],
      },
      {
        id: "emp-za-r4",
        tipo: "doc_fisico",
        titulo: "Documentos que acrediten la filiación del menor",
        explicacion:
          "Fuente: «si se inscribe a menores de edad, deberá presentar los documentos que acrediten la filiación» (libro de familia o certificado de nacimiento).",
        canal: "presencial",
        soloSiOpciones: ["emp-za-p1-menor"],
      },
      {
        id: "emp-za-r5",
        tipo: "doc_fisico",
        titulo: "Ir en persona a una Junta Municipal (sin cita previa)",
        explicacion:
          "El alta no se puede hacer por internet. Fuente: «En caso de ALTA el trámite es obligatoriamente presencial» y se hace «SIN CITA PREVIA. En las Juntas Municipales y Juntas Vecinales». (El volante o certificado sí se pueden pedir online después.)",
        canal: "presencial",
      },
    ],
    prerequisitos: [],
  },

  // ── Preparada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
  {
    slug: "inscripcion-nacimiento",
    nivel: "estatal",
    nombreOficial: "Inscripción de Nacimiento",
    nombreColoquial: "Inscribir al recién nacido",
    descripcion:
      "Registrar al bebé en el Registro Civil: es el asiento que da fe de su nacimiento, su nombre y su filiación, y de él cuelgan después el resto de sus trámites. Corre prisa y hay dos vías con plazos distintos: si lo tramita el hospital, 72 horas; si vais vosotros al Registro Civil, diez días (ampliables a 30 con causa justificada).",
    organismo: "Registro Civil · Ministerio de Justicia",
    territorio: "España",
    canales: ["presencial"],
    urlFuente: "https://www.mjusticia.gob.es/es/ciudadania/tramites/inscripcion-nacimiento",
    alias: [
      "inscribir nacimiento",
      "registrar bebe",
      "registrar recien nacido",
      "inscripcion de nacimiento",
      "registro civil bebe",
      "dar de alta al bebe en el registro",
    ],
    preguntas: [
      {
        id: "insc-p1",
        orden: 1,
        texto: "¿Para quién es la inscripción?",
        tipo: "destinatario",
        opciones: [
          { id: "insc-p1-hijo", texto: "Para mi hijo o hija recién nacido/a" },
          { id: "insc-p1-familiar", texto: "Para el bebé de un familiar (yo lo declaro)" },
        ],
      },
      {
        id: "insc-p2",
        orden: 2,
        texto: "¿Cómo vais a inscribirlo?",
        tipo: "normal",
        opciones: [
          { id: "insc-p2-hospital", texto: "En el propio hospital, en los primeros días" },
          { id: "insc-p2-registro", texto: "Nosotros mismos en el Registro Civil" },
        ],
      },
      {
        id: "insc-p3",
        orden: 3,
        texto: "¿Dónde queréis inscribir el nacimiento?",
        tipo: "normal",
        opciones: [
          { id: "insc-p3-lugar", texto: "En el lugar donde ha nacido" },
          { id: "insc-p3-domicilio", texto: "En el municipio donde vivimos los padres" },
        ],
      },
    ],
    requisitos: [
      {
        id: "insc-r1",
        tipo: "doc_digital",
        titulo: "El certificado médico del nacimiento",
        explicacion:
          "Lo firma el personal sanitario que atendió el parto. Fuente: la declaración se acompaña de «el certificado médico preceptivo firmado electrónicamente por el facultativo». Si nacisteis en un hospital y lo tramita el propio centro, no tenéis que aportarlo vosotros.",
        canal: "presencial",
      },
      {
        id: "insc-r2",
        tipo: "doc_fisico",
        titulo: "El documento oficial de declaración, cumplimentado",
        explicacion:
          "Fuente: «La declaración se efectuará presentando el documento oficial debidamente cumplimentado, que comprenderá la identificación y nacionalidad de los declarantes». Ojo con el nombre elegido: «no se puede designar más de un nombre compuesto ni más de dos simples».",
        canal: "presencial",
      },
      {
        id: "insc-r3",
        tipo: "doc_fisico",
        titulo: "Certificado de empadronamiento de ambos padres",
        explicacion:
          "Solo si inscribís en vuestro municipio y no en el del hospital. Fuente: «Certificado de empadronamiento de ambos padres». Sirve para «acreditar el domicilio común de los padres en el lugar en que se pretende inscribir».",
        canal: "presencial",
        soloSiOpciones: ["insc-p3-domicilio"],
      },
      {
        id: "insc-r4",
        tipo: "doc_fisico",
        titulo: "Certificado del hospital de que el bebé no se ha inscrito ya",
        explicacion:
          "Solo si inscribís en vuestro municipio. Fuente: «Certificado de la Clínica u Hospital de que no se ha promovido ninguna otra inscripción del recién nacido». Además, los padres declaran «bajo su responsabilidad que no han promovido la inscripción en el Registro Civil correspondiente al lugar de nacimiento».",
        canal: "presencial",
        soloSiOpciones: ["insc-p3-domicilio"],
      },
      {
        id: "insc-r5",
        tipo: "doc_fisico",
        titulo: "El DNI de ambos padres, presentes los dos",
        explicacion:
          "Solo si inscribís en vuestro municipio. Fuente: «La acreditación se hará por DNI o, en su defecto, por certificado de empadronamiento», y «se exige que la solicitud se formule por la comparecencia de los progenitores de común acuerdo»: tenéis que ir los dos.",
        canal: "presencial",
        soloSiOpciones: ["insc-p3-domicilio"],
      },
    ],
    prerequisitos: [],
  },

  // ── Preparada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
  {
    slug: "certificado-defuncion",
    nivel: "estatal",
    nombreOficial: "Certificado de Defunción",
    nombreColoquial: "El certificado de defunción",
    descripcion:
      "El documento del Registro Civil que da fe de la muerte de una persona. Es el primer papel que piden casi todas las gestiones que vienen después (pensiones, herencia, bajas). Fuente: «Es el documento expedido por el Registro Civil que da fe de la muerte de una persona y de la fecha y lugar en que se ha producido.»",
    organismo: "Registro Civil · Ministerio de Justicia",
    territorio: "España",
    canales: ["online", "presencial"],
    urlFuente: "https://www.mjusticia.gob.es/es/ciudadania/tramites/certificado-defuncion",
    alias: [
      "certificado de defuncion",
      "partida de defuncion",
      "certificado de fallecimiento",
      "acta de defuncion",
      "certificado defuncion registro civil",
    ],
    preguntas: [
      {
        id: "def-p1",
        orden: 1,
        texto: "¿Quién pide el certificado?",
        tipo: "destinatario",
        opciones: [
          { id: "def-p1-familiar", texto: "Soy familiar de la persona fallecida" },
          { id: "def-p1-tercero", texto: "No soy familiar, pero tengo interés legítimo (p. ej. acreedor)" },
        ],
      },
      {
        id: "def-p2",
        orden: 2,
        texto: "¿Cómo quieres pedirlo?",
        tipo: "normal",
        opciones: [
          { id: "def-p2-online", texto: "Por internet" },
          { id: "def-p2-presencial", texto: "En persona o por correo" },
        ],
      },
    ],
    requisitos: [
      {
        id: "def-r1",
        tipo: "doc_fisico",
        titulo: "Los datos de la persona fallecida",
        explicacion:
          "Nombre y apellidos, y la fecha y el lugar de la defunción. Fuente (Punto de Acceso General): hay que indicar «el nombre, apellidos del fallecido, y el lugar y fecha de defunción».",
        canal: "ambos",
      },
      {
        id: "def-r2",
        tipo: "tecnico",
        titulo: "Cl@ve o certificado digital (o la vía sin identificación)",
        explicacion:
          "Para pedirlo por internet. Fuente: la sede ofrece «Solicitud en línea con identificación CL@VE» y «Solicitud en línea sin identificación CL@VE».",
        canal: "online",
        soloSiOpciones: ["def-p2-online"],
      },
      {
        id: "def-r3",
        tipo: "doc_fisico",
        titulo: "Tu DNI; si es por correo, una carta con tus datos",
        explicacion:
          "Fuente (Punto de Acceso General): por correo se envía una carta con «nombre, apellidos y DNI de la persona que solicita el certificado, así como el nombre, apellidos del fallecido, y el lugar y fecha de defunción». La sede añade que «el certificado solicitado por esta vía se remitirá siempre por correo ordinario al domicilio indicado».",
        canal: "presencial",
        soloSiOpciones: ["def-p2-presencial"],
      },
    ],
    prerequisitos: [],
  },

  // ── Preparada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
  {
    slug: "ultimas-voluntades",
    nivel: "estatal",
    nombreOficial: "Certificado de Actos de Última Voluntad",
    nombreColoquial: "El certificado de últimas voluntades",
    descripcion:
      "El papel que dice si la persona fallecida hizo testamento y ante qué notario: por ahí empieza cualquier herencia. Se pide junto con el certificado de seguros, con el mismo impreso. Ojo: no se puede solicitar hasta pasados 15 días hábiles desde el fallecimiento. Fuente: «El Certificado de Actos de Última Voluntad es el documento que acredita si una persona ha otorgado testamento/s y ante qué Notario/s.»",
    organismo: "Registro de Actos de Última Voluntad · Ministerio de Justicia",
    territorio: "España",
    canales: ["online", "presencial"],
    urlFuente: "https://www.mjusticia.gob.es/es/ciudadania/tramites/certificado-actos-ultima",
    alias: [
      "ultimas voluntades",
      "certificado de ultimas voluntades",
      "actos de ultima voluntad",
      "saber si hay testamento",
      "certificado de testamento",
    ],
    preguntas: [
      {
        id: "uv-p1",
        orden: 1,
        texto: "¿Para quién pides el certificado?",
        tipo: "destinatario",
        opciones: [
          { id: "uv-p1-familiar", texto: "Para la herencia de un familiar" },
          { id: "uv-p1-otro", texto: "En nombre de otra persona fallecida" },
        ],
      },
      {
        id: "uv-p2",
        orden: 2,
        texto: "¿Cuándo falleció la persona?",
        tipo: "normal",
        opciones: [
          { id: "uv-p2-post", texto: "Después del 2 de abril de 2009" },
          { id: "uv-p2-pre", texto: "Antes de esa fecha, o la defunción se inscribió en un Juzgado de Paz" },
        ],
      },
      {
        id: "uv-p3",
        orden: 3,
        texto: "¿Cómo lo vas a tramitar?",
        tipo: "normal",
        opciones: [
          { id: "uv-p3-online", texto: "Por internet, con Cl@ve" },
          { id: "uv-p3-presencial", texto: "En persona o por correo" },
        ],
      },
    ],
    requisitos: [
      {
        id: "uv-r1",
        tipo: "doc_fisico",
        titulo: "La tasa: 3,86 € (modelo 790, tasa 006)",
        explicacion:
          "Fuente: «debe realizar el pago telemático de la tasa 006 asociada a la solicitud». El importe, según la Oficina de Justicia en el Municipio (ojm.justicia.es): «PRECIO DE LA TASA: 3,86 €».",
        canal: "ambos",
      },
      {
        id: "uv-r2",
        tipo: "tecnico",
        titulo: "Cl@ve",
        explicacion:
          "Para la vía online. Fuente: «Tramitación On-line con CL@VE». Solo vale si el fallecimiento es posterior al 2 de abril de 2009 y la defunción no se inscribió en un Juzgado de Paz.",
        canal: "online",
        soloSiOpciones: ["uv-p3-online"],
      },
      {
        id: "uv-r3",
        tipo: "doc_fisico",
        titulo: "El modelo 790 cumplimentado",
        explicacion:
          "Para pedirlo en persona o por correo. Fuente: «La presentación del formulario 790 es necesaria para solicitar un certificado de forma presencial o por correo».",
        canal: "presencial",
        soloSiOpciones: ["uv-p3-presencial"],
      },
      {
        id: "uv-r4",
        tipo: "tramite_previo",
        titulo: "El certificado literal de defunción",
        explicacion:
          "Solo si el fallecimiento es anterior al 2 de abril de 2009 o la defunción se inscribió en un Juzgado de Paz. Fuente: en ese caso «ha de acudir a la vía presencial o por correo postal pues ha de acompañar a su solicitud el certificado literal de defunción».",
        canal: "presencial",
        tramitePrevioSlug: "certificado-defuncion",
        soloSiOpciones: ["uv-p2-pre"],
      },
    ],
    prerequisitos: [
      {
        slug: "certificado-defuncion",
        nota: "Solo si el fallecimiento es anterior al 2/4/2009 o la defunción se inscribió en un Juzgado de Paz; en los demás casos la vía online no lo pide.",
      },
    ],
  },

  // ── Preparada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
  {
    slug: "seguros-fallecimiento",
    nivel: "estatal",
    nombreOficial: "Certificado de Contratos de Seguros de cobertura de fallecimiento",
    nombreColoquial: "Saber qué seguros de vida tenía",
    descripcion:
      "El documento que dice con qué aseguradora tenía la persona fallecida un seguro de vida o de accidentes, para poder reclamarlo. Se pide a la vez que el de últimas voluntades, con el mismo modelo 790, y tampoco antes de 15 días hábiles desde el fallecimiento. Fuente: es el «documento que acredita los contratos vigentes en que figuraba como asegurada la persona fallecida y con qué entidad aseguradora».",
    organismo: "Registro de Contratos de Seguros de Cobertura de Fallecimiento · Ministerio de Justicia",
    territorio: "España",
    canales: ["online", "presencial"],
    urlFuente: "https://www.mjusticia.gob.es/es/ciudadania/tramites/certificado-contratos-seguros",
    alias: [
      "seguros de fallecimiento",
      "certificado de seguros de vida",
      "saber si tenia seguro de vida",
      "contratos de seguros de cobertura de fallecimiento",
      "registro de seguros de vida",
    ],
    preguntas: [
      {
        id: "seg-p1",
        orden: 1,
        texto: "¿Para quién pides el certificado?",
        tipo: "destinatario",
        opciones: [
          { id: "seg-p1-familiar", texto: "Para gestionar el fallecimiento de un familiar" },
          { id: "seg-p1-tercero", texto: "Para otra persona (con interés en saberlo)" },
        ],
      },
      {
        id: "seg-p2",
        orden: 2,
        texto: "¿Cuándo falleció la persona?",
        tipo: "normal",
        opciones: [
          { id: "seg-p2-post", texto: "Después del 2 de abril de 2009" },
          { id: "seg-p2-pre", texto: "Antes de esa fecha, o la defunción se inscribió en un Tribunal de Instancia" },
        ],
      },
      {
        id: "seg-p3",
        orden: 3,
        texto: "¿Cómo lo vas a tramitar?",
        tipo: "normal",
        opciones: [
          { id: "seg-p3-online", texto: "Por internet" },
          { id: "seg-p3-presencial", texto: "En persona o por correo" },
        ],
      },
    ],
    requisitos: [
      {
        id: "seg-r1",
        tipo: "doc_fisico",
        titulo: "La tasa: 3,86 € (modelo 790, tasa 006)",
        explicacion:
          "Fuente: «debe realizar el pago telemático de la tasa 006 asociada a la solicitud». El importe, según la Oficina de Justicia en el Municipio (ojm.justicia.es): «PRECIO DE LA TASA: 3,86 €».",
        canal: "ambos",
      },
      {
        id: "seg-r2",
        tipo: "tecnico",
        titulo: "Cl@ve o certificado digital (o la vía sin certificado)",
        explicacion:
          "Para la vía online. Fuente: la sede ofrece «Tramitación On-line con CL@VE» y «Tramitación On-line sin Certificado Digital».",
        canal: "online",
        soloSiOpciones: ["seg-p3-online"],
      },
      {
        id: "seg-r3",
        tipo: "doc_fisico",
        titulo: "El modelo 790 cumplimentado",
        explicacion:
          "Para pedirlo en persona o por correo. Fuente: «La presentación del formulario 790 es necesaria para solicitar un certificado de forma presencial o por correo».",
        canal: "presencial",
        soloSiOpciones: ["seg-p3-presencial"],
      },
      {
        id: "seg-r4",
        tipo: "tramite_previo",
        titulo: "El certificado literal de defunción",
        explicacion:
          "Solo si el fallecimiento es anterior al 2 de abril de 2009 o la defunción se inscribió en un Tribunal de Instancia. Fuente: «SI LA FECHA DEL FALLECIMIENTO ES POSTERIOR AL 2 DE ABRIL DE 2009 Y LA DEFUNCIÓN NO ESTÁ INSCRITA EN UN TRIBUNAL DE INSTANCIA NO ES NECESARIO PRESENTAR EL CERTIFICADO DE DEFUNCIÓN»; en los demás casos, «Certificado Literal de Defunción, que habrá de ser original o fotocopia compulsada, expedido por el Registro Civil».",
        canal: "presencial",
        tramitePrevioSlug: "certificado-defuncion",
        soloSiOpciones: ["seg-p2-pre"],
      },
    ],
    prerequisitos: [
      {
        slug: "certificado-defuncion",
        nota: "Solo si el fallecimiento es anterior al 2/4/2009 o la defunción se inscribió en un Tribunal de Instancia.",
      },
    ],
  },

  // ── Preparada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
  {
    slug: "transferencia-vehiculo",
    nivel: "estatal",
    nombreOficial: "Transferencia o cambio de titularidad de un vehículo",
    nombreColoquial: "Cambiar un coche de dueño",
    descripcion:
      "Poner a tu nombre un coche de segunda mano que compras. La haces tú, como comprador. Tienes de plazo 30 días desde la compra. Fuente: «Tras la firma del contrato de compraventa, estás obligado a realizar el cambio de titularidad del vehículo en un plazo máximo de 30 días».",
    organismo: "DGT · Dirección General de Tráfico",
    territorio: "España",
    canales: ["online", "presencial"],
    urlFuente: "https://sede.dgt.gob.es/es/vehiculos/transferencias-de-vehiculos/",
    urlCitaPrevia: "https://sedeclave.dgt.gob.es/WEB_NCIT_CONSULTA/solicitarCita.faces",
    alias: [
      "transferencia de vehiculo",
      "cambio de titularidad",
      "cambiar coche de dueno",
      "poner el coche a mi nombre",
      "comprar coche de segunda mano",
    ],
    preguntas: [
      {
        id: "tv-p1",
        orden: 1,
        texto: "¿Qué papel tienes en la compraventa?",
        tipo: "destinatario",
        opciones: [
          { id: "tv-p1-compro", texto: "Compro el coche (soy el nuevo titular)" },
          {
            id: "tv-p1-vendo",
            texto: "Vendo el coche",
            veredictoInviable: true,
            textoAlternativas:
              "La transferencia la hace quien compra. Tú, como vendedor, tienes que hacer la notificación de venta para dejar de responder por las multas del coche. Fuente: «La notificación de venta debe hacerla siempre el vendedor del vehículo o cualquier persona autorizada en su nombre», y «la responsabilidad de las posibles sanciones deja de ser del vendedor del vehículo desde que se realiza la notificación». Es un trámite aparte en la DGT (tasa de 8,67 €).",
          },
        ],
      },
      {
        id: "tv-p2",
        orden: 2,
        texto: "¿Cómo quieres tramitarlo?",
        tipo: "normal",
        opciones: [
          { id: "tv-p2-online", texto: "Por internet" },
          { id: "tv-p2-presencial", texto: "En persona, en una Jefatura de Tráfico" },
        ],
      },
      {
        id: "tv-p3",
        orden: 3,
        texto: "¿Quién te vende el coche?",
        tipo: "normal",
        opciones: [
          { id: "tv-p3-particular", texto: "Un particular" },
          { id: "tv-p3-profesional", texto: "Un profesional (concesionario, compraventa)" },
        ],
      },
    ],
    requisitos: [
      {
        id: "tv-r1",
        tipo: "doc_fisico",
        titulo: "El contrato de compraventa, firmado en todas las hojas",
        explicacion:
          "Fuente: el «Contrato de compraventa ha de estar firmado en cada una de las hojas que lo componen por ti, como comprador, y por el vendedor».",
        canal: "ambos",
      },
      {
        id: "tv-r2",
        tipo: "tramite_previo",
        titulo: "Pagar el impuesto de transmisiones (ITP) antes de la transferencia",
        explicacion:
          "El trámite escondido que frena a mucha gente. Fuente: «Antes de realizar el cambio de titularidad, debes justificar el pago, exención o no sujeción al Impuesto de Transmisiones Patrimoniales (modelo 620 o 621)». Se paga en tu comunidad autónoma.",
        canal: "ambos",
        soloSiOpciones: ["tv-p3-particular"],
      },
      {
        id: "tv-r3",
        tipo: "doc_fisico",
        titulo: "La factura de compra",
        explicacion:
          "Si compras a un profesional, en vez del ITP va la factura. Fuente: se aporta el justificante del ITP «salvo que el vendedor sea un empresario en el ejercicio de su actividad, en cuyo caso se aportará factura».",
        canal: "ambos",
        soloSiOpciones: ["tv-p3-profesional"],
      },
      {
        id: "tv-r4",
        tipo: "tramite_previo",
        titulo: "El impuesto de circulación (IVTM) del año anterior, al corriente",
        explicacion:
          "Fuente: hay que «Tener abonado el Impuesto de Circulación del año anterior». Es el impuesto municipal del coche.",
        canal: "ambos",
      },
      {
        id: "tv-r5",
        tipo: "doc_fisico",
        titulo: "La tasa de la DGT: 55,70 € (27,85 € si es ciclomotor)",
        explicacion:
          "Fuente: «tienes que adquirir la tasa 1.5 de 55,70 €»; «excepto ciclomotores 27,85€ (no se admite el pago en metálico)».",
        canal: "ambos",
      },
      {
        id: "tv-r6",
        tipo: "doc_fisico",
        titulo: "El documento de identidad del comprador y del vendedor",
        explicacion:
          "Fuente: «el comprador presentará documento oficial que acredite su identidad y domicilio (DNI, permiso de conducción español, tarjeta de residencia, pasaporte más Número de Identificación de Extranjeros)».",
        canal: "ambos",
      },
      {
        id: "tv-r7",
        tipo: "tecnico",
        titulo: "La ITV en vigor",
        explicacion:
          "Fuente: al terminar «se expedirá un nuevo permiso de circulación que únicamente será válido si posee la ITV en vigor».",
        canal: "ambos",
      },
      {
        id: "tv-r8",
        tipo: "tecnico",
        titulo: "Certificado digital, DNI electrónico o Cl@ve",
        explicacion:
          "Para hacerlo por internet. Fuente: hace falta «Tu certificado digital, DNI electrónico o tus credenciales Cl@ve para acceder al servicio».",
        canal: "online",
        soloSiOpciones: ["tv-p2-online"],
      },
      {
        id: "tv-r9",
        tipo: "doc_fisico",
        titulo: "Cita previa y la solicitud en impreso oficial",
        explicacion:
          "Para la vía presencial. Fuente: «Debes solicitar cita previa por internet o llamando al 060», y presentar la «Solicitud en impreso oficial».",
        canal: "presencial",
        soloSiOpciones: ["tv-p2-presencial"],
      },
    ],
    prerequisitos: [],
  },

  // ── Preparada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
  {
    slug: "carnet-conducir",
    nivel: "estatal",
    nombreOficial: "Obtención del permiso de conducción",
    nombreColoquial: "Sacarse el carnet de conducir",
    descripcion:
      "Obtener por primera vez el permiso de conducir: hay que residir en España, pasar un reconocimiento médico y aprobar el examen teórico y el práctico. Fuente: hay que «Residir en España», «Reunir las aptitudes psicofísicas requeridas» y «Ser declarado apto por la Jefatura Provincial de Tráfico en las pruebas teóricas y prácticas», y «No estar privado por resolución judicial del derecho a conducir vehículos de motor».",
    organismo: "DGT · Dirección General de Tráfico",
    territorio: "España",
    canales: ["online", "presencial"],
    urlFuente:
      "https://www.dgt.es/nuestros-servicios/permisos-de-conducir/obtener-un-nuevo-permiso-de-conducir/requisitos-preparacion-y-presentacion-a-examen/",
    alias: [
      "carnet de conducir",
      "sacarse el carnet",
      "permiso de conducir",
      "obtener el carnet",
      "carne de conducir",
    ],
    preguntas: [
      {
        id: "cc-p1",
        orden: 1,
        texto: "¿Para quién es el carnet?",
        tipo: "destinatario",
        opciones: [
          { id: "cc-p1-yo", texto: "Para mí" },
          {
            id: "cc-p1-otro",
            texto: "Para otra persona",
            veredictoInviable: true,
            textoAlternativas:
              "El carnet es personal: hay que aprobar en persona las pruebas. Fuente: «Ser declarado apto por la Jefatura Provincial de Tráfico en las pruebas teóricas y prácticas». No puedes examinarte por otra persona. Sí puedes ayudarle a reunir los papeles y a buscar autoescuela.",
          },
        ],
      },
      {
        id: "cc-p2",
        orden: 2,
        texto: "¿Cómo te vas a presentar?",
        tipo: "normal",
        opciones: [
          { id: "cc-p2-autoescuela", texto: "A través de una autoescuela" },
          { id: "cc-p2-libre", texto: "Por libre" },
        ],
      },
      {
        id: "cc-p3",
        orden: 3,
        texto: "¿Eres estudiante extranjero de fuera de la Unión Europea?",
        tipo: "normal",
        opciones: [
          { id: "cc-p3-no", texto: "No" },
          { id: "cc-p3-si", texto: "Sí" },
        ],
      },
    ],
    requisitos: [
      {
        id: "cc-r1",
        tipo: "tramite_previo",
        titulo: "El informe de aptitud psicofísica (el psicotécnico)",
        explicacion:
          "Se hace en un centro de reconocimiento antes del examen. Fuente: «Informe de aptitud psicofísica, expedido por un Centro de Reconocimiento de Conductores autorizado». Ojo: «Este certificado tiene un período de validez de 90 días».",
        canal: "presencial",
      },
      {
        id: "cc-r2",
        tipo: "doc_fisico",
        titulo: "Una fotografía de 32×26 mm",
        explicacion:
          "Fuente: «Fotografía original actual (de 32 x 26 mm) en color y con fondo liso, tomada de frente con la cabeza descubierta y sin gafas de cristales oscuros o cualquier otra prenda que pueda impedir o dificultar tu identificación».",
        canal: "ambos",
      },
      {
        id: "cc-r3",
        tipo: "tramite_previo",
        titulo: "Aprobar el examen teórico y el práctico",
        explicacion:
          "Es el núcleo del trámite. Fuente: «será necesario superar un examen específico teórico y otro práctico». El aprobado de una prueba se guarda dos años: «El aprobado de una prueba se guardará durante dos años».",
        canal: "presencial",
      },
      {
        id: "cc-r4",
        tipo: "doc_fisico",
        titulo: "La tasa de la DGT",
        explicacion:
          "Fuente: «Tienes que presentar la documentación original y pagar la tasa correspondiente a cada tipo de permiso». (El importe exacto no lo fijamos aquí: la sede lo carga de forma dinámica; conviene comprobarlo al pagar.)",
        canal: "ambos",
      },
      {
        id: "cc-r5",
        tipo: "doc_fisico",
        titulo: "Acreditar 6 meses de estancia como estudiante",
        explicacion:
          "Fuente: «Si eres estudiante extranjero no perteneciente a la Unión Europea, deberás demostrar que estás en esta circunstancia durante un período mínimo continuado de seis meses».",
        canal: "ambos",
        soloSiOpciones: ["cc-p3-si"],
      },
    ],
    prerequisitos: [],
  },

  // ── Preparada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
  {
    slug: "matriculacion-vehiculo",
    nivel: "estatal",
    nombreOficial: "Matriculación ordinaria de vehículos",
    nombreColoquial: "Matricular un vehículo",
    descripcion:
      "Dar de alta un vehículo para poder circular con él: hace falta pagar sus impuestos, tener la ficha técnica de la ITV y pagar la tasa de la DGT. Fuente: «La matriculación de un vehículo es un requisito previo a que puedas circular con él por las vías públicas».",
    organismo: "DGT · Dirección General de Tráfico",
    territorio: "España",
    canales: ["online", "presencial"],
    urlFuente:
      "https://sede.dgt.gob.es/es/vehiculos/matriculaciones-de-vehiculos/matriculacion-ordinaria/",
    urlCitaPrevia: "https://sedeclave.dgt.gob.es/WEB_NCIT_CONSULTA/solicitarCita.faces",
    alias: [
      "matricular un vehiculo",
      "matriculacion",
      "matricular coche nuevo",
      "dar de alta un coche",
      "matricular un coche importado",
    ],
    preguntas: [
      {
        id: "mv-p1",
        orden: 1,
        texto: "¿A nombre de quién se matricula?",
        tipo: "destinatario",
        opciones: [
          { id: "mv-p1-particular", texto: "A mi nombre (particular)" },
          { id: "mv-p1-empresa", texto: "A nombre de una empresa" },
        ],
      },
      {
        id: "mv-p2",
        orden: 2,
        texto: "¿Qué vehículo es?",
        tipo: "normal",
        opciones: [
          { id: "mv-p2-nuevo", texto: "Nuevo, comprado en España o la UE" },
          { id: "mv-p2-importado", texto: "Importado de fuera de la UE" },
        ],
      },
      {
        id: "mv-p3",
        orden: 3,
        texto: "¿Cómo quieres tramitarlo?",
        tipo: "normal",
        opciones: [
          { id: "mv-p3-online", texto: "Por internet" },
          { id: "mv-p3-presencial", texto: "En persona, en una Jefatura de Tráfico" },
        ],
      },
    ],
    requisitos: [
      {
        id: "mv-r1",
        tipo: "tramite_previo",
        titulo: "Pagar el impuesto de matriculación (o acreditar la exención)",
        explicacion:
          "Fuente: «Justificante del pago/exención/no sujeción del Impuesto de Matriculación (modelo 576, 06 o 05 de la Agencia Estatal Tributaria, www.aeat.es), excepto en el caso de remolques».",
        canal: "ambos",
      },
      {
        id: "mv-r2",
        tipo: "tramite_previo",
        titulo: "El impuesto de circulación (IVTM) del ayuntamiento, pagado o exento",
        explicacion:
          "Fuente: «Justificante del pago o exención del Impuesto de Circulación del Ayuntamiento en el que tenga su domicilio el solicitante (original o fotocopia)».",
        canal: "ambos",
      },
      {
        id: "mv-r3",
        tipo: "tecnico",
        titulo: "La tarjeta de la ITV (NIVE electrónica o en papel)",
        explicacion:
          "Fuente: «Tarjeta de ITV electrónica (NIVE) o tarjeta de ITV en formato papel con la diligencia de venta, o en su defecto factura o acta de adjudicación si procede de subasta».",
        canal: "ambos",
      },
      {
        id: "mv-r4",
        tipo: "doc_fisico",
        titulo: "La tasa de la DGT: 99,77 € (27,85 € si es ciclomotor)",
        explicacion:
          "Fuente: «Tasa por importe de 99,77 €, excepto ciclomotores 27,85 €. (No se admite el pago en metálico)».",
        canal: "ambos",
      },
      {
        id: "mv-r5",
        tipo: "doc_fisico",
        titulo: "El documento de identidad del titular",
        explicacion:
          "Fuente: «documento oficial que acredite la identidad y domicilio del titular (DNI, permiso de conducción español, tarjeta de residencia, pasaporte más Número de Identificación de Extranjeros)».",
        canal: "ambos",
      },
      {
        id: "mv-r6",
        tipo: "doc_fisico",
        titulo: "El DUA de la Aduana",
        explicacion:
          "Para vehículos de fuera de la UE. Fuente: «Documento Único Administrativo (DUA) expedido por la Aduana, salvo que en la tarjeta de ITV conste la diligencia de importación del vehículo».",
        canal: "ambos",
        soloSiOpciones: ["mv-p2-importado"],
      },
      {
        id: "mv-r7",
        tipo: "tecnico",
        titulo: "Certificado digital, DNI electrónico o Cl@ve, y la ITV electrónica (NIVE)",
        explicacion:
          "Para la vía online. Fuente: hace falta «Certificado digital, DNI electrónico o credenciales Cl@ve» y «Tarjeta de ITV electrónica (NIVE)».",
        canal: "online",
        soloSiOpciones: ["mv-p3-online"],
      },
      {
        id: "mv-r8",
        tipo: "doc_fisico",
        titulo: "Cita previa y la solicitud en impreso oficial",
        explicacion:
          "Para la vía presencial. Fuente: «antes de presentar el trámite en jefatura deberá solicitar cita previa», y la «Solicitud en impreso oficial».",
        canal: "presencial",
        soloSiOpciones: ["mv-p3-presencial"],
      },
    ],
    prerequisitos: [],
  },
];
