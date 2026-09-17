import type { TramiteContenido } from "@/lib/types";

// ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
export const certificadoDigitalFnmt: TramiteContenido = {
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
  ],
  requisitos: [
    {
      id: "cert-r1",
      tipo: "tramite_previo",
      titulo: "El DNI con el que vas a acreditarte",
      explicacion:
        "Fuente (ciudadanos españoles), sobre lo que hay que llevar a la oficina: «El código de solicitud que le ha sido remitido a su cuenta de correo electrónico y el Documento Nacional de Identidad (DNI), pasaporte o carné de conducir». Consejo nuestro, no de la fuente: si el tuyo está caducado, renuévalo antes de empezar, porque entre la solicitud y la acreditación no conviene parar.",
      canal: "ambos",
      tramitePrevioSlug: "renovacion-dni",
      soloSiOpciones: ["cert-p2-es"],
    },
    {
      id: "cert-r2",
      tipo: "tecnico",
      titulo: "Instalar el CONFIGURADOR FNMT-RCM",
      explicacion:
        "Es el programa oficial que genera las claves. Sin él no se puede ni empezar la solicitud. Fuente: «La Fábrica Nacional de Moneda y Timbre ha desarrollado esta aplicación para solicitar las claves necesarias en la obtención de un certificado digital». No te preocupes por tu sistema: «Puede ser ejecutada en cualquier navegador y sistema Operativo».",
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
};
