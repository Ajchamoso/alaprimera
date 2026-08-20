const KEY_RESPONDIDAS = "alaprimera.feedback.v1";
const EVENTO = "alaprimera:feedback";

export function suscribeFeedback(oyente: () => void): () => void {
  window.addEventListener("storage", oyente);
  window.addEventListener(EVENTO, oyente);
  return () => {
    window.removeEventListener("storage", oyente);
    window.removeEventListener(EVENTO, oyente);
  };
}

export function feedbackRespondido(checklistId: string): boolean {
  try {
    const crudo = window.localStorage.getItem(KEY_RESPONDIDAS);
    return crudo ? (JSON.parse(crudo) as unknown[]).includes(checklistId) : false;
  } catch {
    return false;
  }
}

export function marcaFeedbackRespondido(checklistId: string): void {
  try {
    const crudo = window.localStorage.getItem(KEY_RESPONDIDAS);
    const previas = crudo ? (JSON.parse(crudo) as unknown[]) : [];
    const ids = previas.filter((valor): valor is string => typeof valor === "string");
    if (!ids.includes(checklistId)) {
      window.localStorage.setItem(KEY_RESPONDIDAS, JSON.stringify([...ids, checklistId]));
    }
    window.dispatchEvent(new Event(EVENTO));
  } catch {
    // Sin almacenamiento se conserva la respuesta remota; como mucho se vuelve a preguntar.
  }
}
