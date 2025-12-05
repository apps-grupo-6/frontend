import { SafeAreaView } from "react-native-safe-area-context";
import WindowLayout from "@/components/layouts/windowLayout";
import RecoverForm from "@/domain/auth/components/recoverForm";
import useRecover from "@/domain/auth/hooks/useRecover";
import useLogin from "@/domain/auth/hooks/useLogin";
import useOtp from "@/domain/otp/hooks/useOtp";
import OtpModal from "@/domain/otp/components/otpModal";

export default function RecoverScreen({ navigation }) {
    const { username, setUsername, newPassword, setNewPassword, loading, errorMsg, 
            showPasswordField, checkRecoverAccount, newPasswordCheck, submitRecover } = useRecover();

    const { showOtp, setShowOtp, otpToken, setOtp, otpErrorMsg, 
            loadingOtp, createOtp, checkOtp, resendOtp, deleteOtp } = useOtp({ username });
    
    const { submitLogin } = useLogin();

    const handleContinueRecover = async () => {
        await checkRecoverAccount();
    };

    const handleCheckRecoverAccount = async () => {
        const ok = await newPasswordCheck()
        
        if (ok)
            await createOtp({type: "RECOVER"});
    };

    const handleConfirmOtp = async () => {
        const response = await checkOtp();

        if (response.ok) {
            await submitRecover();
            await submitLogin(username, newPassword);
            await deleteOtp(response.data.otp_id);
        }
    };

    const goLogin = () => navigation.navigate("Login");
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <WindowLayout title="Recupera tu cuenta">
                <RecoverForm
                    username={username}
                    setUsername={setUsername}
                    newPassword={newPassword}
                    setNewPassword={setNewPassword}
                    loading={loading}
                    errorMsg={errorMsg}
                    showPasswordField={showPasswordField}
                    onContinue={handleContinueRecover}
                    onGoLogin={goLogin}
                    onSubmit={handleCheckRecoverAccount}
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
                title="Validación de solicitud"
            />
        </SafeAreaView>
    );
}