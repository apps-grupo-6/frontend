import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import useClassDetail from '@/domain/classes/hooks/useClassDetail';
import { ClassesService } from '@/domain/classes/services/classesService';
import colors from '@/theme/colors';
import { toSpanishClassStatus, toSpanishParticipantStatus, canCancelFromParticipantStatus, canConfirmFromParticipantStatus } from '@/domain/classes/utils/statusUtils';
import { useNotification } from "@/context/notificationContext";

function Line({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.line}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function formatDate(dt) {
  if (!dt) return null;
  const date = new Date(dt.includes(' ') ? dt.replace(' ', 'T') : dt);
  if (isNaN(date.getTime())) return dt;
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

export default function ClassDetailScreen({ route }) {
  const { classId } = route.params || {};
  const { data, loading, error, refresh } = useClassDetail(classId);
  const [actionLoading, setActionLoading] = useState(false);
  const { notifySuccess, notifyError } = useNotification();

  const handleConfirm = async () => {
    try {
      setActionLoading(true);
      await ClassesService.confirm(classId);
      notifySuccess('Éxito', 'Tu presencia fue confirmada.');
      refresh();
    } catch (e) {
      notifyError('Error', e.message || 'No pudimos confirmar tu presencia.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    Alert.alert(
      'Cancelar clase',
      '¿Estás seguro de que querés cancelar tu inscripción?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              setActionLoading(true);
              await ClassesService.cancel(classId);
              notifySuccess("Éxito", "Tu inscripción fue cancelada correctamente.");
              refresh();
            } catch (e) {
              notifyError('Error', e.message || 'No pudimos cancelar tu inscripción.');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color={colors.primary}/></View>;
  if (error) return (
    <View style={styles.center}>
      <Text style={styles.error}>{error}</Text>
      <Text style={styles.retry} onPress={refresh}>Reintentar</Text>
    </View>
  );

  const title = data?.class_discipline_name || 'Clase';
  const professor = [data?.professor_first_name, data?.professor_last_name].filter(Boolean).join(' ');
  const scheduled = formatDate(data?.class_scheduled_at);
  const ended = formatDate(data?.class_ended_at);
  const status = data?.class_status;
  const gym = data?.gym_name;
  const gymAddress = data?.gym_address;
  const capacity = data?.class_max_participants;

  // Determinar si mostrar botones según el estado
  const participantStatus = data?.participant_status;
  const canConfirm = canConfirmFromParticipantStatus(participantStatus);
  const canCancel = canCancelFromParticipantStatus(participantStatus);
  const displayStatus = toSpanishClassStatus(status);
  const displayParticipant = toSpanishParticipantStatus(participantStatus);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{title}</Text>
      <Line label="Profesor" value={professor}/>
      <Line label="Programada" value={scheduled}/>
      <Line label="Finalizó" value={ended}/>
  {/* Mostrar primero el estado del participante si existe */}
  <Line label="Estado" value={displayParticipant || displayStatus}/>
      <Line label="Gimnasio" value={gym}/>
      <Line label="Dirección" value={gymAddress}/>
      <Line label="Cupo Máximo" value={capacity}/>

      {(canConfirm || canCancel) && (
        <View style={styles.actions}>
          {canConfirm && (
            <TouchableOpacity
              style={[styles.button, styles.buttonConfirm]}
              onPress={handleConfirm}
              disabled={actionLoading}
            >
              <Text style={styles.buttonText}>Confirmar Presencia</Text>
            </TouchableOpacity>
          )}
          {canCancel && (
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={handleCancel}
              disabled={actionLoading}
            >
              <Text style={styles.buttonText}>Cancelar Inscripción</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16, color: colors.text },
  line: { marginBottom: 10 },
  label: { fontSize: 13, fontWeight: '500', color: colors.textMuted, marginBottom: 2 },
  value: { fontSize: 15, color: colors.text },
  error: { color: '#b00020', marginBottom: 16 },
  retry: { color: colors.primary, fontWeight: '600' },
  actions: { marginTop: 24, gap: 12 },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonConfirm: { backgroundColor: colors.primary },
  buttonCancel: { backgroundColor: '#666' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
