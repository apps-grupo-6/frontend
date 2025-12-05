import { useMemo, useRef, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Platform, TouchableOpacity, InteractionManager } from "react-native";
import colors from "@/theme/colors";

export default function OtpInput({
    value = "",
    onChange = () => { },
    length = 6,
    disabled = false,
    autoFocus = true,
}) {
    const inputRef = useRef(null);

    const digits = useMemo(() => {
        const v = (value ?? "").toString();
        return v.replace(/\D/g, "").slice(0, length).split("");
    }, [value, length]);

    // Forzar foco en mobile al montar - esperando que termine la animación del modal
    useEffect(() => {
        if (autoFocus && !disabled && Platform.OS !== 'web') {
            // Esperar que termine la animación del modal
            const task = InteractionManager.runAfterInteractions(() => {
                setTimeout(() => {
                    if (inputRef.current) {
                        inputRef.current.focus();
                    }
                }, 300);
            });
        return () => task.cancel();
        }
    }, [autoFocus, disabled]);

    const handleChange = (text) => {
        if (disabled) return;

        const next = (text ?? "").toString().replace(/\D/g, "").slice(0, length);
        onChange(next);
    };

    const focusHidden = () => {
        if (disabled) return;

        inputRef.current?.focus();
    };

    const activeIndex = Math.min(digits.length, length - 1);

    // Render diferente para mobile vs web
    if (Platform.OS !== 'web') {
        // MOBILE: Input simple y directo
        return (
        <View>
            <TextInput
                ref={inputRef}
                value={(value ?? "").toString()}
                onChangeText={handleChange}
                keyboardType="number-pad"
                autoFocus={autoFocus}
                maxLength={length}
                editable={!disabled}
                autoComplete="one-time-code"
                textContentType="oneTimeCode"
                style={styles.mobileInput}
                placeholderTextColor="#9ca3af"
                accessibilityLabel="Código de verificación"
            />
        </View>
        );
    }

    // WEB: Sistema de cajas con input oculto
    return (
        <View>
            {/* Input oculto que captura escritura/pegado/backspace */}
            <TextInput
                ref={inputRef}
                value={(value ?? "").toString()}
                onChangeText={handleChange}
                keyboardType="number-pad"
                autoFocus={autoFocus}
                maxLength={length}
                caretHidden
                secureTextEntry={false}
                editable={!disabled}
                style={styles.hiddenInput}
                accessibilityLabel="Código de verificación"
            />

            {/* Cajas visibles */}
            <TouchableOpacity
                onPress={focusHidden}
                style={styles.row}
                activeOpacity={0.7}
            >
                {Array.from({ length }).map((_, i) => {
                    const char = digits[i] || "";
                    const isActive = !disabled && (i === activeIndex) && digits.length < length;

                    return (
                        <View
                            key={i}
                            style={[
                            styles.box,
                            char ? styles.boxFilled : null,
                            isActive ? styles.boxActive : null,
                            disabled ? styles.boxDisabled : null,
                            ]}
                        >
                            <Text style={[styles.boxText, disabled && styles.boxTextDisabled]}>
                                {char}
                            </Text>
                        </View>
                    );
                })}
            </TouchableOpacity>
        </View>
    );
}

const BOX_SIZE = 44;
const styles = StyleSheet.create({
    // Input oculto para web
    hiddenInput: {
        position: "absolute",
        opacity: 0,
        height: 1,
        width: 1,
        top: 0,
        left: 0,
    },
    // Input visible para mobile
    mobileInput: {
        height: 56,
        width: "100%",
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: 8,
        backgroundColor: "#fff",
        color: colors.text,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    row: {
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        marginBottom: 12,
    },
    box: {
        width: BOX_SIZE,
        height: BOX_SIZE,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: "#d1d5db",
        backgroundColor: "#f8fafc",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
    },
    boxActive: {
        borderColor: colors.primary,
        backgroundColor: "#fff",
    },
    boxFilled: {
        backgroundColor: "#fff",
    },
    boxDisabled: {
        borderColor: "#e5e7eb",
        backgroundColor: "#f3f4f6",
    },
    boxText: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
    },
    boxTextDisabled: {
        color: "#9ca3af",
    },
});
