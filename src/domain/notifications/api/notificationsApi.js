import api from "@/api/api";
import { BASE_URL } from "@/domain/notifications/config/constants"

const sendNotification = (notificationData) => {
  return api.post(`${BASE_URL}/`, notificationData);
};

const setNotificationToken = (notificationToken) => {
  return api.post(`${BASE_URL}/setUserToken`, notificationToken);
};

export {
  sendNotification,
  setNotificationToken
};