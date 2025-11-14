import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import colors from "@/theme/colors";

export default function Navbar() {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const closeDropdown = () => setDropdownVisible(false);
    const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

    const renderDropdownItem = (icon, text, onPress) => (
        <TouchableOpacity style={styles.dropdownItem} onPress={() => { closeDropdown(); onPress?.(); }}>
            <Text style={styles.dropdownIcon}>{icon}</Text>
            <Text style={styles.dropdownText}>{text}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.navbar}>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoTextLight}>excuses </Text>
                    <Text style={styles.logoTextBold}>404</Text>
                </View>

                <TouchableOpacity style={styles.userButton} onPress={toggleDropdown} activeOpacity={0.7}>
                    <View style={styles.userIcon}>
                        <Text style={styles.userIconText}>👤</Text>
                    </View>
                </TouchableOpacity>

                {dropdownVisible && (
                    <View style={styles.dropdown}>
                        {renderDropdownItem("👤", "Mi Perfil", null /* TODO: Navegar a Mi Perfil */)}
                        <View style={styles.dropdownDivider} />
                        {renderDropdownItem("🚪", "Cerrar Sesión", null /* TODO: Cerrar sesión */)}
                    </View>
                )}
            </View>

            {dropdownVisible && (
                <TouchableOpacity style={styles.overlay} onPress={closeDropdown} activeOpacity={1} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: colors.dark,
        paddingBottom: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.primary,
        elevation: 5,
        zIndex: 1000,
    },
    container: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    logoContainer: { flexDirection: "row", alignItems: "baseline" },
    logoTextLight: { fontSize: 26, fontWeight: "300", color: colors.surface, letterSpacing: 1, fontStyle: "italic" },
    logoTextBold: { fontSize: 28, fontWeight: "900", color: colors.primary, letterSpacing: 1.5, textShadowColor: "rgba(255, 76, 76, 0.5)", textShadowRadius: 8 },
    userButton: { padding: 5 },
    userIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: colors.surface },
    userIconText: { fontSize: 20 },
    dropdown: { position: "absolute", top: 50, right: 0, backgroundColor: colors.surface, borderRadius: 8, minWidth: 200, elevation: 8, zIndex: 1001, overflow: "hidden" },
    dropdownItem: { flexDirection: "row", alignItems: "center", padding: 15, gap: 12 },
    dropdownIcon: { fontSize: 18 },
    dropdownText: { fontSize: 16, color: colors.text, fontWeight: "500" },
    dropdownDivider: { height: 1, backgroundColor: colors.surfaceAlt },
    overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: -1000, zIndex: 999 },
});

