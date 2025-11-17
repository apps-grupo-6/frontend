import { useState } from "react";
import { AuthService } from "@/domain/auth/services/authService";
import { useAuth } from "@/context/authContext";

export default function useLogin() {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authErrorMsg, setAuthErrorMsg] = useState("");

  const submitLogin = async (u = username, p = password) => {
    try {
      setAuthErrorMsg("");
      setLoading(true);
      const response = await AuthService.login({ username: u, password: p });
      const token = response.data.token
      login(token)
      return 0;
    } catch (e) {
      if( e.message === "La cuenta no está activada.")
        return 1;

      setAuthErrorMsg(e.message);
      return -1;
    } finally {
      setLoading(false);
    }
  };

  const submitConfirmAccount = async (u = username,) => {
    try {
      await AuthService.confirmAccount({ username: u });
    } catch (e) {
      setAuthErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    username, setUsername, 
    password, setPassword,
    loading, 
    authErrorMsg, 

    submitLogin,
    submitConfirmAccount
  };
}
