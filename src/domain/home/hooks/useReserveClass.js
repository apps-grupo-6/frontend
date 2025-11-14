import { useState } from "react";
import { ClassesService } from "@/domain/home/services/classesService";

export default function useReserveClass() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const reserveClass = async (classId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await ClassesService.reserveClass(classId);
            setLoading(false);
            return { success: true, data: response };
        } catch (e) {
            setError(e.message);
            setLoading(false);
            return { success: false, error: e.message };
        }
    };

    return { reserveClass, loading, error };
}