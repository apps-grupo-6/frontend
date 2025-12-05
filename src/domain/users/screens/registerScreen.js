import { SafeAreaView } from "react-native";
import RegisterForm from "@/domain/users/components/registerForm";
import useRegister from "@/domain/users/hooks/useRegister";
import useLogin from "@/domain/auth/hooks/useLogin";
import WindowLayout from "@/components/layouts/windowLayout";
import useOtp from "@/domain/otp/hooks/useOtp";
import OtpModal from "@/domain/otp/components/otpModal";
import { useNotification } from "@/context/notificationContext";
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function RegisterScreen({ navigation }) {
  const { notifySuccess, notifyError, notifyInfo } = useNotification();
  
  const { form, setField, loading, errorMsg, submitRegister, finishRegister } = useRegister();

  const { showOtp, setShowOtp, otpToken, setOtp, otpErrorMsg, 
          loadingOtp, checkOtp, resendOtp, createOtp, deleteOtp } = useOtp({ username: form.username });

  const { submitLogin, submitConfirmAccount } = useLogin();

  const goLogin = () => navigation.navigate("Login");

  const handleSubmitRegister = async () => {
    const ok = await submitRegister();

    if (ok) {
      notifyInfo("Por favor, espera mientras te enviamos un código para activar tu cuenta.");
      await createOtp({type: "REGISTRATION"});
    } 
    
    await finishRegister();
  };

  const handleConfirmOtp = async () => {
    const response = await checkOtp();

    if (response.ok) {
      await submitConfirmAccount(form.username);
      await submitLogin(form.username, form.password);
      await deleteOtp(response.data.otp_id);
      notifySuccess("Cuenta activada y sesión iniciada correctamente.");
    } else {
      notifyError("Error al activar la cuenta. Por favor, verifica el código OTP.");
    }
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
        title="Activación de cuenta"
      />
    </SafeAreaView>
  );
}
