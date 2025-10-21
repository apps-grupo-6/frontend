import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import TextField from "@/components/ui/TextField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import colors from "@/theme/colors";

export default function LoginForm({
  username, setUsername, password, setPassword,
  onSubmit, onGoRegister, onRecover, loading, errorMsg,
}) {
  return (
    <View>
      {!!errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
      <TextField label="Usuario" value={username} onChangeText={setUsername} placeholder="Ingresa tu usuario" keyboardType="username" />
      <TextField label="Contraseña" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
      <PrimaryButton title="Ingresar" onPress={onSubmit} loading={loading} />
      <TouchableOpacity onPress={onGoRegister} style={{ marginTop: 14 }}>
        <Text style={styles.link}>¿No tenés cuenta? Registrate</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onRecover} style={{ marginTop: 8 }}>
        <Text style={[styles.link, { color: colors.textMuted }]}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  error: { color: colors.primary, marginBottom: 10 },
  link: { color: colors.primary, fontWeight: "600" },
});
