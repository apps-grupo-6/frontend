import { useState, useEffect } from "react";
import { LocationsService } from "@/domain/home/services/locationsService";

export default function useLocations() {
    const [gymNames, setGymNames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchLocations = async () => {
        try {
            setError("");
            setLoading(true);
            const data = await LocationsService.getLocations();
            const locationsArray = Array.isArray(data) ? data : (data?.data || data?.locations || []);
            const uniqueNames = [...new Set(locationsArray.map(loc => loc.gym_name).filter(Boolean))];
            setGymNames(uniqueNames);
        } catch (e) {
            setError(e.message);
            console.error('[useLocations] Error:', e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    return { gymNames, loading, error };
}

