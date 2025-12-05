import * as Linking from "expo-linking";

const linking = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Login: "login",
      Register: "register",
      Home: "home",
      Recover: "recover",
      Profile: "profile",
      EditProfile: "edit-profile",
      ClassDetail: "class-detail/:classId",
    },
  },
};

export default linking;
