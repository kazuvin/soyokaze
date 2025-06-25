/**
 * Theme Hook
 *
 * Provides access to the current theme based on the color scheme.
 */

import { useColorScheme } from "./use-color-scheme";
import { getTheme, type Theme, type ThemeMode } from "@/constants/theme";

export function useTheme(): { theme: Theme; colorScheme: ThemeMode } {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme ?? "light");

  return {
    theme,
    colorScheme: colorScheme ?? "light",
  };
}

