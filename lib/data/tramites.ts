import type { Tramite } from "@/lib/types";

/**
 * Seed de desarrollo: 2 fichas de prueba encadenadas (T-003).
 *
 * ⚠️ Contenido de EJEMPLO, aún no cotejado contra la fuente oficial:
 * por eso `verificadaEn` es null y la UI muestra el aviso "sin verificar".
 * Antes de publicar, cada requisito se coteja contra `urlFuente` (regla de oro).
 *
 * En la Fase 2 estas fichas migran a Supabase; este módulo queda como
 * fixture de tests y fallback de desarrollo local.
 */
export const tramites: Tramite[] = [
  {
    slug: "renovacion-dni",
    nombreOficial: "Renovación del DNI",
    nombreColoquial: "Renovar el carnet de identidad",
    descripcion:
      "Renovar el DNI cuando está caducado o a punto de caducar, se ha deteriorado o has perdido el anterior. Se hace siempre en persona, en un equipo de expedición de la Policía Nacional.",
    organismo: "Policía Nacional (Ministerio del Interior)",
    territorio: "España",
    canales: ["presencial"],
    urlFuente: "https://www.dnielectronico.es/PortalDNIe/",
    urlCitaPrevia: "https://www.citapreviadnie.es/",
    verificadaEn: null,
    generadaPorIa: false,
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
              "El DNI es personal: la persona titular tiene que acudir en persona a renovarlo, no puedes hacerlo tú en su lugar. Lo que sí puedes hacer: pedirle tú la cita previa, preparar esta checklist para ella y acompañarla el día de la cita.",
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
    ],
    requisitos: [
      {
        id: "dni-r1",
        tipo: "doc_fisico",
        titulo: "Una fotografía reciente en color (32×26 mm)",
        explicacion:
          "Tamaño carnet, fondo blanco liso, de frente y sin gafas oscuras. En muchos fotomatones existe la opción 'foto DNI'.",
        canal: "presencial",
      },
      {
        id: "dni-r2",
        tipo: "doc_fisico",
        titulo: "El DNI anterior",
        explicacion: "Se entrega en el momento de la renovación.",
        canal: "presencial",
        soloSiOpciones: ["dni-p2-caducidad", "dni-p2-deterioro"],
      },
      {
        id: "dni-r3",
        tipo: "doc_fisico",
        titulo: "Denuncia o declaración de pérdida",
        explicacion:
          "Si fue robo, la denuncia de la Policía. Si fue pérdida, podrás firmar una declaración en la propia oficina.",
        canal: "presencial",
        soloSiOpciones: ["dni-p2-perdida"],
      },
      {
        id: "dni-r4",
        tipo: "doc_fisico",
        titulo: "Justificante del nuevo domicilio",
        explicacion:
          "Volante o certificado de empadronamiento con menos de 3 meses, para actualizar la dirección.",
        canal: "presencial",
        soloSiOpciones: ["dni-p3-si"],
      },
      {
        id: "dni-r5",
        tipo: "doc_fisico",
        titulo: "Importe de la tasa",
        explicacion:
          "La renovación tiene una tasa (consulta el importe vigente en la fuente oficial). En algunas oficinas solo se paga en efectivo.",
        canal: "presencial",
      },
      {
        id: "dni-r6",
        tipo: "doc_fisico",
        titulo: "Libro de familia o certificado de nacimiento (menores)",
        explicacion:
          "Para acreditar quién ejerce la patria potestad. El menor debe acudir acompañado de quien la ejerce.",
        canal: "presencial",
        soloSiOpciones: ["dni-p1-menor"],
      },
    ],
    prerequisitos: [],
  },
  {
    slug: "certificado-digital-fnmt",
    nombreOficial: "Certificado digital de persona física (FNMT)",
    nombreColoquial: "El certificado para hacer trámites por internet",
    descripcion:
      "El certificado digital te identifica en las sedes electrónicas y te permite hacer trámites online (becas, Hacienda, Seguridad Social…) sin desplazarte. Se solicita por internet y hay que acreditar tu identidad.",
    organismo: "FNMT — Fábrica Nacional de Moneda y Timbre",
    territorio: "España",
    canales: ["online"],
    urlFuente: "https://www.sede.fnmt.gob.es/certificados/persona-fisica",
    verificadaEn: null,
    generadaPorIa: false,
    alias: [
      "certificado digital",
      "certificado electrónico",
      "fnmt",
      "firma digital",
      "certificado para tramites online",
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
              "El certificado digital es personal e intransferible: no puedes solicitarlo tú en nombre de otra persona adulta. Tus opciones reales: (1) que lo solicite ella con tu ayuda, sentados juntos; (2) acompañarla a acreditar su identidad el día de la cita; (3) si lo que necesitas es actuar por ella ante la administración, mira el trámite de apoderamiento.",
          },
        ],
      },
      {
        id: "cert-p2",
        orden: 2,
        texto: "¿Cómo prefieres acreditar tu identidad?",
        tipo: "normal",
        opciones: [
          { id: "cert-p2-video", texto: "Por vídeo identificación (todo online)" },
          { id: "cert-p2-oficina", texto: "En una oficina de registro (presencial)" },
          { id: "cert-p2-dnie", texto: "Con mi DNI electrónico y un lector" },
        ],
      },
    ],
    requisitos: [
      {
        id: "cert-r1",
        tipo: "tramite_previo",
        titulo: "DNI en vigor",
        explicacion:
          "Sin un documento de identidad en vigor no puedes acreditarte. Si está caducado, primero toca renovarlo.",
        canal: "ambos",
        tramitePrevioSlug: "renovacion-dni",
      },
      {
        id: "cert-r2",
        tipo: "tecnico",
        titulo: "Ordenador con un navegador compatible",
        explicacion:
          "La solicitud se hace desde el ordenador donde luego instalarás el certificado. Consulta en la fuente oficial los navegadores admitidos.",
        canal: "online",
      },
      {
        id: "cert-r3",
        tipo: "tecnico",
        titulo: "Software de configuración de la FNMT instalado",
        explicacion:
          "Un programa oficial que prepara el ordenador para generar las claves. Se descarga desde la propia web de la FNMT antes de empezar.",
        canal: "online",
      },
      {
        id: "cert-r4",
        tipo: "doc_digital",
        titulo: "Una dirección de email a la que tengas acceso",
        explicacion: "Ahí recibirás el código de solicitud y el aviso para descargar el certificado.",
        canal: "online",
      },
      {
        id: "cert-r5",
        tipo: "doc_fisico",
        titulo: "Acreditar tu identidad en una oficina de registro",
        explicacion:
          "Con tu código de solicitud y tu DNI, en una oficina de registro (muchas exigen cita previa).",
        canal: "presencial",
        soloSiOpciones: ["cert-p2-oficina"],
      },
      {
        id: "cert-r6",
        tipo: "tecnico",
        titulo: "Móvil con cámara para la vídeo identificación",
        explicacion: "El proceso guiado te pedirá enseñar tu DNI a la cámara.",
        canal: "online",
        soloSiOpciones: ["cert-p2-video"],
      },
      {
        id: "cert-r7",
        tipo: "tecnico",
        titulo: "Lector de DNI electrónico y PIN del DNIe",
        explicacion:
          "Necesitas el lector (o un móvil con NFC) y el PIN que se activa en las máquinas de las comisarías.",
        canal: "online",
        soloSiOpciones: ["cert-p2-dnie"],
      },
    ],
    prerequisitos: [
      {
        slug: "renovacion-dni",
        nota: "Necesitas un DNI en vigor para acreditar tu identidad.",
      },
    ],
  },
];
