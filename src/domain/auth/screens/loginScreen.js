import { SafeAreaView } from "react-native-safe-area-context";
import AuthLayout from "@/domain/auth/components/layout";
import LoginForm from "@/domain/auth/components/loginForm";
import OtpModal from "@/domain/auth/components/otpModal";
import { useLogin } from "@/domain/auth/hooks/useLogin";

export default function LoginScreen({ navigation }) {
  const {
    username, setUsername, password, setPassword,
    otp_token, setOtp, loading, errorMsg, showOtp, setShowOtp,
    submitLogin, submitOtp, recover,
  } = useLogin();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AuthLayout>
        <LoginForm
          username={username} setUsername={setUsername}
          password={password} setPassword={setPassword}
          onSubmit={submitLogin}
          onGoRegister={() => navigation?.navigate?.("Register")}
          onRecover={recover}
          loading={loading}
          errorMsg={errorMsg}
        />
      </AuthLayout>

      <OtpModal
        visible={showOtp}
        otp_token={otp_token}
        setOtp={setOtp}
        onConfirm={submitOtp}
        onClose={() => setShowOtp(false)}
        loading={loading}
      />
    </SafeAreaView>
  );
}
