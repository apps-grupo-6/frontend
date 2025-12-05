import { useState } from "react";
import { AuthService } from "@/domain/auth/services/authService";
import { isValidPassword } from "@/domain/auth/utils/authUtils"

export default function useRecover() {
    const [username, setUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [showPasswordField, setShowPasswordField] = useState(false);

    const checkRecoverAccount = async () => {
        setErrorMsg("");
        setLoading(true);

        try {
            await AuthService.recoverAccount({ username });
            setShowPasswordField(true);
        } catch (e) {
            setErrorMsg(e.message);
        } finally {
            setLoading(false);
        }
    };

    const newPasswordCheck = async () => {
        setErrorMsg("");
        setLoading(true);
        
        try {
            isValidPassword(newPassword)
            return true;
        } catch (e) {
            setErrorMsg(e.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const submitRecover = async () => {
        setErrorMsg("");
        setLoading(true);

        try {
            await AuthService.recoverAccount({ username, new_password: newPassword });
        } catch (e) {
            setErrorMsg(e.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        username, setUsername,
        newPassword, setNewPassword,
        loading, 
        errorMsg,
        showPasswordField,

        checkRecoverAccount,
        newPasswordCheck,
        submitRecover
    };
}
