import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import colors from "@/theme/colors";

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",   // "primary" | "secondary" | "ghost" | "success"
  style,
  textStyle,
}) {
  const isDisabled = disabled || loading;

  const handlePress = () => {
    console.log("=== PrimaryButton pressed ===");
    console.log("Title:", title);
    console.log("Disabled:", isDisabled);
    console.log("onPress exists:", !!onPress);
    
    if (onPress && !isDisabled) {
      console.log("Executing onPress...");
      onPress();
    } else {
      console.log("onPress NOT executed. Disabled:", isDisabled, "onPress:", !!onPress);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "ghost" && styles.ghost,
        variant === "success" && styles.success,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "secondary" || variant === "ghost" ? colors.primary : "#fff"} />
      ) : (
        <Text
          style={[
            styles.text,
            (variant === "secondary" || variant === "ghost") && styles.textSecondary,
            isDisabled && styles.textDisabled,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    elevation: 5,
  },
  primary: {
    backgroundColor: colors.primary,
    marginTop: 5
  },
  secondary: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  success: {
    backgroundColor: "#4caf50",
    marginTop: 5
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  textSecondary: {
    color: colors.primary,
  },
});
