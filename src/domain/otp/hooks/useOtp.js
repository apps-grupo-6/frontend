import { useState, useCallback } from "react";
import { OtpService } from "@/domain/otp/services/otpService";

export default function useOtp({ username = null } = {}) {
    const [showOtp, setShowOtp] = useState(false);
    const [otpToken, setOtp] = useState("");
    const [otpErrorMsg, setOtpErrorMsg] = useState("");
    const [loadingOtp, setLoadingOtp] = useState(false);
    const [otpType, setOtpType] = useState(null);

    const createOtp = useCallback(
        async ({type}) => {
            setOtpErrorMsg("");
            setLoadingOtp(true);
            
            const chosenType = type; 
            setOtpType(chosenType)

            try {
                await OtpService.createOtp({ username, type: chosenType });
                setShowOtp(true);
                return true;
            } catch (e) {
                setOtpErrorMsg(e.message);
                return false;
            } finally {
                setLoadingOtp(false);
            }
        }, [username, otpType]
    );

    const resendOtp = useCallback(
        async () => {
            setOtpErrorMsg("");
            setLoadingOtp(true);

            try {
                await OtpService.resendOtp({ username, type: otpType });
            } catch (e) {
                setOtpErrorMsg(e.message);
            } finally {
                setLoadingOtp(false);
            }
        }, [username, otpType]
    );

    const checkOtp = useCallback(
        async () => {
            setOtpErrorMsg("");
            setLoadingOtp(true);

            let response = {
                "ok": false,
                "data": null
            }
            
            try {
                const data = await OtpService.checkOtp({ username, otp_token: otpToken, type: otpType });
                setShowOtp(false);
                setOtp("")
                response.ok = true;
                response.data = data.data;
                return response;
            } catch (e) {
                setOtpErrorMsg(e.message);
                return response;
            } finally {
                setLoadingOtp(false);
            }
        }, [username, otpToken]
    );

    const deleteOtp = useCallback(
        async (id) => {
            setOtpErrorMsg("");
            setLoadingOtp(true);
            console.log("Deleting OTP with id:", id);
            try {
                await OtpService.deleteOtp(id);
            } catch (e) {
                setOtpErrorMsg(e.message);
            } finally {
                setLoadingOtp(false);
            }
        }, [username, otpToken, otpType]
    );

    return {
        showOtp, setShowOtp,
        otpToken, setOtp,
        otpErrorMsg,
        loadingOtp,
        createOtp, 
        checkOtp,
        resendOtp,
        deleteOtp
    };
}
