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
  async getById(id) {
    try {
      // No tenemos mock específico, así que si useMocks está activo devolvemos un objeto mínimo
      if (env.useMocks) {
        const base = (upcomingClasses.find(c => c.id === id) || historyClasses.find(c => c.id === id)) || {};
        return {
          class_discipline_name: base.name || "Clase",
          professor_first_name: base?.instructor?.name?.split(" ")?.[0] || "",
          professor_last_name: base?.instructor?.name?.split(" ")?.slice(1).join(" ") || "",
          class_scheduled_at: base.scheduled_at,
          class_status: base.status || "NOT STARTED",
          gym_name: "Gimnasio Demo",
          gym_address: "Av. Siempreviva 123",
          class_max_participants: 50,
          participants: [],
        };
      }
      const res = await api.getClass(id);
      return res?.data ?? res;
    } catch (e) {
      const { status } = getResponseCodes(e);
      if (status === 401) throw new Error("Sesión expirada. Iniciá sesión nuevamente.");
      if (status === 404) throw new Error("Clase no encontrada.");
      throw new Error("No pudimos obtener el detalle de la clase.");
    }
  },

  async confirm(id) {
    try {
      if (env.useMocks) return { success: true, message: "Presencia confirmada (mock)" };
      const res = await api.confirmClass(id);
      return res?.data ?? res;
    } catch (e) {
      const { status } = getResponseCodes(e);
      if (status === 401) throw new Error("Sesión expirada. Iniciá sesión nuevamente.");
      if (status === 404) throw new Error("Clase no encontrada.");
      if (status === 409) throw new Error("No podés confirmar esta clase (cupo completo o ya confirmada).");
      throw new Error("No pudimos confirmar tu presencia.");
    }
  },

  async cancel(id) {
    try {
      if (env.useMocks) return { success: true, message: "Clase cancelada (mock)" };
      const res = await api.cancelClass(id);
      return res?.data ?? res;
    } catch (e) {
      const { status } = getResponseCodes(e);
      if (status === 401) throw new Error("Sesión expirada. Iniciá sesión nuevamente.");
      if (status === 404) throw new Error("Clase no encontrada.");
      if (status === 409) throw new Error("No podés cancelar esta clase.");
      throw new Error("No pudimos cancelar tu inscripción.");
    }
  },
};
