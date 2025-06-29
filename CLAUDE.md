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

**Note**: These EAS commands are documented but not yet implemented in package.json. Add them when setting up EAS:

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
- `/app/(tabs)/design-system.tsx` - Design system showcase tab
- `/app/+not-found.tsx` - 404 error screen

### Component Structure

- `/components/` - Reusable UI components with themed variants
  - `/components/ui/` - Design system UI components (Button, Card, TextArea, etc.)
  - `/components/layouts/` - Layout components (Header, etc.)
- `/constants/` - Design tokens, themes, and configuration
  - `design-tokens.ts` - Core design system tokens
  - `theme.ts` - Light/dark theme configurations
  - `colors.ts` - Legacy color definitions
  - `styles.ts` - Common style utilities
- `/hooks/` - Custom React hooks
  - `use-theme.ts` - Theme and color scheme management
  - `use-color-scheme.ts` - Cross-platform color scheme detection
- `/assets/` - Static assets (fonts, images, icons)
- `/features/` - Feature-based code organization
  - `/features/onboarding/` - User onboarding flow components and hooks
  - `/features/journal/` - Journal and calendar related components

### Data Layer Structure

- `/database/` - SQLite database initialization, schema definitions, and common query functions
- `/models/` - Zod schema definitions for data validation and type generation
- `/services/` - Service layer for database operations (CRUD functions)

### Feature Organization

The app follows a feature-based architecture pattern:

- **Onboarding Feature** (`/features/onboarding/`)
  - Components: `OnboardingWalkthrough` with step-by-step user introduction
  - Hooks: `useOnboarding` for onboarding state management
  - Integration: Automatically triggered for new users on app launch

- **Journal Feature** (`/features/journal/`)
  - Components: `Calendar` component for date selection and journal entry visualization
  - Functionality: Monthly calendar view, date selection, journal entry markers
  - Integration: Calendar component available for use across the app

### Development Patterns

#### Component Definitions and File Naming

- Use `function` declarations instead of arrow functions
- Use `type` for type definitions, avoid `interface`
- Components should follow the pattern established in existing files
- **File Naming Convention**: Use kebab-case for all file names consistently
  - UI components: `button.tsx`, `input.tsx`, `textarea.tsx`, `calendar.tsx`
  - Feature components: `login-form.tsx`, `signup-form.tsx`, `onboarding-walkthrough.tsx`
  - Hooks: `use-login.ts`, `use-signup.ts`, `use-onboarding.ts`
  - Utilities: `is-login-user.ts`, `validate-password.ts`
  - Constants: `design-tokens.ts`
- Each directory should have an `index.ts` file for unified exports
- Test files: `component-name.test.tsx`
- Storybook files: `component-name.stories.tsx`
- API schemas: `schemas.ts` in service directories

#### Feature Development Guidelines

- **Feature Structure**: Organize features under `/features/` directory with clear separation of concerns
- **Component Exports**: Each feature should export components through `index.ts` files for clean imports
- **Reusability**: Design components to be reusable across different parts of the application
- **Feature Integration**: Features should be easily integrable into existing app screens and flows
- **State Management**: Use React hooks for local state management within features

#### Theming System

- **Theme Provider**: Uses custom theme system built on `useColorScheme` hook
- **Design Tokens**: Comprehensive token system in `/constants/design-tokens.ts`
- **Theme Hook**: `useTheme()` provides current theme object and color scheme
- **Themed Components**: `ThemedView`, `ThemedText` adapt to light/dark mode
- **Platform Support**: Cross-platform color scheme detection with web fallbacks

#### Design System Integration

- **ALWAYS use design system tokens**: Import spacing, border radius, shadows, and other design tokens from `@/constants/design-tokens`
- **Avoid hard-coded values**: Use `Spacing[4]`, `BorderRadius.lg`, `Shadow.base` instead of numeric values
- **Consistent styling**: Use design tokens for all UI components to maintain consistency across the app
- Example: `paddingHorizontal: Spacing[6]` instead of `paddingHorizontal: 24`

#### Path Aliases

- `@/*` maps to the project root for cleaner imports

#### Database Development Guidelines

- **Schema-First Design**: Always define Zod schemas in `/models/` before implementing services
- **Type Safety**: Use Zod schema inference for TypeScript types - avoid creating separate type files
- **Function-Based Services**: Use exported functions instead of classes for service implementations
- **Common Query Functions**: Use shared `executeQuery` and `fetchQuery` functions from `/database/query.ts`
- **Error Handling**: Define error types in common query module for consistency
- **Sync-Ready Architecture**: Include `synced` and `last_modified` fields for future online synchronization
- **Database Initialization**: Always use the centralized database initialization from `/database/index.ts`

## Key Dependencies

### Core Framework

- Expo SDK ~53.0.12 with new architecture enabled
- React Native 0.79.4 with React 19.0.0
- Expo Router ~5.1.0 for navigation

### UI/UX Libraries

- `@react-navigation/bottom-tabs` (~7.3.10) for tab navigation
- `expo-blur` (~14.1.5) for iOS blur effects
- `expo-haptics` (~14.1.4) for tactile feedback
- `expo-symbols` (~0.4.5) for SF Symbols
- `expo-vector-icons` (^14.1.0) for icon library
- `react-native-reanimated` (~3.17.4) for animations
- `react-native-gesture-handler` (~2.24.0) for gestures

### Development Tools

- TypeScript with strict mode enabled
- ESLint with Expo configuration
- Metro bundler for web builds

### Data Management

- `expo-sqlite` (~15.2.12) for local SQLite database management
- `zod` (^3.25.67) for schema validation and type safety
- Local data storage with sync-ready architecture for future online capabilities

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

- `app.json` - Expo configuration with platform-specific settings
- `eas.json` - EAS build and update profiles configuration (when EAS is set up)
- `tsconfig.json` - TypeScript configuration with path aliases
- `eslint.config.js` - ESLint configuration using Expo presets
- `package.json` - Dependencies and scripts
- `expo-env.d.ts` - Expo TypeScript environment declarations

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
- `docs/*` - Documentation updates

### Current Features

#### Implemented Components

- **UI Components**: Button, Card, Dialog, TextInput, TextArea, List, Tabs, Spacing utilities
- **Layout Components**: Header, themed view/text components
- **Icon System**: SF Symbols integration for iOS, cross-platform icon support

#### Features

- **Onboarding System**: Complete user onboarding flow with step-by-step walkthrough
- **Journal Calendar**: Interactive calendar component with date selection and journal entry markers
- **Design System**: Comprehensive design token system with light/dark theme support
- **Database Layer**: SQLite integration with Zod schema validation for type-safe data operations

