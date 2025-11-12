import { useCallback, useEffect, useState } from "react";
import { ClassesService } from "@/domain/classes/services/classesService";

export default function useUpcomingClasses() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await ClassesService.getUpcoming();
      setData(Array.isArray(res?.data) ? res.data : res);
    } catch (e) {
      setError(e?.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, refresh: load };
}
