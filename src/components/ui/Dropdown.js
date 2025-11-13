import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from "react-native";
import { useState } from "react";
import colors from "@/theme/colors";

export default function Dropdown({
    label = "Seleccionar",
    options = [],
    selectedValue = null,
    onSelect = () => { },
    placeholder = "Seleccionar opción"
}) {
    const [isOpen, setIsOpen] = useState(false);
    const handleSelect = (value) => {
        onSelect(value);
        setIsOpen(false);
    };
    const closeModal = () => setIsOpen(false);
    const isSelected = (item) => selectedValue === item;

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <TouchableOpacity style={styles.dropdown} onPress={() => setIsOpen(true)} activeOpacity={0.7}>
                <Text style={[styles.dropdownText, !selectedValue && styles.placeholderText]}>
                    {selectedValue || placeholder}
                </Text>
                <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>

            <Modal visible={isOpen} transparent={true} animationType="fade" onRequestClose={closeModal}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{label}</Text>
                            <TouchableOpacity onPress={closeModal}>
                                <Text style={styles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={options}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.option, isSelected(item) && styles.selectedOption]}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text style={[styles.optionText, isSelected(item) && styles.selectedOptionText]}>
                                        {item}
                                    </Text>
                                    {isSelected(item) && <Text style={styles.checkmark}>✓</Text>}
                                </TouchableOpacity>
                            )}
                            style={styles.optionsList}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const borderColor = colors.border || "#E0E0E0";

const styles = StyleSheet.create({
    container: { marginBottom: 10 },
    label: { fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 },
    dropdown: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    dropdownText: { fontSize: 14, color: colors.text, flex: 1 },
    placeholderText: { color: colors.textMuted },
    arrow: { color: colors.textMuted },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: "center", alignItems: "center", padding: 20 },
    modalContent: { backgroundColor: colors.surface, borderRadius: 12, width: "100%", maxHeight: "70%", elevation: 8 },
    modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 1, borderBottomColor: borderColor },
    modalTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
    closeButton: { fontSize: 24, color: colors.textMuted },
    optionsList: { maxHeight: 400 },
    option: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: borderColor },
    selectedOption: { backgroundColor: colors.primary + "10" },
    optionText: { fontSize: 16, color: colors.text, flex: 1 },
    selectedOptionText: { color: colors.primary, fontWeight: "600" },
    checkmark: { fontSize: 18, color: colors.primary, fontWeight: "700" },
});

