# Soyokaze

Cross-platform mobile application built with Expo and React Native, organized as a monorepo with TypeScript support.

## Project Overview

This is a monorepo containing:
- **Mobile Application** (`packages/mobile/`) - Cross-platform mobile app using Expo and React Native
- **API Service** (`packages/api/`) - Backend API service using Hono and Cloudflare Workers
- **API Schemas** (`packages/schemas/`) - TypeSpec definitions and schema generation

## Quick Start

1. Install dependencies for all packages

   ```bash
   pnpm install
   ```

2. Start the mobile development server

   ```bash
   pnpm --filter mobile start
   ```

3. Run on specific platforms

   ```bash
   pnpm --filter mobile ios      # iOS Simulator
   pnpm --filter mobile android  # Android Emulator
   pnpm --filter mobile web      # Web Browser
   ```

## Available Scripts

### Using pnpm --filter

This monorepo uses pnpm workspaces. Use the `--filter` option to run commands in specific packages:

```bash
# Mobile development
pnpm --filter mobile start          # Start the development server
pnpm --filter mobile ios            # Run on iOS simulator
pnpm --filter mobile android        # Run on Android emulator
pnpm --filter mobile web            # Run web version
pnpm --filter mobile lint           # Run ESLint
pnpm --filter mobile test           # Run tests
pnpm --filter mobile test:watch     # Run tests in watch mode
pnpm --filter mobile test:ui        # Run tests with UI
pnpm --filter mobile reset-project  # Reset project to blank state

# API development
pnpm --filter api dev                # Start API development server
pnpm --filter api deploy            # Deploy API
pnpm --filter api generate          # Generate database migrations
pnpm --filter api local:migration   # Apply local migrations
pnpm --filter api remote:migration  # Apply remote migrations

# Schema development (TypeSpec)
pnpm --filter schemas dev                    # Start schema development server
pnpm --filter schemas generate              # Generate client code
```

### Monorepo Commands

- `pnpm install` - Install all dependencies
- `pnpm --filter [package-name] [script]` - Run any script in a specific package

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
│   ├── api/             # Backend API service
│   │   ├── src/         # API source code
│   │   ├── migrations/  # Database migrations
│   │   └── scripts/     # Setup and deployment scripts
│   └── schemas/         # TypeSpec definitions
│       ├── src/         # TypeSpec source files
│       └── generated/   # Auto-generated code
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
- **API Integration**: TypeSpec schema-driven development

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

For API development, schemas are defined in TypeSpec format and client code is automatically generated. See `packages/schemas/README.md` for schema-specific documentation.

## Platform Support

- **iOS**: Native iOS features including SF Symbols and blur effects
- **Android**: Adaptive icons and edge-to-edge display
- **Web**: Static site generation with Metro bundler
