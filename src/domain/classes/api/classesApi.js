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

export { getUpcoming, getHistory };
export { getClass };
