import * as Linking from "expo-linking";

const linking = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Login: "login",
      Register: "register",
      Home: "home",
      Recover: "recover",
    },
  },
};

export default linking;
