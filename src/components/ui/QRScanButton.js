import { TouchableOpacity, StyleSheet, View, Text, ActivityIndicator } from "react-native";
import colors from "@/theme/colors";

export default function QRScanButton({ onPress, disabled }) {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={disabled}
        >
            <View style={[styles.button, disabled && styles.buttonDisabled]}>
                <View style={styles.qrIcon}>
                    {/* QR Code Icon usando Views */}
                    <View style={styles.qrGrid}>
                        <View style={[styles.qrBlock, styles.qrTopLeft]} />
                        <View style={[styles.qrBlock, styles.qrTopRight]} />
                        <View style={[styles.qrBlock, styles.qrBottomLeft]} />
                        <View style={styles.qrCenter} />
                    </View>
                </View>
                <Text style={styles.scanText}>Escanear</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 30,
        alignSelf: "center",
        zIndex: 999,
        elevation: 10,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    buttonDisabled: {
        backgroundColor: colors.textMuted,
        opacity: 0.7,
    },
    qrIcon: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    qrGrid: {
        width: 24,
        height: 24,
        position: "relative",
    },
    qrBlock: {
        position: "absolute",
        width: 9,
        height: 9,
        borderWidth: 2,
        borderColor: "#FFFFFF",
        borderRadius: 2,
    },
    qrTopLeft: {
        top: 0,
        left: 0,
    },
    qrTopRight: {
        top: 0,
        right: 0,
    },
    qrBottomLeft: {
        bottom: 0,
        left: 0,
    },
    qrCenter: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 9,
        height: 9,
        backgroundColor: "#FFFFFF",
        borderRadius: 2,
    },
    scanText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
});
