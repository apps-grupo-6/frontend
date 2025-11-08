import { useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";
import WindowLayout from "@/components/layouts/windowLayout";
import LoginForm from "@/domain/auth/components/loginForm";
import useLogin from "@/domain/auth/hooks/useLogin";
import useOtp from "@/domain/otp/hooks/useOtp";
import OtpModal from "@/domain/otp/components/otpModal";

export default function LoginScreen({ navigation }) {
  const { username, setUsername, password, setPassword, loading, authErrorMsg, submitLogin } = useLogin();
  const {
    showOtp, setShowOtp,
    otp_token, setOtp,
    otpErrorMsg,
    loadingOtp,
    startOtp, 
    submitOtp,
    resendOtp,
  } = useOtp({ username });

  const goRegister = () => navigation.navigate("Register");
  const goRecover = () => navigation.navigate("Recover");  
  const [otpTitle, setOtpTitle] = useState("");

  const handleSubmitLogin = async () => {
    const ok = await submitLogin();
    if (ok === 0) {
      setOtpTitle("Validación de acceso")
      await startOtp({type: "LOGIN"}, false);
    } else if (ok === 1){
      setOtpTitle("Activación de cuenta pendiente")
      await startOtp({type: "REGISTRATION"}, false);
    }
  };

  const handleConfirmOtp = async () => {
    await submitOtp();
  };
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WindowLayout title="Inicio de sesión">
        <LoginForm
          username={username} setUsername={setUsername}
          password={password} setPassword={setPassword}
          onSubmit={handleSubmitLogin}
          onGoRegister={goRegister}
          onRecover={goRecover}
          loading={loading}
          authErrorMsg={authErrorMsg}
        />
      </WindowLayout>

      <OtpModal
        visible={showOtp}
        otp_token={otp_token}
        setOtp={setOtp}
        onConfirm={handleConfirmOtp}
        onClose={() => setShowOtp(false)}
        onResend={resendOtp}
        loading={loadingOtp}
        otpErrorMsg={otpErrorMsg}
        title={otpTitle}
      />
    </SafeAreaView>
  );
}
