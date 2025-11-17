import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/authContext";
import { NotificationProvider } from "@/context/notificationContext";
import Navigation from "@/navigation";
import * as Notifications from "expo-notifications";
import usePushNotifications from "@/domain/notifications/hooks/usePushNotifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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