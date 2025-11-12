import api from "@/api/api";

const BASE_URL = "/classes";

const getUpcoming = async () => api.get(`${BASE_URL}/upcoming`);

const getHistory = async (since, until) => {
  let url = `${BASE_URL}/history`;
  if (since && until) url += `/${encodeURIComponent(since)}/${encodeURIComponent(until)}`;
  else if (since) url += `/${encodeURIComponent(since)}`;
  return api.get(url);
};

export { getUpcoming, getHistory };
