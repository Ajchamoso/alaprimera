import type { Tramite } from "@/lib/types";

/**
 * Fichas del catálogo.
 *
 * ⚠️ REGLA DE ORO (FR-019): el contenido sale de la fuente oficial, nunca de la
 * memoria de un modelo. Cada requisito lleva su cita literal en `fuenteCita`.
 * Las fichas nacen con `verificadaEn: null` ("sin verificar") y solo una persona
 * que las coteje contra `urlFuente` puede fechar la verificación.
 *
 * Flujo de curación: se extrae de la fuente con IA (con cita obligatoria; sin
 * cita, el campo va vacío) → se vuelca a BD con `npm run db:seed` → una persona
 * revisa y sella. Ver docs/curacion.md.
 */
export const tramites: Tramite[] = [
  // ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
  {
    slug: "renovacion-dni",
    nombreOficial: "Renovación del DNI",
    nombreColoquial: "Renovar el carnet de identidad",
    descripcion:
      "Renovar el DNI cuando está caducado o a punto de caducar, se ha deteriorado o has perdido el anterior. Hay que ir en persona y con cita previa a una oficina de expedición.",
    organismo: "Policía Nacional (Ministerio del Interior)",
    territorio: "España",
    canales: ["presencial"],
    urlFuente: "https://www.dnielectronico.es/PortalDNIe/PRF1_Cons02.action?pag=REF_420&id_menu=7_8",
    urlCitaPrevia: "https://www.citapreviadnie.es/",
    verificadaEn: null,
    generadaPorIa: true,
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
    nombreOficial: "Primera inscripción del DNI",
    nombreColoquial: "El primer DNI (de un niño o niña)",
    descripcion:
      "Sacar el DNI por primera vez. Hay que ir en persona con cita previa, y trae dos trámites escondidos: el certificado de nacimiento del Registro Civil y el empadronamiento — ambos con fecha de caducidad.",
    organismo: "Policía Nacional (Ministerio del Interior)",
    territorio: "España",
    canales: ["presencial"],
    urlFuente: "https://www.dnielectronico.es/PortalDNIe/PRF1_Cons02.action?pag=REF_410",
    urlCitaPrevia: "https://www.citapreviadnie.es/",
    verificadaEn: null,
    generadaPorIa: true,
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
          "Fuente: se hará «en presencia de quien tenga encomendada la patria potestad o tutela […] el cual deberá aportar su DNI, Tarjeta de Identificación de Extranjero (TIE) o Certificado de Registro de Ciudadano de la Unión». Ojo: aquí la fuente habla en singular — a diferencia del pasaporte, NO exige el consentimiento de ambos progenitores.",
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
    nombreOficial: "Pasaporte ordinario",
    nombreColoquial: "El pasaporte",
    descripcion:
      "Sacar o renovar el pasaporte. Se hace en persona con cita previa. Para menores hace falta el consentimiento de TODAS las personas con patria potestad — no solo de quien tiene la custodia.",
    organismo: "Policía Nacional (Ministerio del Interior)",
    territorio: "España",
    canales: ["presencial"],
    urlFuente: "https://www.dnielectronico.es/PortalDNIe/PRF1_Cons02.action?pag=REF_1084",
    urlCitaPrevia: "https://www.citapreviadnie.es/",
    verificadaEn: null,
    generadaPorIa: true,
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
    nombreOficial: "Certificación de nacimiento (Registro Civil)",
    nombreColoquial: "El certificado de nacimiento",
    descripcion:
      "El documento del Registro Civil que acredita tu nacimiento. Hace falta para el primer DNI y para el pasaporte de un menor sin DNI. Se puede pedir por internet, en persona o por correo.",
    organismo: "Registro Civil · Ministerio de la Presidencia, Justicia y Relaciones con las Cortes",
    territorio: "España",
    canales: ["online", "presencial"],
    urlFuente: "https://www.mjusticia.gob.es/es/ciudadania/tramite?k=solicitud-certificado-nacimiento-presencial",
    verificadaEn: null,
    generadaPorIa: true,
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
    nombreOficial: "Padrón Municipal: alta y cambio de domicilio (Ayuntamiento de Madrid)",
    nombreColoquial: "Empadronarse en Madrid",
    descripcion:
      "Inscribirse en el padrón del Ayuntamiento de Madrid, o cambiar de domicilio dentro de la ciudad. Es la base de casi todo lo demás: el DNI, la tarjeta sanitaria o el colegio te lo van a pedir.",
    organismo: "Servicio de Padrón de Habitantes · Ayuntamiento de Madrid",
    territorio: "Madrid (municipio)",
    canales: ["online", "presencial"],
    urlFuente:
      "https://sede.madrid.es/portal/site/tramites/menuitem.1f3361415fda829be152e15284f1a5a0/?vgnextoid=aa17f9ca0b30b310VgnVCM1000000b205a0aRCRD",
    verificadaEn: null,
    generadaPorIa: true,
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
    slug: "beca-comedor-madrid",
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
    verificadaEn: null,
    generadaPorIa: true,
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
          "Fuente: «Para realizar este trámite por medios electrónicos necesitas uno de los sistemas de firma electrónica reconocidos por la Comunidad de Madrid». El certificado digital de la FNMT es uno de los habituales — confirma en la fuente cuáles admite tu convocatoria.",
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
    nombreOficial: "Certificado digital de persona física (software) — acreditación presencial",
    nombreColoquial: "El certificado para hacer trámites por internet",
    descripcion:
      "El certificado digital te identifica en las sedes electrónicas y te permite hacer trámites online (becas, Hacienda, Seguridad Social…) sin desplazarte. El proceso tiene cuatro pasos: instalar un programa, solicitarlo por internet, acreditar tu identidad en una oficina y descargarlo.",
    organismo: "FNMT — Fábrica Nacional de Moneda y Timbre",
    territorio: "España",
    canales: ["online"],
    urlFuente: "https://www.sede.fnmt.gob.es/certificados/persona-fisica/obtener-certificado-software",
    verificadaEn: null,
    generadaPorIa: true,
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
        titulo: "El mismo ordenador y usuario de principio a fin — y no formatearlo",
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
];
