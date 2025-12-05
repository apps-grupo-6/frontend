import { useState, useEffect } from "react";
import { ClassesService } from "@/domain/home/services/classesService";

const ITEMS_PER_PAGE = 10;

export default function useClasses(selectedGym = null, selectedTimeRange = null) {
    const [allClasses, setAllClasses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isDescending, setIsDescending] = useState(true); // true = más reciente primero

    const fetchClasses = async () => {
        try {
            setError("");
            setLoading(true);
            const data = await ClassesService.getClasses();
            const classesArray = Array.isArray(data) ? data : (data?.data || data?.classes || []);
            const activeClasses = classesArray.filter(cls => {
                const status = cls.class_status?.toLowerCase();
                return status !== 'finished' && status !== 'finalizada';
            });
            setAllClasses(activeClasses);
            setCurrentPage(1);
        } catch (e) {
            setError(e.message);
            console.error('[useClasses] Error:', e.message);
        } finally {
            setLoading(false);
        }
    };

    const cancelClass = async (classId) => {
        try {
            setError("");
            setLoading(true);
            await ClassesService.cancelClass(classId);
            await fetchClasses();
            return true;
        } catch (e) {
            setError(e.message);
            console.error('[cancelClass] Error:', e.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    // Resetear a página 1 cuando cambie cualquier filtro
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedGym, selectedTimeRange]);

    const timeRanges = {
        'Mañana (6:00 - 12:00)': [6, 12],
        'Mediodía (12:00 - 16:00)': [12, 16],
        'Tarde (16:00 - 20:00)': [16, 20],
        'Noche (20:00 - 24:00)': [20, 24]
    };

    const isInTimeRange = (dateString, timeRange) => {
        if (!timeRange || !dateString) return true;
        try {
            const hours = new Date(dateString).getHours();
            const [start, end] = timeRanges[timeRange] || [0, 24];
            return hours >= start && hours < end;
        } catch (e) {
            return false;
        }
    };

    let filteredClasses = allClasses;

    if (selectedGym) {
        filteredClasses = filteredClasses.filter(cls => cls.gym_name === selectedGym);
    }

    if (selectedTimeRange) {
        filteredClasses = filteredClasses.filter(cls =>
            isInTimeRange(cls.class_scheduled_at, selectedTimeRange)
        );
    }

    const orderedClasses = isDescending ? [...filteredClasses].reverse() : filteredClasses;

    const totalPages = Math.ceil(orderedClasses.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedClasses = orderedClasses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const toggleOrder = () => { setIsDescending(!isDescending); setCurrentPage(1); };

    return {
        classes: paginatedClasses,
        loading,
        error,
        currentPage,
        totalPages,
        totalClasses: orderedClasses.length,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        goToNextPage,
        goToPreviousPage,
        isDescending,
        toggleOrder,

        cancelClass
    };
}

