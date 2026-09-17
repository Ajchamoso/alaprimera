import type { TramiteContenido } from "@/lib/types";

// ── Curada desde la fuente oficial el 17/07/2026 (pendiente de verificación humana) ──
export const empadronamientoMadrid: TramiteContenido = {
  slug: "empadronamiento-madrid",
  nivel: "local",
  comunidad: "madrid",
  familia: "empadronamiento",
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
};
