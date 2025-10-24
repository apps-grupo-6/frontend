import { SafeAreaView } from "react-native";
import RegisterForm from "@/domain/users/components/registerForm";
import useRegister from "@/domain/users/hooks/useRegister";
import WindowLayout from "@/components/layouts/windowLayout";
import useOtp from "@/domain/otp/hooks/useOtp";
import OtpModal from "@/domain/otp/components/otpModal";

export default function RegisterScreen({ navigation }) {
  const { form, setField, submitRegister, loading, errorMsg, successMsg } = useRegister();

  const {
    showOtp, setShowOtp,
    otp_token, setOtp,
    otpErrorMsg,
    loadingOtp,
    submitOtp,
    resendOtp,
    startOtp
  } = useOtp({ username: form.username, onSuccess: () => navigation.replace("Home") });

  const goLogin = () => navigation.navigate("Login");

  const handleSubmitRegister = async () => {
    const ok = await submitRegister();
    
    if (ok)
      await startOtp({type: "REGISTRATION"}, false);
  };

  const handleConfirmOtp = async () => {
    await submitOtp();
  };
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WindowLayout title="Creación de cuenta">
        <RegisterForm
          form={form}
          setField={setField}
          onSubmit={handleSubmitRegister}
          onGoLogin={goLogin}
          loading={loading}
          errorMsg={errorMsg}
          successMsg={successMsg}
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
        title="Activación de cuenta"
      />
    </SafeAreaView>
  );
}
