import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import useClassDetail from '@/domain/classes/hooks/useClassDetail';
import { ClassesService } from '@/domain/classes/services/classesService';
import colors from '@/theme/colors';
import { toSpanishClassStatus, toSpanishParticipantStatus, canCancelFromParticipantStatus, canConfirmFromParticipantStatus } from '@/domain/classes/utils/statusUtils';
import { useNotification } from "@/context/notificationContext";

function InfoCard({ icon, label, value, highlight }) {
  if (!value) return null;
  return (
    <View style={[styles.infoCard, highlight && styles.infoCardHighlight]}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, highlight && styles.infoValueHighlight]}>{value}</Text>
      </View>
    </View>
  );
}

function StatusBadge({ status, type }) {
  const getStatusStyle = () => {
    const s = (status || "").toLowerCase();
    if (s.includes("confirm") || s.includes("asist")) return styles.statusConfirmed;
    if (s.includes("cancel")) return styles.statusCancelled;
    if (s.includes("curso") || s.includes("progress")) return styles.statusInProgress;
    return styles.statusPending;
  };

  return (
    <View style={[styles.statusBadge, getStatusStyle()]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
}

function formatDate(dt) {
  if (!dt) return null;
  const date = new Date(dt.includes(' ') ? dt.replace(' ', 'T') : dt);
  if (isNaN(date.getTime())) return dt;
  
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} · ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function formatTime(dt) {
  if (!dt) return null;
  const date = new Date(dt.includes(' ') ? dt.replace(' ', 'T') : dt);
  if (isNaN(date.getTime())) return dt;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
      'Cancelar inscripción',
      '¿Estás seguro de que querés cancelar tu inscripción a esta clase?',
      [
        { text: 'No, mantener', style: 'cancel' },
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando detalles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const title = data?.class_discipline_name || 'Clase';
  const professor = [data?.professor_first_name, data?.professor_last_name].filter(Boolean).join(' ');
  const scheduled = formatDate(data?.class_scheduled_at);
  const scheduledTime = formatTime(data?.class_scheduled_at);
  const ended = formatDate(data?.class_ended_at);
  const status = data?.class_status;
  const gym = data?.gym_name;
  const gymAddress = data?.gym_address;
  const capacity = data?.class_max_participants;

  const participantStatus = data?.participant_status;
  const canConfirm = canConfirmFromParticipantStatus(participantStatus);
  const canCancel = canCancelFromParticipantStatus(participantStatus);
  const displayStatus = toSpanishClassStatus(status);
  const displayParticipant = toSpanishParticipantStatus(participantStatus);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.disciplineIcon}>🏋️</Text>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{title}</Text>
            {professor && <Text style={styles.professor}>con {professor}</Text>}
          </View>
        </View>
        <StatusBadge status={displayParticipant || displayStatus} />
      </View>

      {/* Fecha y hora destacada */}
      <View style={styles.scheduleCard}>
        <View style={styles.scheduleMain}>
          <Text style={styles.scheduleIcon}>📅</Text>
          <View>
            <Text style={styles.scheduleLabel}>Fecha y hora</Text>
            <Text style={styles.scheduleValue}>{scheduled}</Text>
          </View>
        </View>
        {ended && (
          <View style={styles.scheduleEnded}>
            <Text style={styles.endedLabel}>Finalizó: {ended}</Text>
          </View>
        )}
      </View>

      {/* Información del lugar */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 Ubicación</Text>
        <View style={styles.locationCard}>
          <Text style={styles.gymName}>{gym || 'Sin especificar'}</Text>
          {gymAddress && <Text style={styles.gymAddress}>{gymAddress}</Text>}
        </View>
      </View>

      {/* Información adicional */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ Información</Text>
        <View style={styles.infoGrid}>
          <InfoCard icon="👥" label="Cupo máximo" value={capacity ? `${capacity} personas` : null} />
          <InfoCard icon="📊" label="Estado de clase" value={displayStatus} />
        </View>
      </View>

      {/* Botones de acción */}
      {(canConfirm || canCancel) && (
        <View style={styles.actions}>
          {canConfirm && (
            <TouchableOpacity
              style={[styles.button, styles.buttonConfirm]}
              onPress={handleConfirm}
              disabled={actionLoading}
              activeOpacity={0.8}
            >
              {actionLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={styles.buttonIcon}>✓</Text>
                  <Text style={styles.buttonText}>Confirmar Asistencia</Text>
                </>
              )}
            </TouchableOpacity>
          )}
          
          {canCancel && (
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={handleCancel}
              disabled={actionLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonCancelText}>Cancelar inscripción</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.bg 
  },
  content: { 
    padding: 20,
    paddingBottom: 40,
  },
  center: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 20,
    backgroundColor: colors.bg,
  },
  loadingText: {
    marginTop: 12,
    color: colors.textMuted,
    fontSize: 14,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  error: { 
    color: colors.primary, 
    marginBottom: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: { 
    color: '#fff', 
    fontWeight: '600',
    fontSize: 14,
  },

  // Header
  header: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  disciplineIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  title: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: colors.text,
    marginBottom: 4,
  },
  professor: {
    fontSize: 15,
    color: colors.textMuted,
  },

  // Status Badge
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  statusPending: {
    backgroundColor: '#f59e0b',
  },
  statusConfirmed: {
    backgroundColor: '#10b981',
  },
  statusCancelled: {
    backgroundColor: '#ef4444',
  },
  statusInProgress: {
    backgroundColor: '#3b82f6',
  },

  // Schedule Card
  scheduleCard: {
    backgroundColor: colors.primary + '15',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  scheduleMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  scheduleLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  scheduleValue: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  scheduleEnded: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.primary + '30',
  },
  endedLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },

  // Sections
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Location Card
  locationCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  gymName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  gymAddress: {
    fontSize: 14,
    color: colors.textMuted,
  },

  // Info Grid
  infoGrid: {
    gap: 10,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCardHighlight: {
    backgroundColor: colors.primary + '10',
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  infoValueHighlight: {
    color: colors.primary,
    fontWeight: '600',
  },

  // Actions
  actions: { 
    marginTop: 8,
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonConfirm: { 
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonCancel: { 
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.textMuted,
  },
  buttonIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 16,
  },
  buttonCancelText: {
    color: colors.textMuted,
    fontWeight: '600',
    fontSize: 15,
  },
});
