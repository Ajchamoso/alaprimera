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
          "Fuente: «32 por 26 milímetros», «con fondo uniforme blanco y liso, tomada de frente, con la cabeza totalmente descubierta», con antigüedad «máxima de 2 años» y debe «Representar fielmente la imagen de la persona interesada».",
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
        titulo: "El importe de la tasa (efectivo o tarjeta)",
        explicacion:
          "Fuente: «abono en efectivo o a través de tarjeta de crédito/débito», o el justificante si ya la pagaste por internet. El importe vigente, en la fuente oficial.",
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
