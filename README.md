# Soyokaze

Cross-platform mobile application built with Expo and React Native, organized as a monorepo with TypeScript support.

## Project Overview

This is a monorepo containing:
- **Mobile Application** (`packages/mobile/`) - Cross-platform mobile app using Expo and React Native
- **API Schemas** (`packages/schemas/`) - OpenAPI specifications and client code generation

## Quick Start

1. Install dependencies for all packages

   ```bash
   npm install
   ```

2. Start the mobile development server

   ```bash
   npm run mobile:start
   ```

3. Run on specific platforms

   ```bash
   npm run mobile:ios      # iOS Simulator
   npm run mobile:android  # Android Emulator
   npm run mobile:web      # Web Browser
   ```

## Available Scripts

### Mobile Development

- `npm run mobile:start` - Start the development server
- `npm run mobile:ios` - Run on iOS simulator
- `npm run mobile:android` - Run on Android emulator
- `npm run mobile:web` - Run web version
- `npm run mobile:lint` - Run ESLint
- `npm run mobile:test` - Run tests
- `npm run mobile:test:watch` - Run tests in watch mode
- `npm run mobile:test:ui` - Run tests with UI
- `npm run mobile:reset-project` - Reset project to blank state

### Schema Development

- `npm run schemas:dev` - Start schema development server
- `npm run schemas:generate` - Generate client code from OpenAPI specs
- `npm run schemas:test` - Test schema validation
- `npm run schemas:test:client` - Test generated client code

### Monorepo Commands

- `npm run lint` - Run linting (alias for mobile:lint)
- `npm run test` - Run tests (alias for mobile:test)
- `npm install` - Install all dependencies

## Project Structure

```
soyokaze/
├── packages/
│   ├── mobile/          # Mobile application
│   │   ├── app/         # Expo Router file-based routing
│   │   ├── components/  # Reusable UI components
│   │   ├── features/    # Feature-based organization
│   │   ├── constants/   # Design tokens and themes
│   │   ├── database/    # SQLite database layer
│   │   ├── models/      # Zod schema definitions
│   │   ├── services/    # Data services
│   │   └── hooks/       # Custom React hooks
│   └── schemas/         # OpenAPI specifications
│       ├── components/  # Reusable OpenAPI components
│       ├── paths/       # API endpoint definitions
│       ├── generated/   # Auto-generated client code
│       └── scripts/     # Code generation scripts
├── CLAUDE.md           # Development guidelines
└── DESIGN_SYSTEM.md    # Design system documentation
```

## Features

- **Cross-platform**: iOS, Android, and Web support
- **Type-safe**: Full TypeScript integration with Zod validation
- **Design System**: Comprehensive design tokens and themed components
- **Database**: SQLite with sync-ready architecture
- **Navigation**: File-based routing with Expo Router
- **Testing**: Vitest setup with UI testing capabilities
- **API Integration**: OpenAPI schema-driven development

## Tech Stack

- **Frontend**: React Native, Expo SDK ~53.0.12
- **Navigation**: Expo Router ~5.1.0
- **Database**: SQLite with Expo SQLite
- **Validation**: Zod for runtime type checking
- **Styling**: Custom design system with light/dark themes
- **Testing**: Vitest with React Native testing support
- **Tooling**: TypeScript, ESLint, Metro bundler

## Development

The project follows feature-based architecture with strict TypeScript and follows monorepo best practices. See `CLAUDE.md` for detailed development guidelines and architectural decisions.

For API development, schemas are defined in OpenAPI format and client code is automatically generated. See `packages/schemas/README.md` for schema-specific documentation.

## Platform Support

- **iOS**: Native iOS features including SF Symbols and blur effects
- **Android**: Adaptive icons and edge-to-edge display
- **Web**: Static site generation with Metro bundler
