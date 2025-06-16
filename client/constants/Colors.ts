/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#8B4513"; // Brown color for book theme
const tintColorDark = "#D2B48C"; // Tan color for dark mode

export const Colors = {
  light: {
    text: "#2C1810", // Dark brown text
    background: "#F5F5DC", // Beige background
    tint: tintColorLight,
    icon: "#8B4513", // Brown icons
    tabIconDefault: "#A0522D", // Sienna color
    tabIconSelected: tintColorLight,
    card: "#FFFFFF", // White cards
    border: "#DEB887", // Burlywood border
    primary: "#8B4513", // Brown primary
    secondary: "#D2691E", // Chocolate secondary
    accent: "#CD853F", // Peru accent
  },
  dark: {
    text: "#F5DEB3", // Wheat text
    background: "#2C1810", // Dark brown background
    tint: tintColorDark,
    icon: "#D2B48C", // Tan icons
    tabIconDefault: "#CD853F", // Peru color
    tabIconSelected: tintColorDark,
    card: "#3C2314", // Darker brown cards
    border: "#8B4513", // Brown border
    primary: "#D2B48C", // Tan primary
    secondary: "#DEB887", // Burlywood secondary
    accent: "#CD853F", // Peru accent
  },
};
