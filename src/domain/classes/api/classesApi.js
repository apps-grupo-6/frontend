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

// Endpoints según backend Flask compartido:
// PUT /<id>/participant/confirm
// DELETE /<id>/participant
const confirmClass = async (id) => api.put(`${BASE_URL}/${id}/participant/confirm`);

const cancelClass = async (id) => api.delete(`${BASE_URL}/${id}/participant`);

export { getUpcoming, getHistory };
export { getClass, confirmClass, cancelClass };
