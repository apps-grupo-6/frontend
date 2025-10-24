import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "@/domain/auth/screens/loginScreen";
import RecoverScreen from "@/domain/auth/screens/recoverScreen";
import RegisterScreen from "@/domain/users/screens/registerScreen";
import HomeScreen from "@/domain/home/screen/homeScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Recover" component={RecoverScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
