import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import colors from "@/theme/colors";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { ClassesService } from "@/domain/classes/services/classesService";
import { toSpanishClassStatus, toSpanishParticipantStatus, canCancelFromParticipantStatus, canConfirmFromParticipantStatus } from "@/domain/classes/utils/statusUtils";
import React, { useState } from "react";
import { useNotification } from "@/context/notificationContext";

function toDateSafe(value) {
  if (!value) return null;
  try {
    const iso = typeof value === "string" ? value.replace(" ", "T") : value;
    const d = new Date(iso);
    return isNaN(d) ? null : d;
  } catch {
    return null;
  }
}

function formatDate(value) {
  const d = toDateSafe(value);
  if (!d) return String(value ?? "");
  return d.toLocaleString();
}

export default function ClassItem({ item, onPress, onActionDone, showActions = true }) {
  // Campos esperados desde backend de lista de clases del usuario
  const discipline = item?.class_discipline_name; // Puede no venir en este endpoint
  const professorFirst = item?.professor_first_name;
  const professorLast = item?.professor_last_name;
  const professorFull = [professorFirst, professorLast].filter(Boolean).join(" ");
  const rawDate = item?.class_scheduled_at;
  const participantStatus = item?.participant_status;
  const classStatus = item?.class_status || item?.status;
  const displayStatus = toSpanishParticipantStatus(participantStatus) || toSpanishClassStatus(classStatus);
  const classId = item?.id ?? item?.class_id;

  const canConfirm = canConfirmFromParticipantStatus(participantStatus);
  const canCancel = canCancelFromParticipantStatus(participantStatus);

  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  const { notifySuccess, notifyError } = useNotification();
  
  // Título: disciplina > "Clase con {profesor}" > "Clase"
  const title =
    (discipline && discipline.trim()) ||
    (professorFull ? `Clase con ${professorFull}` : "Clase");

  return (
    <View style={styles.card}>
      {onPress ? (
        <Pressable
          onPress={onPress}
          android_ripple={{ color: colors.surfaceAlt }}
        >
          <View>
            <Text style={styles.title}>{title}</Text>
            {professorFull ? <Text style={styles.meta}>Profesor: {professorFull}</Text> : null}
            {rawDate ? <Text style={styles.subtitle}>Inicio: {formatDate(rawDate)}</Text> : null}
            {(displayStatus) ? <Text style={styles.badge}>{displayStatus}</Text> : null}
          </View>
        </Pressable>
      ) : (
        <View>
          <Text style={styles.title}>{title}</Text>
          {professorFull ? <Text style={styles.meta}>Profesor: {professorFull}</Text> : null}
          {rawDate ? <Text style={styles.subtitle}>Inicio: {formatDate(rawDate)}</Text> : null}
          {(displayStatus) ? <Text style={styles.badge}>{displayStatus}</Text> : null}
        </View>
      )}

      {showActions && (canConfirm || canCancel) && (
        <View style={styles.actions}>
          {canConfirm && (
            <PrimaryButton
              title="Confirmar asistencia"
              variant="success"
              loading={loadingConfirm}
              onPress={async () => {
                try {
                  setLoadingConfirm(true);
                  const result = await ClassesService.confirm(classId);
                  notifySuccess("Tu presencia fue confirmada.");
                  onActionDone && onActionDone();
                } catch (e) {
                  console.error("Error al confirmar:", e);
                  notifyError( e.message || "No pudimos confirmar tu presencia.");
                } finally {
                  setLoadingConfirm(false);
                }
              }}
            />
          )}
          {canCancel && (
            <PrimaryButton
              title="Cancelar"
              variant="secondary"
              loading={loadingCancel}
              onPress={async () => {
                const confirmed = typeof window !== 'undefined'
                  ? window.confirm("¿Estás seguro de que querés cancelar tu inscripción?")
                  : true;

                if (!confirmed) {
                  return;
                }

                try {
                  setLoadingCancel(true);
                  const result = await ClassesService.cancel(classId);
                  notifySuccess("Tu inscripción fue cancelada.");
                  onActionDone && onActionDone();
                } catch (e) {
                  console.error("Error al cancelar:", e);
                  notifyError(`Error: ${e.message || "No pudimos cancelar tu inscripción."}`);
                } finally {
                  setLoadingCancel(false);
                }
              }}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 10,
    shadowColor: colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: { fontSize: 16, fontWeight: "700", color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  meta: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  badge: {
    marginTop: 6,
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: "hidden",
  },
  actions: {
    marginTop: 12,
    gap: 8,
    zIndex: 100,
    position: 'relative',
  },
});
