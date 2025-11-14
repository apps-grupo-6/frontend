import { useCallback, useEffect, useState } from 'react';
import { ClassesService } from '@/domain/classes/services/classesService';

export function useClassDetail(classId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!classId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await ClassesService.getById(classId);
      setData(res);
    } catch (e) {
      setError(e.message || 'Error cargando la clase');
    } finally {
      setLoading(false);
    }
  }, [classId]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try { await load(); } finally { setRefreshing(false); }
  }, [load]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, refresh, refreshing, reload: load };
}

export default useClassDetail;