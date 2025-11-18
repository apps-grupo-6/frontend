import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import colors from "@/theme/colors";
import { getMockedImages } from "@/utils/getMockedImages";
import { useAuth } from "@/context/authContext";

export default function ClassCard({ classData, onReserve, onCancel, onEditClass = null, imageIndex = 0, isReserved = false }) {
    const { class_discipline_name, class_status, professor_first_name, class_scheduled_at, gym_name, professor_id } = classData;
    const { roles, userId } = useAuth();
    const imageUrl = getMockedImages()[imageIndex % getMockedImages().length].url;

    const formatDate = (dateString) => {
        if (!dateString) return "Fecha no disponible";
        try {
            return new Date(dateString).toLocaleDateString("es-ES", {
                day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
            });
        } catch (e) { return dateString; }
    };

    const statusConfig = {
        "finished": { color: "#4caf50", text: "Finalizada" },
        "not started": { color: "#ff9800", text: "No iniciada" }
    };
    const canManageClass = roles.includes("BACKEND DEVELOPER") || (roles.includes("PROFESSOR") && professor_id === userId);

    const getStatusConfig = (status) => statusConfig[status?.toLowerCase()] || { color: colors.textMuted, text: status || "Sin estado" };
    const statusInfo = getStatusConfig(class_status);

    const renderInfoRow = (label, value) => (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}:</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );

    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: imageUrl }} style={styles.classImage} resizeMode="cover" />
            </View>

            <View style={styles.content}>
                <Text style={styles.className} numberOfLines={2}>
                    {class_discipline_name || "Clase sin nombre"}
                </Text>

                <View style={styles.statusContainer}>
                    <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + "20" }]}>
                        <Text style={[styles.statusText, { color: statusInfo.color }]}>
                            {statusInfo.text}
                        </Text>
                    </View>
                </View>

                {renderInfoRow("Profesor", professor_first_name || "No asignado")}
                {renderInfoRow("Fecha", formatDate(class_scheduled_at))}
                {renderInfoRow("Sede", gym_name || "No especificada")}

                <TouchableOpacity 
                    style={[
                        styles.reserveButton, 
                        isReserved && styles.reservedButton
                    ]} 
                    onPress={() => !isReserved && onReserve?.(classData)} 
                    activeOpacity={isReserved ? 1 : 0.8}
                    disabled={isReserved}
                >
                    <Text style={[
                        styles.reserveButtonText,
                        isReserved && styles.reservedButtonText
                    ]}>
                        {isReserved ? "✓ Reservado" : "Reservar"}
                    </Text>
                </TouchableOpacity>

                {canManageClass && (
                    <View style={styles.adminActionsRow}>
                        <TouchableOpacity
                            style={[styles.adminButton, styles.cancelButton]}
                            onPress={() => onCancel?.(classData)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.adminButtonText}>
                                Cancelar clase
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.adminButton, styles.editButton]}
                            onPress={() => onEditClass?.(classData)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.adminButtonText}>
                                Modificar clase
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: colors.surface, borderRadius: 16, marginBottom: 16, overflow: "hidden", elevation: 5, width: "100%" },
    imageContainer: { width: "100%", height: 180, backgroundColor: colors.surfaceAlt, overflow: "hidden" },
    classImage: { width: "100%", height: "100%" },
    content: { padding: 20 },
    className: { fontSize: 22, fontWeight: "700", color: colors.text, marginBottom: 14, lineHeight: 28 },
    statusContainer: { flexDirection: "row", marginBottom: 16 },
    statusBadge: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
    statusText: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
    infoRow: { flexDirection: "column", marginBottom: 12 },
    infoLabel: { fontSize: 12, fontWeight: "600", color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
    infoValue: { fontSize: 16, color: colors.text, fontWeight: "500" },
    reserveButton: { backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10, marginTop: 20, alignItems: "center", elevation: 5 },
    reserveButtonText: { color: colors.surface, fontSize: 16, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 },
    reservedButton: { backgroundColor: "#4caf50", opacity: 0.8 },
    reservedButtonText: { color: "#FFFFFF" },
    adminActionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
        gap: 10,
    },
    adminButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        elevation: 3,
    },
    cancelButton: {
        backgroundColor: "#e53935",
    },
    editButton: {
        backgroundColor: "#0288d1",
    },
    adminButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
});
