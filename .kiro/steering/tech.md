# Technology Stack

## Architecture

**Monorepo Structure**: npm workspaces-based monorepo with three main packages:
- `packages/mobile/` - React Native mobile application with Expo
- `packages/schemas/` - OpenAPI specifications and client code generation
- `packages/api/` - Backend API service

**Development Model**: Schema-driven development with API-first design patterns, enabling parallel development and type-safe integration across all layers.

## Frontend Stack

- **Framework**: React Native with Expo SDK ~53.0.12
- **Navigation**: Expo Router ~5.1.0 (file-based routing system)
- **Styling**: Custom design system with theme support (light/dark modes)
- **State Management**: React hooks and context patterns
- **Type Validation**: Zod for runtime type checking and schema validation
- **Build Tool**: Metro bundler with TypeScript support

## Backend Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Hono framework for API development
- **Database**: SQLite with Expo SQLite for mobile, Drizzle ORM for server-side data access
- **API Documentation**: OpenAPI specification with automatic client generation
- **Deployment**: Cloudflare Workers (based on dependencies)

## Development Environment

**Required Tools**:
- Node.js (LTS version)
- npm (comes with Node.js)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (macOS) / Android Studio (for emulators)
- TypeScript compiler

**IDE Setup**:
- VSCode recommended with Expo and TypeScript extensions
- ESLint and Prettier configuration included

## Common Commands

### Mobile Development
```bash
npm run mobile:start          # Start development server
npm run mobile:ios            # Run on iOS simulator
npm run mobile:android        # Run on Android emulator
npm run mobile:web            # Run web version
npm run mobile:lint           # Run ESLint
npm run mobile:test           # Run tests
npm run mobile:test:watch     # Run tests in watch mode
npm run mobile:test:ui        # Run tests with UI
npm run mobile:reset-project  # Reset to blank state
```

### Schema Development
```bash
npm run schemas:dev           # Start schema development server
npm run schemas:generate      # Generate client code from OpenAPI specs
npm run schemas:test          # Test schema validation
npm run schemas:test:client   # Test generated client code
```

### API Development
```bash
npm run api:dev              # Start API development server
npm run api:deploy           # Deploy to production
npm run api:generate         # Generate API artifacts
npm run api:local:migration  # Run local database migrations
npm run api:remote:migration # Run remote database migrations
```

### Monorepo Management
```bash
npm install                  # Install all dependencies
npm run lint                 # Run linting (mobile alias)
npm run test                 # Run tests (mobile alias)
```

## Environment Variables

Development environment variables are managed per package:
- Mobile: `.env` files for Expo configuration
- API: Environment variables for database connections and service configuration
- Schemas: Build-time variables for code generation

## Port Configuration

**Default Development Ports**:
- Expo Dev Server: 8081 (Metro bundler)
- API Development: 8787 (Hono server)
- Schema Development Server: Varies by configuration

**Platform-specific**:
- iOS Simulator: Dynamic port assignment by Expo
- Android Emulator: Port forwarding via ADB
- Web Development: 8081 (same as Metro bundler)