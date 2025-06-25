# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a cross-platform mobile application built with Expo and React Native, using TypeScript for type safety. The app uses Expo Router for navigation with a tab-based structure and supports both iOS and Android platforms, with web support via Metro bundler.

## Development Commands

### Basic Commands

- `npm install` - Install dependencies
- `npx expo start` - Start the development server
- `npm run android` - Start on Android emulator
- `npm run ios` - Start on iOS simulator
- `npm run web` - Start web version
- `npm run lint` - Run ESLint

### Project Management

- `npm run reset-project` - Move starter code to app-example and create blank app directory

### EAS (Expo Application Services) Commands

- `npm run build:development` - Create development build with EAS
- `npm run build:preview` - Create preview build with EAS
- `npm run build:production` - Create production build with EAS
- `npm run update:development` - Push OTA update to development channel
- `npm run update:preview` - Push OTA update to preview channel
- `npm run update:production` - Push OTA update to production channel

## Architecture

### File-Based Routing

The app uses Expo Router with file-based routing:

- `/app/_layout.tsx` - Root layout with theme provider and navigation stack
- `/app/(tabs)/_layout.tsx` - Tab navigation layout
- `/app/(tabs)/index.tsx` - Home tab screen
- `/app/(tabs)/explore.tsx` - Explore tab screen
- `/app/+not-found.tsx` - 404 error screen

### Component Structure

- `/components/` - Reusable UI components with themed variants
- `/components/ui/` - Platform-specific UI components (iOS/Android variants)
- `/constants/colors.ts` - Light/dark theme color definitions
- `/hooks/` - Custom React hooks for color scheme and theming
- `/assets/` - Static assets (fonts, images, icons)

### Development Patterns

#### Component Definitions and File Naming

- Use `function` declarations instead of arrow functions
- Use `type` for type definitions, avoid `interface`
- Components should follow the pattern established in existing files
- **File Naming Convention**: Use kebab-case for all file names consistently
  - UI components: `button.tsx`, `input.tsx`, `app-bar.tsx`
  - Feature components: `login-form.tsx`, `signup-form.tsx`
  - Hooks: `use-login.ts`, `use-signup.ts`
  - Utilities: `is-login-user.ts`, `validate-password.ts`
  - Constants: `design-tokens.ts`
- Each directory should have an `index.ts` file for unified exports
- Test files: `component-name.test.tsx`
- Storybook files: `component-name.stories.tsx`
- API schemas: `schemas.ts` in service directories

#### Theming System

- Uses `@react-navigation/native` theme provider
- Custom themed components (`ThemedView`, `ThemedText`) that adapt to light/dark mode
- Color scheme detection via `useColorScheme` hook
- Platform-specific styling with `Platform.select()`

#### Design System Integration

- **ALWAYS use design system tokens**: Import spacing, border radius, shadows, and other design tokens from `@/constants/design-tokens`
- **Avoid hard-coded values**: Use `Spacing[4]`, `BorderRadius.lg`, `Shadow.base` instead of numeric values
- **Consistent styling**: Use design tokens for all UI components to maintain consistency across the app
- Example: `paddingHorizontal: Spacing[6]` instead of `paddingHorizontal: 24`

#### Path Aliases

- `@/*` maps to the project root for cleaner imports

## Key Dependencies

### Core Framework

- Expo SDK ~53.0 with new architecture enabled
- React Native 0.79.4 with React 19.0.0
- Expo Router ~5.1 for navigation

### UI/UX Libraries

- `@react-navigation/bottom-tabs` for tab navigation
- `expo-blur` for iOS blur effects
- `expo-haptics` for tactile feedback
- `expo-symbols` for system icons
- `react-native-reanimated` for animations

### Development Tools

- TypeScript with strict mode enabled
- ESLint with Expo configuration
- Metro bundler for web builds

## Platform Considerations

### iOS Specific

- Tab bar uses transparent background with blur effect
- Supports tablets via `supportsTablet: true`
- Uses SF Symbols via `expo-symbols`

### Android Specific

- Adaptive icon configuration
- Edge-to-edge display enabled
- Custom tab bar styling without blur effects

### Web Support

- Static output generation
- Metro bundler configuration
- Favicon and manifest setup

## Configuration Files

- `app.json` - Expo configuration with platform-specific settings and EAS updates
- `eas.json` - EAS build and update profiles configuration
- `tsconfig.json` - TypeScript configuration with path aliases
- `eslint.config.js` - ESLint configuration using Expo presets
- `package.json` - Dependencies and scripts

## GitHub Workflow

### Working with Issues and Pull Requests

1. **Issue対応の開始**: 最新のmainブランチから新しい作業ブランチを作成
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/feature-name
   ```
2. **Implement Changes**: Follow the component patterns and architecture guidelines
3. **Test Implementation**: Run `npm run lint` and test the app
4. **Commit Changes**: Use descriptive commit messages following repository style
5. **Push and Create PR**: `git push origin feature-name` then create PR via GitHub CLI
   - **PR言語**: Pull Requestのタイトルと説明は日本語で記述する
   - **PR Template**: 変更内容、テスト計画、影響範囲を明確に記述する
6. **Automated Testing**: GitHub Actions will automatically:
   - Run linting and tests
   - Create Expo Go preview for mobile testing (if EAS is configured)
   - Post preview QR code in PR comments

#### Pull Request Guidelines

- **タイトル**: 変更内容を簡潔に日本語で記述
- **説明**: 以下の項目を含める
  - 変更の概要と目的
  - 実装した機能や修正した問題
  - テスト方法と確認事項
  - 影響範囲やブレイクングチェンジの有無
- **ベースブランチ**: 常にmainブランチを基準とする

### Expo Go Preview System

The repository includes automated Expo Go previews for pull requests:

- **Automatic**: Every PR triggers an EAS update via GitHub Actions
- **Testing**: Scan QR code in PR comments with Expo Go app
- **Setup**: Requires `EXPO_TOKEN` secret and initial EAS project setup
- **Documentation**: See `EXPO_SETUP.md` for detailed configuration steps

### Branch Strategy

- `main` - Production-ready code
- `feature/*` - New features and enhancements
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

