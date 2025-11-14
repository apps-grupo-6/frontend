import * as api from "@/domain/home/api/locationsApi";
import { getResponseCodes } from "@/utils/httpCodeParser";

export const LocationsService = {
    async getLocations() {
        try {
            const data = await api.getLocations();
            return data;
        } catch (e) {
            const { status } = getResponseCodes(e);

            if (status === 401 || status === 403) {
                throw new Error("No tienes autorización para ver las ubicaciones.");
            }

            if (status === 404) {
                throw new Error("No se encontraron ubicaciones.");
            }

            throw new Error("No se pudieron cargar las ubicaciones. Por favor, intenta de nuevo más tarde.");
        }
    },
};

