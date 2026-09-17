import type { TramiteContenido } from "@/lib/types";

// ── Preparada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
export const transferenciaVehiculo: TramiteContenido = {
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
};
