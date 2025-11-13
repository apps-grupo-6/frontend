import React, { useMemo, useRef } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import colors from "@/theme/colors";

export default function OtpInput({
  value = "",
  onChange = () => {},
  length = 6,
  disabled = false,
  autoFocus = true,
}) {
  const inputRef = useRef(null);

  const digits = useMemo(() => {
    const v = (value ?? "").toString();
    return v.replace(/\D/g, "").slice(0, length).split("");
  }, [value, length]);

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
      />

      {/* Cajas visibles */}
      <Pressable onPress={focusHidden} style={styles.row}>
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
      </Pressable>
    </View>
  );
}

const BOX_SIZE = 44;

const styles = StyleSheet.create({
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    height: 0,
    width: 0,
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
