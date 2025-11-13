// Utilidades para normalizar y traducir estados al español

function norm(value) {
  return String(value || "").trim().toLowerCase();
}

export function toSpanishClassStatus(status) {
  const s = norm(status);
  switch (s) {
    case "not started":
    case "no iniciada":
    case "not_started":
    case "pending":
      return "No iniciada";
    case "in progress":
    case "in_progress":
    case "ongoing":
    case "started":
      return "En curso";
    case "completed":
    case "done":
    case "finalizada":
    case "finished":
      return "Finalizada";
    case "scheduled":
    case "programada":
      return "Programada";
    case "confirmed":
    case "confirmada":
      return "Confirmada";
    case "cancelled":
    case "canceled":
    case "cancelada":
      return "Cancelada";
    default:
      // Capitalizar por defecto
      if (!s) return "";
      return s.charAt(0).toUpperCase() + s.slice(1);
  }
}

export function toSpanishParticipantStatus(status) {
  const s = norm(status);
  switch (s) {
    case "not confimet":
    case "not confirmed":
    case "not_confirmed":
    case "unconfirmed":
      return "No confirmada";
    case "pending":
    case "pendiente":
    case "enrolled":
    case "inscripto":
    case "registered":
      return "Pendiente";
    case "confirmed":
    case "confirmada":
      return "Confirmada";
    case "checked_in":
    case "asistio":
    case "attended":
      return "Asistió";
    case "cancelled":
    case "canceled":
    case "cancelado":
    case "cancelada":
      return "Cancelada";
    default:
      if (!s) return "";
      return s.charAt(0).toUpperCase() + s.slice(1);
  }
}

export function canConfirmFromParticipantStatus(status) {
  const s = norm(status);
  return ["pending", "pendiente", "enrolled", "inscripto", "registered"].includes(s);
}

export function canCancelFromParticipantStatus(status) {
  const s = norm(status);
  return !["cancelled", "canceled", "cancelado", "cancelada", "finalizada", "completed", "done"].includes(s);
}
