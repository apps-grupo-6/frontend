import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import TextField from "@/components/ui/TextField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import colors from "@/theme/colors";

export default function RegisterForm({
  form, setField, onSubmit, onGoLogin, loading, errorMsg, successMsg,
}) {
  return (
    <View>
      {!!errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
      {!!successMsg && <Text style={styles.success}>{successMsg}</Text>}
      <TextField label="Nombre" value={form.firstName} onChangeText={(v)=>setField("firstName", v)} placeholder="Tu nombre" autoCapitalize="words" />
      <TextField label="Apellido" value={form.lastName} onChangeText={(v)=>setField("lastName", v)} placeholder="Tu apellido" autoCapitalize="words" />
      <TextField label="username" value={form.username} onChangeText={(v)=>setField("username", v)} placeholder="tu@username.com" keyboardType="username-address" />
      <TextField label="Contraseña" value={form.password} onChangeText={(v)=>setField("password", v)} placeholder="••••••••" secureTextEntry />
      <PrimaryButton title="Crear cuenta" onPress={onSubmit} loading={loading} />
      <TouchableOpacity onPress={onGoLogin} style={{ marginTop: 14 }}>
        <Text style={styles.link}>¿Ya tenés cuenta? Iniciar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  error: { color: colors.primary, marginBottom: 10 },
  success: { color: "#16a34a", marginBottom: 10 },
  link: { color: colors.primary, fontWeight: "600" },
});
