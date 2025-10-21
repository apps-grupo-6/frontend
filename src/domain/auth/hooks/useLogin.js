import { useState } from "react";
import { AuthService } from "@/domain/auth/services/authService";
import { OtpService } from "@/domain/otp/services/otpService";
import { useAuth } from "@/context/authContext";

export function useLogin() {
  const { setToken } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp_token, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const submitLogin = async () => {
    if (!username || !password) {
      setErrorMsg("Invalid username or password.");
      return 
    }

    try {
      setLoading(true);
      const res = await AuthService.login({ username, password });
      const token = res.data.token;
      setToken(token);

      setShowOtp(true);
      await OtpService.createOtp("LOGIN");

    } catch (e) {
      const status = e?.status ?? e?.response?.status ?? null;
      const specific_code = e?.code ?? e?.response?.data?.code ?? null;
      
      if (status == 400 && specific_code == "0411"){
        setErrorMsg("This account is not confirmed.");
      } else if (status == 404 || (status == 400 && specific_code == "0410")){
        setErrorMsg("Invalid username or password.");
      } else{
        setErrorMsg("There was a problem while trying to login. Please try again later.");
      }
    } finally {
      setErrorMsg("");
      setLoading(false);
    }
  };

  const submitOtp = async () => {
    if (!otp_token) {
      setErrorMsg("Please write your otp_token token.");
      return 
    }

    try {
      setLoading(true);
      await AuthService.loginOtp({ otp_token });
      setShowOtp(false);
    } catch (e) {
      setErrorMsg("Invalid otp_token token");
    } finally {
      setErrorMsg("");
      setLoading(false);
    }
  };

  const recover = async () => {
    if (!username) {
      setErrorMsg("Ingresá tu username para recuperar.");
      return 
    }

    try {
      await AuthService.recoverAccount({ username });
    } catch {}
  };

  return {
    username, setUsername, password, setPassword,
    otp_token, setOtp, loading, errorMsg, showOtp, setShowOtp,
    submitLogin, submitOtp, recover,
  };
}
