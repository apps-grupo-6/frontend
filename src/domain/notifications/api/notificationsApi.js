import api from "@/api/api";
import { BASE_URL } from "@/domain/notifications/config/constants"

const setNotificationToken = (notificationToken) => {
  return api.post(`${BASE_URL}/token`, notificationToken);
};

export {
  setNotificationToken
};