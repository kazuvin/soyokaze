# Design System Documentation

This document describes the design system implementation for the Soyokaze application.

## Overview

The design system provides a comprehensive set of design tokens, components, and utilities to ensure consistency across the application. It includes support for light and dark themes, responsive design, and accessibility.

## Design Tokens

### Color Palette

The color system is based on a comprehensive palette with semantic meanings:

- **Primary**: Main brand colors (blue scale)
- **Secondary**: Neutral colors for backgrounds and borders
- **Accent**: Purple scale for highlights and special elements
- **Semantic**: Success (green), Warning (yellow), Error (red)
- **Neutral**: Grayscale for text and backgrounds

### Typography

Typography scale includes:

- **Headings**: h1 (48px) to h6 (18px)
- **Body Text**: bodyLarge (18px), body (16px), bodySmall (14px)
- **Labels**: label (14px), caption (12px)
- **Special**: button text, link text, code text

### Spacing

Consistent spacing scale from 0 to 96 (in 4px increments):
- Base unit: 4px
- Common values: 4, 8, 12, 16, 20, 24, 32, 48px

### Other Tokens

- **Border Radius**: sm (2px) to 3xl (24px)
- **Shadows**: Elevation system with 6 levels
- **Opacity**: Standard opacity values
- **Z-Index**: Layering system

## Theme System

### Light Theme
- Background: Light neutral colors
- Text: Dark colors for contrast
- Brand: Primary blue colors

### Dark Theme
- Background: Dark neutral colors  
- Text: Light colors for contrast
- Brand: Lighter blue for accessibility

### Usage

```typescript
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { theme, colorScheme } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.background.primary }}>
      <Text style={{ color: theme.text.primary }}>Hello</Text>
    </View>
  );
}
```

## Components

### ThemedText

Enhanced text component with design system integration:

```typescript
<ThemedText type="h1">Main Heading</ThemedText>
<ThemedText type="body">Regular text</ThemedText>
<ThemedText type="caption">Small text</ThemedText>
```

Available types: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `body`, `bodyLarge`, `bodySmall`, `label`, `caption`, `link`, `code`

### ThemedView

Background-aware container component (unchanged from original implementation).

### Button

Consistent button component with variants:

```typescript
<Button title="Primary Action" variant="primary" size="large" />
<Button title="Secondary" variant="secondary" />
<Button title="Outline" variant="outline" size="small" />
```

Variants: `primary`, `secondary`, `outline`, `ghost`
Sizes: `small`, `medium`, `large`

### Card

Container component with elevation and styling:

```typescript
<Card variant="elevated" padding="large">
  <ThemedText type="h3">Card Title</ThemedText>
  <ThemedText type="body">Card content</ThemedText>
</Card>
```

Variants: `elevated`, `flat`, `outlined`
Padding: `none`, `small`, `medium`, `large`

### Spacing

Utility component for consistent spacing:

```typescript
<Spacing size={4} /> // 16px vertical space
<Spacing size={2} horizontal /> // 8px horizontal space
```

## Utility Styles

Pre-built style utilities available in `constants/Styles.ts`:

### Typography Styles
- `TypographyStyles.h1` to `TypographyStyles.h6`
- `TypographyStyles.body`, `TypographyStyles.bodyLarge`, etc.

### Layout Styles
- `LayoutStyles.flexRow`, `LayoutStyles.flexCenter`
- `LayoutStyles.container`, `LayoutStyles.screen`

### Component Styles
- `ComponentStyles.buttonBase`, `ComponentStyles.inputBase`
- `ComponentStyles.card`, `ComponentStyles.listItem`

## Migration Guide

### From Legacy Colors

Old:
```typescript
import { Colors } from '@/constants/Colors';
const textColor = Colors.light.text;
```

New:
```typescript
import { useTheme } from '@/hooks/useTheme';
const { theme } = useTheme();
const textColor = theme.text.primary;
```

### Typography Migration

Old:
```typescript
<ThemedText type="title">Title</ThemedText>
```

New:
```typescript
<ThemedText type="h2">Title</ThemedText>
```

## File Structure

```
constants/
├── DesignTokens.ts    # Core design tokens
├── Theme.ts           # Light/dark theme definitions
├── Styles.ts          # Utility styles
├── Colors.ts          # Legacy compatibility
└── index.ts           # Exports

components/ui/
├── Button.tsx         # Button component
├── Card.tsx           # Card component
├── Spacing.tsx        # Spacing utility
└── index.ts           # Exports

hooks/
└── useTheme.ts        # Theme hook
```

## Best Practices

1. **Use Design Tokens**: Always use tokens instead of hardcoded values
2. **Theme Awareness**: Use `useTheme` hook for theme-aware components
3. **Semantic Colors**: Use semantic color names (text.primary vs specific hex values)
4. **Consistent Spacing**: Use the spacing scale for all margins/padding
5. **Typography Hierarchy**: Use appropriate heading levels for content structure
6. **Component Composition**: Build complex UIs by composing simple components

## Backward Compatibility

The legacy `Colors` export is maintained for existing components. New components should use the theme system directly for better type safety and flexibility.