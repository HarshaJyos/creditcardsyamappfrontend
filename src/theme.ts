import { DefaultTheme } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  colors: {
    primary: "#FFFFFF",
    accent: "#00FF00", // Green for success/buttons
    background: "#000000",
    surface: "#1C1C1C", // Dark gray for cards
    error: "#FF0000", // Red for errors
    warning: "#FFFF00", // Yellow for warnings/offers
    text: "#FFFFFF",
    placeholder: "#AAAAAA",
  },
};

export default theme;
