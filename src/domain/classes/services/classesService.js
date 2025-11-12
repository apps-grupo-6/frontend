import * as api from "@/domain/classes/api/classesApi";
import { getResponseCodes } from "@/utils/httpCodeParser";
import env from "@/config/env";
import { upcomingClasses, historyClasses } from "@/domain/classes/mocks/classesMocks";

export const ClassesService = {
  async getUpcoming() {
    try {
      if (env.useMocks) return upcomingClasses;
      return await api.getUpcoming();
    } catch (e) {
      const { status } = getResponseCodes(e);
      if (status === 401) throw new Error("Sesión expirada. Iniciá sesión nuevamente.");
      throw new Error("No pudimos obtener tus próximas clases.");
    }
  },

  async getHistory({ since, until } = {}) {
    try {
      if (env.useMocks) return historyClasses;
      return await api.getHistory(since, until);
    } catch (e) {
      const { status } = getResponseCodes(e);
      if (status === 401) throw new Error("Sesión expirada. Iniciá sesión nuevamente.");
      throw new Error("No pudimos obtener tu historial de clases.");
    }
  },
};
