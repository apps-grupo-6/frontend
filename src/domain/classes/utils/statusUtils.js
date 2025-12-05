function norm(value) {
  return String(value).trim().toLowerCase();
}

export function toSpanishClassStatus(status) {
  const s = norm(status);
  switch (s) {
    case "not started":
      return "La clase aún no ha comenzado";
    case "started":
      return "La clase está en curso";
    case "finished":
      return "La clase ha finalizado";
    case "cancelled":
      return "La clase ha sido cancelada";
  }
}

export function toSpanishParticipantStatus(status) {
  const s = norm(status);
  switch (s) {
    case "not confirmed":
      return "Participación no confirmada";
    case "confirmed":
      return "Participación confirmada";
    case "cancelled":
      return "Participación cancelada";
    case "expired":
      return "No confirmaste tu participación a tiempo, la clase finalizó";
    case "absent":
      return "Confirmaste tu presencia y no asististe a la clase";
    case "present":
      return "Asististe a la clase";
  }
}

export function canConfirmFromParticipantStatus(status) {
  const s = norm(status);
  return "not confirmed" == s;
}

export function canCancelFromParticipantStatus(status) {
  const s = norm(status);
  return ["not confirmed", "confirmed"].includes(s);
}
