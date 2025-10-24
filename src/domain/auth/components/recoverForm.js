import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import TextField from "@/components/ui/TextField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import colors from "@/theme/colors";

export default function RecoverForm({
  username, setUsername,
  new_password, setNewPassword,
  loading, 
  errorMsg, 
  showPasswordField,
  onContinue, onSubmit, onGoLogin
}) {
  return (
    <View>
      {!!errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      <TextField
        label="Usuario"
        value={username}
        onChangeText={setUsername}
        placeholder="Tu usuario"
        autoCapitalize="none"
        editable={!showPasswordField}
      />
      

      {!showPasswordField && (
        <>
          <PrimaryButton
            title="Continuar"
            onPress={onContinue}
            loading={loading}
            style={{ marginTop: 12 }}
          />
          <TouchableOpacity onPress={onGoLogin} style={{ marginTop: 14 }}>      
            <Text style={styles.link}>¿Recordaste tu cuenta? Inicia sesión</Text>
          </TouchableOpacity>
        </>
      )}
      
      {showPasswordField && (
        <>
          <TextField
            label="Nueva contraseña"
            value={new_password}
            onChangeText={setNewPassword}
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
            containerStyle={{ marginTop: 12 }}
          />

          <PrimaryButton
            title="Guardar nueva contraseña"
            onPress={onSubmit}
            loading={loading}
            style={{ marginTop: 12 }}
          />

          <TouchableOpacity onPress={onGoLogin} style={{ marginTop: 14 }}>      
            <Text style={styles.link}>¿Recordaste tu cuenta? Iniciar sesión</Text>
          </TouchableOpacity>
        </>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  error: { color: "#dc2626", marginBottom: 10 },
  success: { color: "#16a34a", marginBottom: 10 },
  link: { color: colors.primary, fontWeight: "600" },
});
