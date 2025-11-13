import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/authContext";
import Navigation from "@/navigation";

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}