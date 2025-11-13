import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import TextField from "@/components/ui/TextField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import colors from "@/theme/colors";

export default function RegisterForm({
  form, setField, onSubmit, onGoLogin, loading, errorMsg,
}) {
  return (
    <View>
      {!!errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
      <TextField label="Usuario" value={form.username} onChangeText={(v)=>setField("username", v)} placeholder="Tu usuario" autoCapitalize="none" />
      <TextField label="Contraseña" value={form.password} onChangeText={(v)=>setField("password", v)} placeholder="••••••••" secureTextEntry />
      <TextField label="Nombre" value={form.first_name} onChangeText={(v)=>setField("first_name", v)} placeholder="Tu nombre" autoCapitalize="words" />
      <TextField label="Apellido" value={form.last_name} onChangeText={(v)=>setField("last_name", v)} placeholder="Tu apellido" autoCapitalize="words" />
      <TextField label="Teléfono" value={form.telephone} onChangeText={(v)=>setField("telephone", v)} placeholder="Tu teléfono" keyboardType="phone-pad" autoCapitalize="none" />
      <TextField label="Email" value={form.contact_email} onChangeText={(v)=>setField("contact_email", v)} placeholder="tu@correo.com" keyboardType="email-address" autoCapitalize="none" />
      
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
