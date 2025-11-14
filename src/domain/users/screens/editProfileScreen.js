import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "@/theme/colors";
import TextField from "@/components/ui/TextField";
import useUserInfo from "@/domain/users/hooks/useUserInfo";
import { useNotification } from "@/context/notificationContext";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { data: me, loading, updateUser } = useUserInfo();

  const [firstName, setFirstName] = useState(me?.first_name || "");
  const [lastName, setLastName] = useState(me?.last_name || "");
  const [email, setEmail] = useState(me?.contact_email || me?.email || "");
  const [telephone, setTelephone] = useState(me?.telephone || "");
  const [saving, setSaving] = useState(false);
  const { notifySuccess, notifyError } = useNotification();

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateUser({
        first_name: firstName,
        last_name: lastName,
        contact_email: email,
        telephone: telephone,
      });
      notifySuccess("Éxito", "Tus datos fueron actualizados.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      notifyError("Error", e.message || "No pudimos actualizar tus datos.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Editar Perfil</Text>

      <TextField
        label="Nombre"
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Tu nombre"
      />

      <TextField
        label="Apellido"
        value={lastName}
        onChangeText={setLastName}
        placeholder="Tu apellido"
      />

      <TextField
        label="Email de contacto"
        value={email}
        onChangeText={setEmail}
        placeholder="tu@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextField
        label="Teléfono"
        value={telephone}
        onChangeText={setTelephone}
        placeholder="1122334455"
        keyboardType="phone-pad"
      />

      <TouchableOpacity
        style={[styles.button, saving && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.buttonText}>{saving ? "Guardando..." : "Guardar Cambios"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonCancel} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonCancelText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  buttonCancel: {
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
  },
  buttonCancelText: { color: colors.textMuted, fontSize: 15 },
});
