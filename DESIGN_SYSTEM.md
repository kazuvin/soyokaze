# Design System Documentation

This document describes the design system implementation for the Soyokaze application.

## Overview

The design system provides a comprehensive set of design tokens, UI components, and utilities to ensure consistency across the application. Built with React Native and Expo, it includes full support for light and dark themes, cross-platform compatibility (iOS, Android, Web), and strong TypeScript integration.

### Key Features

- **Comprehensive Design Tokens**: Color palettes, typography, spacing, shadows, and more
- **Production-Ready Components**: Button, Card, TextInput, Dialog, List, Tabs, and utilities
- **Theme System**: Automatic light/dark mode with semantic color mapping
- **Cross-Platform**: Consistent behavior across iOS, Android, and Web
- **Type Safety**: Full TypeScript support with design token types
- **Accessibility**: Proper touch targets, contrast ratios, and semantic markup

## Design Tokens

The design system uses a comprehensive token system defined in `/constants/design-tokens.ts`.

### Color Palette

The color system includes complete scales (50-950) for:

- **Primary**: Blue scale for brand colors and primary actions
- **Secondary**: Zinc/neutral scale for backgrounds and subtle elements
- **Accent**: Purple/magenta scale for highlights and special elements
- **Semantic Colors**:
  - **Success**: Green scale for positive states
  - **Warning**: Amber/yellow scale for caution states
  - **Error**: Red scale for error states
- **Neutral**: True neutral grayscale for text and backgrounds

### Typography

Typography tokens include:

- **Font Families**: System (primary), SpaceMono (monospace)
- **Font Sizes**: xs (12px) to 9xl (128px) - comprehensive scale
- **Font Weights**: thin (100) to black (900)
- **Line Heights**: none (1) to loose (2)
- **Letter Spacing**: tighter (-0.05) to widest (0.1)

### Spacing

Comprehensive spacing scale from 0 to 96:
- Base unit: 4px
- Scale: 0.5 (2px), 1 (4px), 1.5 (6px), 2 (8px), etc.
- Extended values up to 96 (384px)

### Other Tokens

- **Border Radius**: none (0) to full (9999px)
- **Shadows**: 6-level elevation system with React Native shadow properties
- **Opacity**: 0 to 100 in 5-10% increments
- **Z-Index**: Layering values from 0 to 50
- **Breakpoints**: Responsive design breakpoints xs to 2xl

## Theme System

The theme system is defined in `/constants/theme.ts` with semantic color mappings.

### Light Theme
- **Background**: Light neutral colors (50-200 range)
- **Text**: Dark colors for optimal contrast (neutral 900-500)
- **Borders**: Subtle neutral borders (200-300 range)
- **Brand**: Primary blue-600 for actions
- **Icons**: Neutral 700-400 range

### Dark Theme
- **Background**: Dark neutral colors (950-800 range)
- **Text**: Light colors for contrast (neutral 50-400)
- **Borders**: Dark neutral borders (800-700 range)
- **Brand**: Primary blue-400 for accessibility
- **Icons**: Neutral 200-600 range

### Theme Hook Usage

```typescript
import { useTheme } from '@/hooks/use-theme';

function MyComponent() {
  const { theme, colorScheme } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.background.primary }}>
      <Text style={{ color: theme.text.primary }}>Hello</Text>
    </View>
  );
}
```

### Semantic Color Categories

- **Background**: primary, secondary, tertiary, elevated, overlay
- **Text**: primary, secondary, tertiary, disabled, inverse, link, success, warning, error
- **Border**: primary, secondary, focus, error, success, warning
- **Brand**: primary, secondary, accent
- **Icon**: primary, secondary, tertiary, inverse, brand
- **Tab**: background, backgroundActive, iconDefault, iconSelected, tint
- **Shadow**: color, androidColor

## Components

### ThemedText

Enhanced text component with design system integration (unchanged):

```typescript
<ThemedText type="h1">Main Heading</ThemedText>
<ThemedText type="body">Regular text</ThemedText>
<ThemedText type="caption">Small text</ThemedText>
```

### ThemedView

Background-aware container component (unchanged from original implementation).

### Button

Fully implemented button component with comprehensive variant system:

```typescript
<Button title="Primary Action" variant="primary" size="large" />
<Button title="Secondary" variant="secondary" icon="star" />
<Button title="Outline" variant="outline" size="small" />
<Button icon="plus" variant="ghost" /> {/* Icon only */}
<Button title="Loading" loading />
```

**Variants**: `primary`, `secondary`, `outline`, `ghost`  
**Sizes**: `small`, `medium`, `large`  
**Features**: Icons (leading/icon-only), loading states, disabled states, full width

### Card

Container component with sub-components and elevation:

```typescript
<Card variant="elevated">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Text>Card content</Text>
  </CardContent>
</Card>
```

**Variants**: `elevated`, `flat`, `outlined`  
**Sub-components**: `CardHeader`, `CardTitle`, `CardContent`

### TextInput

Form input component with validation support:

```typescript
<TextInput
  label="Email"
  placeholder="Enter email"
  leadingIcon="mail"
  error="Invalid email"
  size="large"
/>
```

**Variants**: `base`, `borderless`  
**Sizes**: `small`, `medium`, `large`  
**Features**: Labels, icons, error states, validation

### Dialog

Modal dialog system with context management:

```typescript
<Dialog>
  <DialogTrigger>
    <Button title="Open Dialog" />
  </DialogTrigger>
  <DialogContent variant="slide">
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>Are you sure?</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose>
        <Button title="Cancel" variant="outline" />
      </DialogClose>
      <Button title="Confirm" variant="primary" />
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Variants**: `default`, `slide`  
**Features**: Context-based state, backdrop handling, accessibility

### List Components

Flexible list system for data display:

```typescript
<List variant="elevated">
  <ListLabel>Section Header</ListLabel>
  <ListItem onPress={() => {}}>
    <ListItemIcon name="person" />
    <ListItemText primary="John Doe" secondary="john@example.com" />
    <ListItemAction>
      <Button icon="chevron-right" variant="ghost" />
    </ListItemAction>
  </ListItem>
</List>
```

**Variants**: `default`, `elevated`, `outlined`  
**Sub-components**: `ListItem`, `ListItemText`, `ListItemIcon`, `ListItemAction`, `ListLabel`

### Tabs

Tabbed interface with horizontal scrolling:

```typescript
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    <Text>Content 1</Text>
  </TabsContent>
  <TabsContent value="tab2">
    <Text>Content 2</Text>
  </TabsContent>
</Tabs>
```

### IconSymbol

Cross-platform icon system:

```typescript
<IconSymbol name="star" size={24} color={theme.icon.primary} />
```

**Features**: SF Symbols on iOS, Material Icons fallback, consistent naming

### Spacing

Utility component for consistent spacing:

```typescript
<Spacing size={4} /> // 16px vertical space
<Spacing size={2} horizontal /> // 8px horizontal space
```

## Utility Styles

Pre-built style utilities available in `/constants/styles.ts`:

### Typography Styles
- **Heading Styles**: `TypographyStyles.h1` to `TypographyStyles.h6`
- **Body Text**: `TypographyStyles.body`, `TypographyStyles.bodyLarge`, `TypographyStyles.bodySmall`
- **UI Text**: `TypographyStyles.button`, `TypographyStyles.label`, `TypographyStyles.caption`
- **Special**: `TypographyStyles.link`, `TypographyStyles.code`

### Layout Styles
- **Flex Utilities**: `LayoutStyles.flexRow`, `LayoutStyles.flexColumn`, `LayoutStyles.flexCenter`
- **Flex Variants**: `LayoutStyles.flexBetween`, `LayoutStyles.flexStart`, `LayoutStyles.flexEnd`
- **Containers**: `LayoutStyles.container`, `LayoutStyles.section`, `LayoutStyles.screen`
- **Positioning**: `LayoutStyles.absolute`, `LayoutStyles.relative`

### Component Styles
- **Form Elements**: `ComponentStyles.buttonBase`, `ComponentStyles.inputBase`, `ComponentStyles.inputContainer`
- **Containers**: `ComponentStyles.card`, `ComponentStyles.listItem`, `ComponentStyles.section`
- **Interactive**: `ComponentStyles.touchable`, `ComponentStyles.pressable`

### Animation Styles
- **Transitions**: `AnimationStyles.fadeIn`, `AnimationStyles.slideIn`
- **Easing**: Pre-configured easing curves for smooth animations
- **Duration**: Standard animation durations (fast, normal, slow)

## Migration Guide

### From Legacy Colors

Old:
```typescript
import { Colors } from '@/constants/colors';
const textColor = Colors.light.text;
```

New:
```typescript
import { useTheme } from '@/hooks/use-theme';
const { theme } = useTheme();
const textColor = theme.text.primary;
```

### Design Token Usage

Old (hardcoded values):
```typescript
style={{
  padding: 16,
  borderRadius: 8,
  shadowOpacity: 0.1
}}
```

New (design tokens):
```typescript
import { Spacing, BorderRadius, Shadow } from '@/constants/design-tokens';

style={{
  padding: Spacing[4],
  borderRadius: BorderRadius.lg,
  ...Shadow.base
}}
```

### Component Pattern

Old (custom styling):
```typescript
<TouchableOpacity style={{ padding: 12, backgroundColor: '#007AFF' }}>
  <Text style={{ color: 'white', fontSize: 16 }}>Button</Text>
</TouchableOpacity>
```

New (design system component):
```typescript
<Button title="Button" variant="primary" size="medium" />
```

## File Structure

```
constants/
├── design-tokens.ts   # Core design tokens (colors, typography, spacing, etc.)
├── theme.ts           # Light/dark theme definitions
├── styles.ts          # Utility styles (typography, layout, component, animation)
├── colors.ts          # Legacy compatibility
└── index.ts           # Unified exports

components/ui/
├── button.tsx         # Button component with variants
├── card.tsx           # Card component with sub-components
├── text-input.tsx     # Form input component
├── dialog.tsx         # Modal dialog system
├── list.tsx           # List components
├── tabs.tsx           # Tabbed interface
├── spacing.tsx        # Spacing utility
├── icon-symbol.tsx    # Cross-platform icon system
└── index.ts           # Component exports

components/layouts/
├── header.tsx         # Header layout component
└── index.ts           # Layout exports

hooks/
├── use-theme.ts       # Theme and color scheme hook
├── use-color-scheme.ts # Cross-platform color scheme detection
└── use-theme-color.ts # Theme-aware color utility
```

## Best Practices

1. **Use Design Tokens**: Always import and use tokens from `@/constants/design-tokens`
   ```typescript
   import { Spacing, BorderRadius, Shadow } from '@/constants/design-tokens';
   ```

2. **Theme Awareness**: Use `useTheme()` hook for all theme-dependent styling
   ```typescript
   const { theme } = useTheme();
   ```

3. **Semantic Colors**: Use semantic color names for maintainability
   ```typescript
   color: theme.text.primary  // ✅ Good
   color: '#000000'          // ❌ Avoid
   ```

4. **Consistent Spacing**: Use the spacing scale for all dimensions
   ```typescript
   margin: Spacing[4]        // ✅ Good
   margin: 16               // ❌ Avoid
   ```

5. **Typography Hierarchy**: Use utility styles for consistent typography
   ```typescript
   import { TypographyStyles } from '@/constants/styles';
   style={TypographyStyles.h2}
   ```

6. **Component Composition**: Prefer design system components over custom styling
   ```typescript
   <Card variant="elevated">    // ✅ Good
     <CardHeader>
       <CardTitle>Title</CardTitle>
     </CardHeader>
   </Card>
   ```

7. **Icon Consistency**: Use `IconSymbol` for cross-platform icon support
   ```typescript
   <IconSymbol name="star" size={24} />
   ```

8. **Touch Targets**: Ensure minimum 44px touch targets for accessibility
   - All interactive components handle this automatically

## Type Safety

The design system provides full TypeScript support:

- **Design Token Types**: All token values are type-checked
- **Component Props**: Strict typing for variants, sizes, and props
- **Theme Types**: Semantic color and spacing types
- **Icon Names**: Constrained to available symbol names

## Backward Compatibility

Legacy imports are maintained for compatibility:
- `Colors` export from `/constants/colors.ts`
- Original `ThemedText` and `ThemedView` components
- Existing color scheme hooks

New components should use the updated design system for better type safety and consistency.