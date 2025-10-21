import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/authContext";
import LoginScreen from "@/domain/auth/screens/loginScreen";

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    </SafeAreaProvider>
  );
}