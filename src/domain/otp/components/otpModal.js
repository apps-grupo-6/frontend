import React, { useRef, useEffect } from "react";
import {
Modal,
View,
Text,
StyleSheet,
TouchableOpacity,
KeyboardAvoidingView,
Platform,
TouchableWithoutFeedback,
Keyboard,
} from "react-native";
import PrimaryButton from "@/components/ui/PrimaryButton";
import OtpInput from "@/domain/otp/components/otpInput";
import colors from "@/theme/colors";

export default function OtpModal({
visible,
otp_token,
setOtp,
onConfirm,
onClose,
onResend,
loading,
otpErrorMsg,
title,
subtitle = "Ingresá el código de 6 dígitos que te enviamos.",
}) {
const otpRef = useRef(null);
const canConfirm = (otp_token ?? "").toString().trim().length === 6 && !loading;

useEffect(() => {
if (visible && otpRef.current) {
otpRef.current.focus();
}
}, [visible]);

return (
<Modal visible={visible} animationType="fade" transparent>
<KeyboardAvoidingView
behavior={Platform.OS === "ios" ? "padding" : "height"}
style={{ flex: 1 }}
keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
>
<View style={styles.backdrop}>
{/* Área clickeable para cerrar teclado (solo backdrop, no el card) */}
<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
<View style={styles.backdropTouchable} />
</TouchableWithoutFeedback>

{/* Card con el contenido (NO wrapped en TouchableWithoutFeedback) */}
<View style={styles.card} pointerEvents="box-none">
<Text style={styles.title}>{title}</Text>
{!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
{!!otpErrorMsg && <Text style={styles.error}>{otpErrorMsg}</Text>}

<OtpInput
ref={otpRef}
value={otp_token}
onChange={setOtp}
length={6}
/>

<PrimaryButton
title="Confirmar"
onPress={onConfirm}
loading={loading}
disabled={!canConfirm}
style={{ marginTop: 4 }}
/>
<PrimaryButton
title="Reenviar"
onPress={onResend}
loading={loading}
variant="secondary"
style={{ marginTop: 10 }}
/>

<TouchableOpacity onPress={onClose} style={styles.cancelContainer}>
<Text style={styles.link}>Cancelar</Text>
</TouchableOpacity>
</View>
</View>
</KeyboardAvoidingView>
</Modal>
);
}

const styles = StyleSheet.create({
backdrop: {
flex: 1,
backgroundColor: "rgba(0,0,0,0.35)",
justifyContent: "center",
padding: 16,
alignItems: "center",
},
backdropTouchable: {
position: "absolute",
top: 0,
left: 0,
right: 0,
bottom: 0,
},
card: {
width: "100%",
maxWidth: 420,
backgroundColor: colors.surface,
borderRadius: 16,
padding: 20,
borderWidth: 1,
borderColor: "#e5e7eb",
shadowColor: "#000",
shadowOpacity: 0.12,
shadowRadius: 14,
shadowOffset: { width: 0, height: 6 },
},
title: {
fontSize: 18,
fontWeight: "800",
color: colors.text,
textAlign: "center",
},
subtitle: {
marginTop: 6,
fontSize: 13,
color: "#6b7280",
textAlign: "center",
marginBottom: 12,
},
error: {
marginTop: 10,
marginBottom: 4,
color: "#ef4444",
textAlign: "center",
fontWeight: "600",
},
cancelContainer: {
marginTop: 18,
marginBottom: 4,
},
link: {
color: colors.primary,
textAlign: "center",
fontWeight: "700",
},
});
