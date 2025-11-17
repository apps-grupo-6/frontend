import * as api from "@/domain/notifications/api/notificationsApi";
import { getResponseCodes } from "@/utils/httpCodeParser";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

async function getExpoPushToken() {
    if (!Device.isDevice) {
        console.log("Push notifications solo funcionan en dispositivo físico");
        return null;
    }

    // Permisos
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== "granted") {
        console.warn("Permisos de notificación denegados");
        return null;
    }

    // Obtener projectId desde la config de Expo/EAS
    const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ||
        Constants.easConfig?.projectId;

    if (!projectId) {
        console.warn("No se encontró projectId, verifica app.config.js / EAS");
        return null;
    }

    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    console.log("Expo push token:", token);

    return token;
}

export const NotificationsService = {
    async setNotificationToken() {
        try {
            const token = await getExpoPushToken();
            if (!token) return null;
            
            const data = await api.setNotificationToken({ expo_push_token: token });
            return data;

        } catch (e) {
            const { status } = getResponseCodes(e);
            if (status === 401)
                throw new Error("Sesión expirada. Iniciá sesión nuevamente.");

            throw new Error("No pudimos actualizar tu token de notificación.");
        }
    }
};
