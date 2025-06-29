import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useOnboarding } from "@/hooks/use-onboarding";
import { OnboardingWalkthrough } from "@/components/onboarding-walkthrough";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isOnboardingCompleted, isLoading, completeOnboarding } = useOnboarding();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded || isLoading) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      
      {!isOnboardingCompleted && (
        <OnboardingWalkthrough onComplete={completeOnboarding} />
      )}
    </ThemeProvider>
  );
}
