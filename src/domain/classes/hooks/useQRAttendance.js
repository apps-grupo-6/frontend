import { useState, useCallback } from "react";
import { ClassesService } from "@/domain/classes/services/classesService";
import { LocationsService } from "@/domain/home/services/locationsService";

const BLOCK_CONFIRM_STATUS = ['EXPIRED', 'ABSENT', 'PRESENT', 'CANCELLED', 'CONFIRMED'];

export default function useQRAttendance() {
    const [loading, setLoading] = useState(false);

    const isToday = (dateString) => {
        const classDate = new Date(dateString);
        const today = new Date();
        return (
            classDate.getFullYear() === today.getFullYear() &&
            classDate.getMonth() === today.getMonth() &&
            classDate.getDate() === today.getDate()
        );
    };

    const getGymName = async (gymId) => {
        try {
            const response = await LocationsService.getLocations();
            const locations = Array.isArray(response?.data) ? response.data : response;
            const gym = locations?.find(loc => loc.gym_id === gymId || loc.id === gymId);
            return gym?.gym_name || gym?.name || null;
        } catch {
            return null;
        }
    };

    const confirmAttendanceByGymId = useCallback(async (gymId) => {
        setLoading(true);

        try {
            const gymIdNumber = parseInt(gymId, 10);

            // 1. Obtener el nombre del gimnasio
            const gymName = await getGymName(gymIdNumber);
            const gymDisplayName = gymName || "este gimnasio";

            // 2. Obtener las clases reservadas del usuario
            const response = await ClassesService.getUpcoming();
            const upcomingClasses = Array.isArray(response?.data) ? response.data : response;

            if (!upcomingClasses || upcomingClasses.length === 0) {
                return {
                    success: false,
                    error: "No tenés clases reservadas",
                    type: "NO_CLASSES"
                };
            }

            // 3. Filtrar clases que sean de hoy y del gimnasio escaneado
            const todayClassesAtGym = upcomingClasses.filter(cls => {
                const classGymId = cls.gym_id || cls.location_id;
                const classDate = cls.class_scheduled_at || cls.scheduled_at || cls.date;
                return classGymId === gymIdNumber && isToday(classDate);
            });

            if (todayClassesAtGym.length === 0) {
                return {
                    success: false,
                    error: `No tenés clases reservadas hoy en ${gymDisplayName}`,
                    type: "NO_CLASS_TODAY"
                };
            }

            // 4. Filtrar clases cuyo estado NO esté bloqueado
            const availableClasses = todayClassesAtGym.filter(cls => {
                const status = (cls.participant_status || cls.class_status || "").toUpperCase().trim();
                return !BLOCK_CONFIRM_STATUS.includes(status);
            });

            if (availableClasses.length === 0) {
                return {
                    success: false,
                    error: `No tenés clases disponibles para confirmar hoy en ${gymDisplayName}`,
                    type: "NO_AVAILABLE_CLASSES"
                };
            }

            // 5. Ordenar las clases disponibles por hora de inicio (más temprano primero)
            const sortedClasses = availableClasses.sort((a, b) => {
                const dateA = new Date(a.class_scheduled_at || a.scheduled_at || a.date);
                const dateB = new Date(b.class_scheduled_at || b.scheduled_at || b.date);
                return dateA - dateB;
            });

            // 6. Tomar la primera clase del día (la más temprana)
            const classToConfirm = sortedClasses[0];
            const classId = classToConfirm.class_id || classToConfirm.id;

            // 7. Confirmar asistencia
            await ClassesService.participantConfirm(classId);

            return {
                success: true,
                classData: classToConfirm,
                message: `¡Asistencia confirmada para ${classToConfirm.class_discipline_name || classToConfirm.discipline_name || 'la clase'}!`
            };

        } catch (e) {
            return {
                success: false,
                error: e.message || "Error al confirmar asistencia",
                type: "ERROR"
            };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        confirmAttendanceByGymId,
        loading
    };
}
