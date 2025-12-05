import { useState, useCallback } from "react";
import { ClassesService } from "@/domain/classes/services/classesService";
import { LocationsService } from "@/domain/home/services/locationsService";

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

            // 4. Filtrar clases que ya están confirmadas
            const confirmedStatuses = ["confirmed", "confirmada", "checked_in", "asistio", "attended"];
            const pendingClasses = todayClassesAtGym.filter(cls => {
                const status = (cls.participant_status || "").toLowerCase().trim();
                return !confirmedStatuses.includes(status);
            });

            if (pendingClasses.length === 0) {
                return {
                    success: false,
                    error: `Ya confirmaste todas tus clases de hoy en ${gymDisplayName}`,
                    type: "ALL_CONFIRMED"
                };
            }

            // 5. Ordenar las clases pendientes por hora de inicio (más temprano primero)
            const now = new Date();
            const sortedClasses = pendingClasses.sort((a, b) => {
                const dateA = new Date(a.class_scheduled_at || a.scheduled_at || a.date);
                const dateB = new Date(b.class_scheduled_at || b.scheduled_at || b.date);
                return dateA - dateB;
            });

            // 6. Buscar la clase más próxima:
            // - Primero buscar clases que aún no empezaron o empezaron hace menos de 60 min
            // - Priorizar las que están por empezar
            let classToConfirm = null;

            for (const cls of sortedClasses) {
                const classDate = new Date(cls.class_scheduled_at || cls.scheduled_at || cls.date);
                const diffMinutes = (classDate - now) / (1000 * 60);

                // Clase que empieza en el futuro o empezó hace menos de 60 minutos
                if (diffMinutes >= -60) {
                    classToConfirm = cls;
                    break;
                }
            }

            // Si todas las clases pendientes ya pasaron hace más de 60 min, tomar la última
            if (!classToConfirm) {
                classToConfirm = sortedClasses[sortedClasses.length - 1];
            }
            const classId = classToConfirm.class_id || classToConfirm.id;

            // 7. Confirmar asistencia
            await ClassesService.confirm(classId);

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
