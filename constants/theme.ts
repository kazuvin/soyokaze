/**
 * Theme Configuration
 *
 * This file defines the light and dark theme configurations using design tokens.
 */

import { ColorPalette } from "./design-tokens";

export type ThemeMode = "light" | "dark";

// Light Theme
export const LightTheme = {
  // Background Colors
  background: {
    primary: ColorPalette.neutral[50],
    secondary: ColorPalette.neutral[100],
    tertiary: ColorPalette.neutral[200],
    elevated: "#ffffff",
    overlay: "rgba(0, 0, 0, 0.5)",
  },

  // Text Colors
  text: {
    primary: ColorPalette.neutral[900],
    secondary: ColorPalette.neutral[700],
    tertiary: ColorPalette.neutral[500],
    disabled: ColorPalette.neutral[400],
    inverse: "#ffffff",
    link: ColorPalette.primary[600],
    success: ColorPalette.success[600],
    warning: ColorPalette.warning[600],
    error: ColorPalette.error[600],
  },

  // Border Colors
  border: {
    primary: ColorPalette.neutral[200],
    secondary: ColorPalette.neutral[300],
    focus: ColorPalette.primary[500],
    error: ColorPalette.error[500],
    success: ColorPalette.success[500],
    warning: ColorPalette.warning[500],
  },

  // Brand Colors
  brand: {
    primary: ColorPalette.primary[600],
    secondary: ColorPalette.secondary[600],
    accent: ColorPalette.accent[600],
  },

  // Icon Colors
  icon: {
    primary: ColorPalette.neutral[700],
    secondary: ColorPalette.neutral[500],
    tertiary: ColorPalette.neutral[400],
    inverse: "#ffffff",
    brand: ColorPalette.primary[600],
  },

  // Tab Colors
  tab: {
    background: "transparent",
    backgroundActive: ColorPalette.neutral[100],
    iconDefault: ColorPalette.neutral[500],
    iconSelected: ColorPalette.primary[600],
    tint: ColorPalette.primary[600],
  },
} as const;

// Dark Theme
export const DarkTheme = {
  // Background Colors
  background: {
    primary: ColorPalette.neutral[950],
    secondary: ColorPalette.neutral[900],
    tertiary: ColorPalette.neutral[800],
    elevated: ColorPalette.neutral[800],
    overlay: "rgba(0, 0, 0, 0.7)",
  },

  // Text Colors
  text: {
    primary: ColorPalette.neutral[50],
    secondary: ColorPalette.neutral[200],
    tertiary: ColorPalette.neutral[400],
    disabled: ColorPalette.neutral[600],
    inverse: ColorPalette.neutral[900],
    link: ColorPalette.primary[400],
    success: ColorPalette.success[400],
    warning: ColorPalette.warning[400],
    error: ColorPalette.error[400],
  },

  // Border Colors
  border: {
    primary: ColorPalette.neutral[800],
    secondary: ColorPalette.neutral[700],
    focus: ColorPalette.primary[400],
    error: ColorPalette.error[400],
    success: ColorPalette.success[400],
    warning: ColorPalette.warning[400],
  },

  // Brand Colors
  brand: {
    primary: ColorPalette.primary[400],
    secondary: ColorPalette.secondary[400],
    accent: ColorPalette.accent[400],
  },

  // Icon Colors
  icon: {
    primary: ColorPalette.neutral[200],
    secondary: ColorPalette.neutral[400],
    tertiary: ColorPalette.neutral[600],
    inverse: ColorPalette.neutral[900],
    brand: ColorPalette.primary[400],
  },

  // Tab Colors
  tab: {
    background: "transparent",
    backgroundActive: ColorPalette.neutral[800],
    iconDefault: ColorPalette.neutral[400],
    iconSelected: "#ffffff",
    tint: "#ffffff",
  },
} as const;

// Theme type
export type Theme = typeof LightTheme;

// Theme selector
export function getTheme(mode: ThemeMode): Theme {
  return mode === "light" ? LightTheme : DarkTheme;
}

