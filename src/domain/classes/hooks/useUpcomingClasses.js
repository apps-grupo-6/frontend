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
      const allClasses = Array.isArray(res?.data) ? res.data : res;
      
      // Filtrar clases canceladas
      const cancelledStatuses = ["cancelled", "canceled", "cancelado", "cancelada"];
      const activeClasses = allClasses.filter(cls => {
        const status = (cls.participant_status || "").toLowerCase().trim();
        return !cancelledStatuses.includes(status);
      });
      
      setData(activeClasses);
    } catch (e) {
      setError(e?.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, refresh: load };
}
