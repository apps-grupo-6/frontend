import { SafeAreaView } from "react-native-safe-area-context";
import WindowLayout from "@/components/layouts/windowLayout";
import RecoverForm from "@/domain/auth/components/recoverForm";
import useRecover from "@/domain/auth/hooks/useRecover";
import useOtp from "@/domain/otp/hooks/useOtp";
import OtpModal from "@/domain/otp/components/otpModal";

export default function RecoverScreen({ navigation }) {
    const {
        username, setUsername,
        new_password, setNewPassword,
        loading, errorMsg,
        showPasswordField,
        submitRecover,
        newPasswordCheck,
    } = useRecover();

    const {
        showOtp, setShowOtp,
        otp_token, setOtp,
        otpErrorMsg,
        loadingOtp,
        startOtp, 
        submitOtp,
        resendOtp,
    } = useOtp({ username, new_password, onSuccess: () => navigation.replace("Home") });

    const handleContinueRecover = async () => {
        await submitRecover();
    };

    const handleSubmitRecover = async () => {
        const ok = await newPasswordCheck()
        
        if (ok)
            await startOtp({type: "RECOVER"}, false);
    };

    const handleConfirmOtp = async () => {
        await submitOtp();
    };

    const goLogin = () => navigation.navigate("Login");
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <WindowLayout title="Recupera tu cuenta">
                <RecoverForm
                    username={username}
                    setUsername={setUsername}
                    new_password={new_password}
                    setNewPassword={setNewPassword}
                    loading={loading}
                    errorMsg={errorMsg}
                    showPasswordField={showPasswordField}
                    onContinue={handleContinueRecover}
                    onGoLogin={goLogin}
                    onSubmit={handleSubmitRecover}
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
                title="Validación de solicitud"
            />
        </SafeAreaView>
    );
}