import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import TextField from "@/components/ui/TextField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import colors from "@/theme/colors";

export default function OtpModal({ visible, otp_token, setOtp, onConfirm, onClose, onResend, loading, otpErrorMsg, title }) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {!!otpErrorMsg && <Text style={styles.error}>{otpErrorMsg}</Text>}
          <TextField label="Código" value={otp_token} onChangeText={setOtp} placeholder="123456" keyboardType="numeric" />
          <PrimaryButton title="Confirmar" onPress={onConfirm} loading={loading} />
          <PrimaryButton title="Reenviar" onPress={onResend} loading={loading}/>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 12 }}>
            <Text style={styles.link}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", padding: 16, alignItems: "center"  },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 20 },
  title: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 10 },
  link: { color: colors.primary, textAlign: "center", fontWeight: "600" },
  error: { color: colors.primary, marginBottom: 10 },
});
