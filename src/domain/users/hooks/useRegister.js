import { useState } from "react";
import { UsersService } from "@/domain/users/services/usersService";

export default function useRegister() {
  const [form, setForm] = useState({ username: "", password: "", first_name: "", last_name: "", telephone: "", contact_email: ""});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submitRegister = async () => {
    setErrorMsg("");
    try {
      setLoading(true);
      await UsersService.register(form);
      return true;
    } catch (e) {
      setErrorMsg(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { 
    form, setField, 
    loading, 
    errorMsg,
    submitRegister 
  };
}
