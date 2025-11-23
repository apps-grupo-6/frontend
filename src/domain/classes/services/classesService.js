import * as api from "@/domain/classes/api/classesApi";
import { getResponseCodes } from "@/utils/httpCodeParser";

export const ClassesService = {
  async getUpcoming() {
    try {
      return await api.getUpcoming();
    } catch (e) {
      const { status } = getResponseCodes(e);
      if (status === 401) throw new Error("Sesión expirada. Iniciá sesión nuevamente.");
      throw new Error("No pudimos obtener tus próximas clases.");
    }
  },

  async getHistory({ since, until } = {}) {
    try {
      return await api.getHistory(since, until);
    } catch (e) {
      const { status } = getResponseCodes(e);
      if (status === 401) throw new Error("Sesión expirada. Iniciá sesión nuevamente.");
      throw new Error("No pudimos obtener tu historial de clases.");
    }
  },

  async getById(id) {
    try {
      const res = await api.getClass(id);
      return res?.data ?? res;
    } catch (e) {
      const { status } = getResponseCodes(e);
      if (status === 401) throw new Error("Sesión expirada. Iniciá sesión nuevamente.");
      if (status === 404) throw new Error("Clase no encontrada.");
      throw new Error("No pudimos obtener el detalle de la clase.");
    }
  },

  async participantConfirm(id) {
    try {
      const res = await api.participantConfirm(id);
      return res?.data ?? res;
    } catch (e) {
      const { status } = getResponseCodes(e);
      if (status === 401) throw new Error("Sesión expirada. Iniciá sesión nuevamente.");
      if (status === 404) throw new Error("Clase no encontrada.");
      if (status === 409) throw new Error("No podés confirmar esta clase (cupo completo o ya confirmada).");
      throw new Error("No pudimos confirmar tu presencia.");
    }
  },

  async participantCancel(id) {
    try {
      const res = await api.participantCancel(id);
      return res?.data ?? res;
    } catch (e) {
      const { status } = getResponseCodes(e);
      if (status === 401) throw new Error("Sesión expirada. Iniciá sesión nuevamente.");
      if (status === 404) throw new Error("Clase no encontrada.");
      if (status === 409) throw new Error("No podés cancelar tu participación en esta clase.");
      throw new Error("No pudimos cancelar tu inscripción.");
    }
  },

  async cancelClass(id) {
    try {
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
