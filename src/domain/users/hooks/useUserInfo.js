import { useCallback, useEffect, useState } from "react";
import { UsersService } from "@/domain/users/services/usersService";

export default function useUserInfo() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await UsersService.getMe();
      setData(res);
    } catch (e) {
      setError(e?.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const update = useCallback(async (payload) => {
    setLoading(true);
    setError("");
    try {
      const res = await UsersService.updateMe(payload);
      setData(res);
      return { ok: true };
    } catch (e) {
      setError(e?.message || "Error inesperado");
      return { ok: false, message: e?.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, refresh: load, update };
}
