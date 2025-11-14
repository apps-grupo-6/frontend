import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/authContext";
import colors from "@/theme/colors";

export default function Navbar() {
    const navigation = useNavigation();
    const { logout } = useAuth();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const closeDropdown = () => setDropdownVisible(false);
    const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

    const handleNavigateToHome = () => {
        navigation.navigate("Home");
    };

    const handleNavigateToProfile = () => {
        navigation.navigate("Profile");
    };

    const handleLogout = () => {
        logout();
    };

    const renderDropdownItem = (icon, text, onPress) => (
        <TouchableOpacity style={styles.dropdownItem} onPress={() => { closeDropdown(); onPress?.(); }}>
            <Text style={styles.dropdownIcon}>{icon}</Text>
            <Text style={styles.dropdownText}>{text}</Text>
        </TouchableOpacity>
    );

    return (
        <>
            <View style={styles.navbar}>
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.logoContainer}
                        onPress={handleNavigateToHome}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.logoTextLight}>excuses </Text>
                        <Text style={styles.logoTextBold}>404</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.userButton} onPress={toggleDropdown} activeOpacity={0.7}>
                        <View style={styles.userIcon}>
                            <Text style={styles.userIconText}>👤</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                visible={dropdownVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeDropdown}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={closeDropdown}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        style={styles.dropdown}
                    >
                        {renderDropdownItem("👤", "Mi Perfil", handleNavigateToProfile)}
                        <View style={styles.dropdownDivider} />
                        {renderDropdownItem("🚪", "Cerrar Sesión", handleLogout)}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </>
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
    modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" },
    dropdown: { position: "absolute", top: 60, right: 20, backgroundColor: colors.surface, borderRadius: 8, minWidth: 200, elevation: 10, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
    dropdownItem: { flexDirection: "row", alignItems: "center", padding: 15, gap: 12 },
    dropdownIcon: { fontSize: 18 },
    dropdownText: { fontSize: 16, color: colors.text, fontWeight: "500" },
    dropdownDivider: { height: 1, backgroundColor: colors.surfaceAlt },
});
