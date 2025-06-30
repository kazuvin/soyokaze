/**
 * Common Styles
 * 
 * This file contains reusable style utilities and common style patterns
 * using the design system tokens.
 */

import { StyleSheet } from 'react-native';
import { Typography, Spacing, BorderRadius, Shadow } from './design-tokens';

// Typography Styles
export const TypographyStyles = StyleSheet.create({
  // Headings
  h1: {
    fontSize: Typography.fontSize['5xl'],
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.fontSize['5xl'] * Typography.lineHeight.tight,
    letterSpacing: Typography.letterSpacing.tight,
  },
  h2: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.fontSize['4xl'] * Typography.lineHeight.tight,
    letterSpacing: Typography.letterSpacing.tight,
  },
  h3: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.fontSize['3xl'] * Typography.lineHeight.snug,
  },
  h4: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.fontSize['2xl'] * Typography.lineHeight.snug,
  },
  h5: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.fontSize.xl * Typography.lineHeight.snug,
  },
  h6: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.fontSize.lg * Typography.lineHeight.normal,
  },
  
  // Body Text
  bodyLarge: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.normal,
    lineHeight: Typography.fontSize.lg * Typography.lineHeight.relaxed,
  },
  body: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.normal,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
  },
  bodySmall: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.normal,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
  },
  
  // Labels and Captions
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
  },
  caption: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.normal,
    lineHeight: Typography.fontSize.xs * Typography.lineHeight.normal,
  },
  
  // Button Text
  buttonLarge: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.fontSize.lg * Typography.lineHeight.none,
    textAlign: 'center' as const,
  },
  button: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.none,
    textAlign: 'center' as const,
  },
  buttonSmall: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.none,
    textAlign: 'center' as const,
  },
  buttonXs: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.fontSize.xs * Typography.lineHeight.none,
    textAlign: 'center' as const,
  },
  
  // Link Text
  link: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.normal,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
    textDecorationLine: 'underline' as const,
  },
  
  // Monospace
  code: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
  },
});

// Layout Styles
export const LayoutStyles = StyleSheet.create({
  // Flex Layouts
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexStart: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  flexEnd: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  
  // Common Containers
  container: {
    paddingHorizontal: Spacing[4],
  },
  containerLarge: {
    paddingHorizontal: Spacing[6],
  },
  section: {
    paddingVertical: Spacing[6],
    paddingHorizontal: Spacing[4],
  },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    ...Shadow.base,
  },
  
  // Screen Layouts
  screen: {
    flex: 1,
    paddingHorizontal: Spacing[4],
  },
  screenCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
  },
  
  // Spacing Utilities
  marginTop: {
    marginTop: Spacing[4],
  },
  marginBottom: {
    marginBottom: Spacing[4],
  },
  marginVertical: {
    marginVertical: Spacing[4],
  },
  marginHorizontal: {
    marginHorizontal: Spacing[4],
  },
  
  paddingTop: {
    paddingTop: Spacing[4],
  },
  paddingBottom: {
    paddingBottom: Spacing[4],
  },
  paddingVertical: {
    paddingVertical: Spacing[4],
  },
  paddingHorizontal: {
    paddingHorizontal: Spacing[4],
  },
});

// Component Styles
export const ComponentStyles = StyleSheet.create({
  // Button Styles
  buttonBase: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, // Touch target size
  },
  buttonLarge: {
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[6],
    minHeight: 52,
  },
  buttonSmall: {
    borderRadius: BorderRadius.base,
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    minHeight: 36,
  },
  buttonXs: {
    borderRadius: BorderRadius.base,
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Input Styles
  inputBase: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    fontSize: Typography.fontSize.base,
    minHeight: 44,
  },
  
  // Card Styles
  cardElevated: {
    borderRadius: BorderRadius.xl,
    padding: Spacing[6],
    ...Shadow.lg,
  },
  cardFlat: {
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    borderWidth: 1,
  },
  
  // List Item Styles
  listItem: {
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Divider
  divider: {
    height: 1,
    marginVertical: Spacing[2],
  },
  
  // Avatar
  avatar: {
    borderRadius: BorderRadius.full,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLarge: {
    borderRadius: BorderRadius.full,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Badge
  badge: {
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing[1],
    paddingHorizontal: Spacing[2],
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Animation Styles
export const AnimationStyles = {
  // Durations (in milliseconds)
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
  
  // Easing
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  } as const,
} as const;