/**
 * Legacy Colors Configuration
 * 
 * This file maintains backward compatibility while utilizing the new design system.
 * For new components, use theme.ts and design-tokens.ts directly.
 */

import { LightTheme, DarkTheme } from './theme';

// Legacy color mappings for backward compatibility
export const Colors = {
  light: {
    text: LightTheme.text.primary,
    background: LightTheme.background.primary,
    tint: LightTheme.brand.primary,
    icon: LightTheme.icon.primary,
    tabIconDefault: LightTheme.tab.iconDefault,
    tabIconSelected: LightTheme.tab.iconSelected,
  },
  dark: {
    text: DarkTheme.text.primary,
    background: DarkTheme.background.primary,
    tint: DarkTheme.brand.primary,
    icon: DarkTheme.icon.primary,
    tabIconDefault: DarkTheme.tab.iconDefault,
    tabIconSelected: DarkTheme.tab.iconSelected,
  },
};

// Re-export themes for direct access
export { LightTheme, DarkTheme } from './theme';
