import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/authContext";
import { NotificationProvider } from "@/context/notificationContext";
import Navigation from "@/navigation";

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <NotificationProvider>
        <AuthProvider>
          <Navigation />
        </AuthProvider>
      </NotificationProvider>
    </SafeAreaProvider>
  );
}