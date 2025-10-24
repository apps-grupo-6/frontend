import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import TextField from "@/components/ui/TextField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import colors from "@/theme/colors";

export default function LoginForm({
  username, setUsername, 
  password, setPassword,
  loading, 
  authErrorMsg,
  onSubmit, onGoRegister, onRecover, 
}) {
  return (
    <View>
      {!!authErrorMsg && <Text style={styles.error}>{authErrorMsg}</Text>}
      <TextField
        label="Usuario"
        value={username}
        onChangeText={setUsername}
        placeholder="Ingresa tu usuario"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="username"
        textContentType="username"
        keyboardType="default"
        returnKeyType="next"
      />

      <TextField
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={onSubmit}
      />
      
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
