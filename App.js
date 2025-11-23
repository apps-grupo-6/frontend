import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/authContext";
import { NotificationProvider } from "@/context/notificationContext";
import Navigation from "@/navigation";
import * as Notifications from "expo-notifications";
import usePushNotifications from "@/domain/notifications/hooks/usePushNotifications";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

Notifications.setNotificationCategoryAsync("CLASS_RESCHEDULED", [
  {
    identifier: "ACCEPT_NEW_TIME",
    buttonTitle: "Aceptar nuevo horario",
    options: {
      opensAppToForeground: false,
      isDestructive: true,
    },
  },
  {
    identifier: "CANCEL_RESERVATION",
    buttonTitle: "Cancelar reserva",
    options: {
      opensAppToForeground: false,
      isDestructive: true,
    },
  },
]);

function PushNotifications() {
  usePushNotifications();
  return <Navigation />;
}

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <NotificationProvider>
        <AuthProvider>
          <PushNotifications />
        </AuthProvider>
      </NotificationProvider>
    </SafeAreaProvider>
  );
}