import api from "@/api/api";
import { BASE_URL } from "@/domain/classes/config/constants";

const getUpcoming = async () => api.get(`${BASE_URL}/upcoming`);

const getHistory = async (since, until) => {
  let url = `${BASE_URL}/history`;
  if (since && until) url += `/${encodeURIComponent(since)}/${encodeURIComponent(until)}`;
  else if (since) url += `/${encodeURIComponent(since)}`;
  return api.get(url);
};

const getClass = async (id) => api.get(`${BASE_URL}/${id}`);

const reservateClass = async (id) => api.post(`${BASE_URL}/${id}/participant`);

const confirmClass = async (id) => api.post(`${BASE_URL}/${id}/participant/confirm`);

const cancelClass = async (id) => api.delete(`${BASE_URL}/${id}/participant`);

const professorStartsClass = async (id) => {
  return api.post(`${BASE_URL}/${id}/start`);
}

const professorFinishesClass = async (id) => {
  return api.delete(`${BASE_URL}/${id}`);
}

export { getUpcoming, getHistory };
export { getClass, reservateClass, confirmClass, cancelClass, professorStartsClass, professorFinishesClass };