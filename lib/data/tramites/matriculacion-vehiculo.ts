import type { TramiteContenido } from "@/lib/types";

// ── Preparada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
export const matriculacionVehiculo: TramiteContenido = {
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
        "Fuente: «Justificante del pago o exención del Impuesto de Circulación del Ayuntamiento donde tengas tu domicilio».",
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
        "Fuente: «tienes que adquirir la tasa 1.1 de 99,77 euros» y, «para el caso de ciclomotores, tendrás que comprar la tasa 1.2 de 27,85 €», que se paga con tarjeta, «nunca en metálico».",
      canal: "ambos",
    },
    {
      id: "mv-r5",
      tipo: "doc_fisico",
      titulo: "El documento de identidad del titular",
      explicacion:
        "Fuente: «documento oficial que acredite tu identidad y domicilio (DNI, permiso de conducción español, tarjeta de residencia, pasaporte más Número de Identificación de Extranjeros)».",
      canal: "ambos",
    },
    {
      id: "mv-r6",
      tipo: "doc_fisico",
      titulo: "El certificado de importación H1",
      explicacion:
        "Para vehículos de fuera de la UE. Fuente: «Certificado de Importación H1, salvo que en la tarjeta de ITV conste la diligencia de importación del vehículo».",
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
        "Para la vía presencial. Fuente: «necesitas solicitar cita previa por internet o llamando al 060», y la «Solicitud en impreso oficial».",
      canal: "presencial",
      soloSiOpciones: ["mv-p3-presencial"],
    },
  ],
  prerequisitos: [],
};
