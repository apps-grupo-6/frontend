import * as api from "@/domain/home/api/classesApi";
import { getResponseCodes } from "@/utils/httpCodeParser";

export const ClassesService = {
    async getClasses() {
        try {
            const data = await api.getClasses();
            return data;
        } catch (e) {
            const { status } = getResponseCodes(e);

            if (status === 401 || status === 403) {
                throw new Error("No tienes autorización para ver las clases.");
            }

            if (status === 404) {
                throw new Error("No se encontraron clases.");
            }

            throw new Error("No se pudieron cargar las clases. Por favor, intenta de nuevo más tarde.");
        }
    },
};

