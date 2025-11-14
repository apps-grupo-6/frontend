import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "@/context/authContext";

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
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: true, title: "Editar Perfil" }} />
  <Stack.Screen name="ClassDetail" component={ClassDetailScreen} options={{ headerShown: true, title: "Detalle de Clase" }} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? <AppStack /> : <AuthStack />;
}