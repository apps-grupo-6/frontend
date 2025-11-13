import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import RootNavigator from "./rootNavigator";
import linking from "./linking";
import colors from "@/theme/colors";

const theme = {
  ...DefaultTheme,
  colors: { 
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.surface,
    text: colors.text,
    border: colors.surfaceAlt,
    primary: colors.primary, 
  },
};

export default function Navigation() {
  return (
    <NavigationContainer theme={theme} linking={linking}>
      <RootNavigator />
    </NavigationContainer>
  );
}
