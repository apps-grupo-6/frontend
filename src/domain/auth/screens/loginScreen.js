import { SafeAreaView } from "react-native-safe-area-context";
import WindowLayout from "@/components/layouts/windowLayout";
import LoginForm from "@/domain/auth/components/loginForm";
import useLogin from "@/domain/auth/hooks/useLogin";
import useOtp from "@/domain/otp/hooks/useOtp";
import OtpModal from "@/domain/otp/components/otpModal";

export default function LoginScreen({ navigation }) {
  const { username, setUsername, password, setPassword, loading, authErrorMsg, submitLogin, submitConfirmAccount } = useLogin();

  const { showOtp, setShowOtp, otpToken, setOtp, otpErrorMsg, 
          loadingOtp, createOtp, checkOtp, resendOtp, deleteOtp } = useOtp({ username });

  const goRegister = () => navigation.navigate("Register");
  const goRecover = () => navigation.navigate("Recover");  

  const handleSubmitLogin = async () => {
    const ok = await submitLogin();
    
    if (ok === 1) //if account is not activated
      await createOtp({type: "REGISTRATION"});

  };

  const handleConfirmOtp = async () => {
    const response = await checkOtp();

    if (response.ok) {
      await submitConfirmAccount();
      await submitLogin();
      await deleteOtp(response.data.otp_id);
    }
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
        otpToken={otpToken}
        setOtp={setOtp}
        onConfirm={handleConfirmOtp}
        onClose={() => setShowOtp(false)}
        onResend={resendOtp}
        loading={loadingOtp}
        otpErrorMsg={otpErrorMsg}
        title="Activación de cuenta pendiente"
      />
    </SafeAreaView>
  );
}
