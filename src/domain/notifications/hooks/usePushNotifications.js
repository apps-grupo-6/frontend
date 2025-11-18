import { useEffect, useState, useRef } from "react";
import * as Notifications from "expo-notifications";
import { NotificationsService } from "@/domain/notifications/services/notificationsService";

export default function usePushNotifications() {
    const [expoPushToken, setExpoPushToken] = useState(null);
    const [lastNotification, setLastNotification] = useState(null);
    const notificationListener = useRef(null);
    const responseListener = useRef(null);

    useEffect(() => {
        (async () => {
            const token = await NotificationsService.setNotificationToken();
            
            if (token) {
                setExpoPushToken(token);
            }
        })();

    // Listener cuando llega notificación en foreground
    notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
            setLastNotification(notification);
        });

    // Listener cuando el usuario toca la notificación
    responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
            console.log("User tapped notification:", response);
        });

    return () => {
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };
    }, []);

    return {
        expoPushToken,
        lastNotification,
    };
}
