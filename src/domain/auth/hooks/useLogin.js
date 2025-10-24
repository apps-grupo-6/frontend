import { useState } from "react";
import { AuthService } from "@/domain/auth/services/authService";

export default function useLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authErrorMsg, setAuthErrorMsg] = useState("");

  const submitLogin = async () => {
    try {
      setAuthErrorMsg("");
      setLoading(true);
      await AuthService.login({ username, password });
      return true;
    } catch (e) {
      setAuthErrorMsg(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    username, setUsername, 
    password, setPassword,
    loading, 
    authErrorMsg, 
    submitLogin 
  };
}
