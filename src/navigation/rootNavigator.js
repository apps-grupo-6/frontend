import { useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "@/context/authContext";
import { useNotification } from "@/context/notificationContext";
import colors from "@/theme/colors";
import QRScanButton from "@/components/ui/QRScanButton";
import QRScannerModal from "@/components/ui/QRScannerModal";
import useQRAttendance from "@/domain/classes/hooks/useQRAttendance";

import LoginScreen from "@/domain/auth/screens/loginScreen";
import RecoverScreen from "@/domain/auth/screens/recoverScreen";
import RegisterScreen from "@/domain/users/screens/registerScreen";
import HomeScreen from "@/domain/home/screen/homeScreen";
import ProfileScreen from "@/domain/users/screens/profileScreen";
import EditProfileScreen from "@/domain/users/screens/editProfileScreen";
import ClassDetailScreen from "@/domain/classes/screens/classDetailScreen";

const Stack = createNativeStackNavigator();
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Recover" component={RecoverScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  const [scannerVisible, setScannerVisible] = useState(false);
  const { confirmAttendanceByGymId, loading: confirmingAttendance } = useQRAttendance();
  const { notifySuccess, notifyError } = useNotification();

  const handleQRScanned = async (data) => {
    // El QR contiene el gym_id
    const gymId = data.trim();

    // Validar que sea un ID válido
    if (!gymId || isNaN(parseInt(gymId, 10))) {
      notifyError(
        "QR Inválido",
        "El código QR escaneado no es válido"
      );
      return;
    }

    // Confirmar asistencia
    const result = await confirmAttendanceByGymId(gymId);

    if (result.success) {
      notifySuccess(
        "¡Asistencia Confirmada!",
        result.message
      );
    } else {
      notifyError(
        "No se pudo confirmar",
        result.error
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: true, title: "Editar Perfil" }} />
        <Stack.Screen name="ClassDetail" component={ClassDetailScreen} options={{ headerShown: true, title: "Detalle de Clase" }} />
      </Stack.Navigator>

      <QRScanButton onPress={() => setScannerVisible(true)} disabled={confirmingAttendance} />

      <QRScannerModal
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onScan={handleQRScanned}
      />
    </View>
  );
}

export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return isAuthenticated ? <AppStack /> : <AuthStack />;
}