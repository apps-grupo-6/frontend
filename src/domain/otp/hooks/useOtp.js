import { useState, useCallback } from "react";
import { AuthService } from "@/domain/auth/services/authService";
import { OtpService } from "@/domain/otp/services/otpService";
import { useAuth } from "@/context/authContext";
import { useNotification } from "@/context/notificationContext";

export default function useOtp({ username = null, new_password = null, onSuccess = null } = {}) {
    const { login } = useAuth();

    const [showOtp, setShowOtp] = useState(false);
    const [otp_token, setOtp] = useState("");
    const [otpErrorMsg, setOtpErrorMsg] = useState("");
    const [loadingOtp, setLoadingOtp] = useState(false);
    const [otpType, setOtpType] = useState(null);
    const { notifySuccess } = useNotification();

    const startOtp = useCallback(async (type, createOtp = true) => {
        setOtpErrorMsg("");
        setLoadingOtp(true);
        setOtpType(type.type)

        try {
            if (createOtp)
                await OtpService.startOtp(type);

            setShowOtp(true);
            return true;
        } catch (e) {
            setOtpErrorMsg(e.message);
            return false;
        } finally {
            setLoadingOtp(false);
        }
    }, []);

    const resendOtp = useCallback(async () => {
        setOtpErrorMsg("");
        setLoadingOtp(true);

        try {
            await OtpService.resendOtp({ username, type: otpType });
        } catch (e) {
            setOtpErrorMsg(e.message);
        } finally {
            setLoadingOtp(false);
        }
    }, [username, otpType]);

    const submitOtp = useCallback(
        async () => {
            setOtpErrorMsg("");
            setLoadingOtp(true);

            try {
                switch (otpType) {
                    case "LOGIN":
                        const response = await AuthService.loginOtp({ username, otp_token });
                        const token = response.data.token
                        login(token)
                        notifySuccess("Éxito", "Se ha conectado correctamente")
                        break;

                    case "REGISTRATION":
                        await AuthService.confirmAccount({ username, otp_token });
                        notifySuccess("Éxito", "Se ha registrado correctamente")
                        break;
                    
                    case "RECOVER":
                        await AuthService.recoverAccountOtp({ username, otp_token, new_password });
                        notifySuccess("Éxito", "Ha actualizado y recuperado su cuenta correctamente")
                        break;

                    default:
                        throw new Error(`Invalid OTP type '${otpType}' in submitOtp().`);
                }

                setShowOtp(false);
                setOtp("")
                if (onSuccess)
                    onSuccess();

            } catch (e) {
                setOtpErrorMsg(e.message);
            } finally {
                setLoadingOtp(false);
            }
        }, [otpType, username, otp_token, new_password, onSuccess]
    );

    return {
        showOtp, setShowOtp,
        otp_token, setOtp,
        otpErrorMsg,
        loadingOtp,
        startOtp, 
        submitOtp,
        resendOtp,
    };
}
