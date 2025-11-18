import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useMemo } from "react";
import colors from "@/theme/colors";
import Navbar from "@/components/ui/Navbar";
import Dropdown from "@/components/ui/Dropdown";
import ClassCard from "@/domain/home/components/ClassCard";
import useClasses from "@/domain/home/hooks/useClasses";
import useLocations from "@/domain/home/hooks/useLocations";
import useReserveClass from "@/domain/home/hooks/useReserveClass";
import useUpcomingClasses from "@/domain/classes/hooks/useUpcomingClasses";
import { useNotification } from "@/context/notificationContext";

const TIME_RANGES = ['Todos los horarios', 'Mañana (6:00 - 12:00)', 'Mediodía (12:00 - 16:00)', 'Tarde (16:00 - 20:00)', 'Noche (20:00 - 24:00)'];
const ALL_GYMS = 'Todos los gimnasios';
const ALL_TIMES = 'Todos los horarios';

export default function HomeScreen() {
  const [selectedGym, setSelectedGym] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);

  const { classes, loading, error, currentPage, totalPages, totalClasses, hasNextPage, hasPreviousPage, goToNextPage, goToPreviousPage, isDescending, toggleOrder, cancelClass } = useClasses(selectedGym, selectedTimeRange);
  const { gymNames, error: locationsError } = useLocations();
  const { reserveClass, loading: reserving } = useReserveClass();
  const { data: upcomingClasses, refresh: refreshUpcoming } = useUpcomingClasses();
  const { notifySuccess, notifyError } = useNotification();
  
  const reservedClassIds = useMemo(() => {
    if (!upcomingClasses || !Array.isArray(upcomingClasses)) return new Set();
    return new Set(upcomingClasses.map(cls => cls.class_id || cls.id));
  }, [upcomingClasses]);

  const isClassReserved = (classId) => reservedClassIds.has(classId);

  const handleReserve = async (classData) => {
    const classId = classData.class_id;

    if (!classId) {
      notifyError(
        "Error",
        "No se pudo identificar la clase. Por favor, intenta de nuevo."
      );
      return;
    }

    const result = await reserveClass(classId);

    if (result.success) {
      refreshUpcoming();

      notifySuccess(
        "¡Reserva exitosa!",
        `Te has inscrito en la clase de ${classData.class_discipline_name}`
      );
    } else {
      notifyError(
        "Error al reservar",
        result.error || "No se pudo realizar la reserva"
      );
    }
  };

  const handleCancelClass = async (classData) => {
    console.log("Cancelando clase:", classData);
    const ok = await cancelClass(classData.class_id);
    
    if (ok) {
      notifySuccess(
        "Clase cancelada",
        `La clase ha sido cancelada correctamente.`
      );
    } else{
      notifyError(
        "Error al cancelar",
        result.error || "No se pudo cancelar la clase"
      );
    }
  };

  const handleGymSelect = (gymName) => setSelectedGym(gymName === ALL_GYMS ? null : gymName);
  const handleTimeRangeSelect = (timeRange) => setSelectedTimeRange(timeRange === ALL_TIMES ? null : timeRange);

  const renderFilterBadge = (icon, text, onClear) => (
    <View style={styles.filterBadge}>
      <Text style={styles.filterBadgeText}>{icon} {text}</Text>
      <TouchableOpacity onPress={onClear} style={styles.clearFilterButton}>
        <Text style={styles.clearFilterText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Navbar />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Nuestras Clases</Text>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={toggleOrder}
            activeOpacity={0.7}
          >
            <Text style={styles.sortButtonText}>
              {isDescending ? '↑ Próximas' : '↓ Próximas'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filtersSection}>
          <Dropdown
            label="Filtrar por Gimnasio"
            options={[ALL_GYMS, ...gymNames]}
            selectedValue={selectedGym || ALL_GYMS}
            onSelect={handleGymSelect}
          />
          {locationsError && <Text style={styles.filterError}>No se pudieron cargar los gimnasios</Text>}

          <Dropdown
            label="Filtrar por Horario"
            options={TIME_RANGES}
            selectedValue={selectedTimeRange || ALL_TIMES}
            onSelect={handleTimeRangeSelect}
          />

          {(selectedGym || selectedTimeRange) && (
            <View style={styles.activeBadgesContainer}>
              {selectedGym && renderFilterBadge("📍", selectedGym, () => setSelectedGym(null))}
              {selectedTimeRange && renderFilterBadge("🕐", selectedTimeRange, () => setSelectedTimeRange(null))}
            </View>
          )}
        </View>

        {loading && (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Cargando clases...</Text>
          </View>
        )}

        {error && (
          <View style={styles.centerContent}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!loading && !error && classes.length === 0 && (
          <View style={styles.centerContent}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No hay clases disponibles</Text>
          </View>
        )}

        {!loading && !error && classes.length > 0 && (
          <>
            <FlatList
              data={classes}
              keyExtractor={(item, index) => item.class_id?.toString() || index.toString()}
              renderItem={({ item, index }) => (
                <ClassCard
                  classData={item}
                  onReserve={handleReserve}
                  onCancel={handleCancelClass}
                  imageIndex={index}
                  isReserved={isClassReserved(item.class_id)}
                />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />

            {/* Controles de paginación */}
            {totalPages > 1 && (
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  style={[styles.paginationButton, !hasPreviousPage && styles.paginationButtonDisabled]}
                  onPress={goToPreviousPage}
                  disabled={!hasPreviousPage}
                >
                  <Text style={[styles.paginationButtonText, !hasPreviousPage && styles.paginationButtonTextDisabled]}>
                    ← Anterior
                  </Text>
                </TouchableOpacity>

                <View style={styles.paginationInfo}>
                  <Text style={styles.paginationText}>
                    Página {currentPage} de {totalPages}
                  </Text>
                  <Text style={styles.paginationSubtext}>
                    {totalClasses} clases en total
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.paginationButton, !hasNextPage && styles.paginationButtonDisabled]}
                  onPress={goToNextPage}
                  disabled={!hasNextPage}
                >
                  <Text style={[styles.paginationButtonText, !hasNextPage && styles.paginationButtonTextDisabled]}>
                    Siguiente →
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.dark },
  container: { flex: 1, backgroundColor: colors.bg, padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "700", color: colors.text, flex: 1 },
  sortButton: { backgroundColor: colors.primary, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, elevation: 3 },
  sortButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  filtersSection: { marginBottom: 16 },
  activeBadgesContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  filterBadge: { flexDirection: "row", alignItems: "center", backgroundColor: colors.primary + "15", borderRadius: 8, padding: 10, borderLeftWidth: 3, borderLeftColor: colors.primary, marginBottom: 8 },
  filterBadgeText: { fontSize: 13, color: colors.text, fontWeight: "500", marginRight: 8 },
  clearFilterButton: { backgroundColor: colors.primary, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4 },
  clearFilterText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
  filterError: { fontSize: 12, color: colors.primary, marginTop: 4, marginLeft: 4 },
  centerContent: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { fontSize: 16, color: colors.textMuted, marginTop: 12 },
  errorText: { fontSize: 16, color: colors.primary, textAlign: "center" },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 18, color: colors.textMuted, textAlign: "center" },
  listContent: { paddingBottom: 20 },
  paginationContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 20, paddingHorizontal: 10, backgroundColor: colors.surface, borderRadius: 12, marginTop: 10, elevation: 3 },
  paginationButton: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: colors.primary, borderRadius: 8, minWidth: 100 },
  paginationButtonDisabled: { backgroundColor: colors.surfaceAlt },
  paginationButtonText: { color: colors.surface, fontWeight: "600", fontSize: 14, textAlign: "center" },
  paginationButtonTextDisabled: { color: colors.textMuted },
  paginationInfo: { alignItems: "center", flex: 1, paddingHorizontal: 10 },
  paginationText: { fontSize: 16, fontWeight: "600", color: colors.text, marginBottom: 4 },
  paginationSubtext: { fontSize: 12, color: colors.textMuted },
});
