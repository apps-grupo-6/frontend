import { View, Text, TextInput, StyleSheet } from "react-native";
import colors from "@/theme/colors";

export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  editable = true, 
}) {
  return (
    <View 
      style={styles.container} 
      pointerEvents={editable ? "auto" : "none"}
    >
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          styles,
          !editable && styles.inputDisabled,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={editable ? onChangeText : undefined}
        editable={editable}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  inputDisabled: {
    backgroundColor: "#e5e7eb",
    opacity: 0.5 
  },
});
