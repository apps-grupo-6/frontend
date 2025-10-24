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
  } = useOtp({ username, onSuccess: () => navigation.replace("Home") });

  const goRegister = () => navigation.navigate("Register");
  const goRecover = () => navigation.navigate("Recover");

  const handleSubmitLogin = async () => {
    const ok = await submitLogin();
    if (ok) {
      await startOtp({type: "LOGIN"}, false);
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
        title="Validación de acceso"
      />
    </SafeAreaView>
  );
}
