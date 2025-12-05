import api from "@/api/api";
import { BASE_URL } from "@/domain/classes/config/constants";

const getUpcoming = async () => {
  return await api.get(`${BASE_URL}/upcoming`);
};

const getHistory = async (since, until) => {
  let url = `${BASE_URL}/history`;
  if (since && until) url += `?until=${encodeURIComponent(since)}&until=${encodeURIComponent(until)}`;
  else if (since) url += `?since=${encodeURIComponent(since)}`;
  else if (until) url += `?until=${encodeURIComponent(until)}`;
  return await api.get(url);
};

const getClass = async (id) => {
  return await api.get(`${BASE_URL}/${id}`);
}

const reservateClass = async (id) => {
  return await api.post(`${BASE_URL}/${id}/participant`);
}

const participantConfirm = async (id) => {
  return await api.patch(`${BASE_URL}/${id}/participant/confirm`);
}

const participantCancel = async (id) => {
  return await api.patch(`${BASE_URL}/${id}/participant/cancel`);
}

const professorStartsClass = async (id) => {
  return await api.patch(`${BASE_URL}/${id}/start`);
}

const professorFinishesClass = async (id) => {
  return await api.patch(`${BASE_URL}/${id}/finish`);
}

const professorCancelClass = async (id) => {
  return await api.patch(`${BASE_URL}/${id}/cancel`);
}

export { 
  getUpcoming, 
  getHistory, 
  getClass, 
  reservateClass, 
  participantConfirm, 
  participantCancel, 
  professorStartsClass, 
  professorFinishesClass, 
  professorCancelClass 
};