# Project Structure

## Root Directory Organization

```
soyokaze/
├── .expo/                    # Expo configuration and cache
├── .kiro/                    # Kiro spec-driven development files
│   ├── specs/               # Feature specifications
│   └── steering/            # Project steering documents
├── docs/                     # Project documentation
├── packages/                 # Monorepo workspaces
│   ├── mobile/              # React Native mobile application
│   ├── schemas/             # OpenAPI specifications and client generation
│   └── api/                 # Backend API service
├── CLAUDE.md                # AI development guidelines
├── DESIGN_SYSTEM.md         # Design system documentation
├── README.md                # Project overview and setup
└── package.json             # Monorepo configuration and scripts
```

## Package Structures

### Mobile Package (`packages/mobile/`)

**Feature-based Architecture**:
```
mobile/
├── app/                     # Expo Router file-based routing
│   ├── (tabs)/             # Tab navigation layout group
│   │   ├── index.tsx       # Home screen
│   │   ├── design-system.tsx # Design system showcase
│   │   ├── explore.tsx     # Explore/discovery screen
│   │   └── _layout.tsx     # Tab layout configuration
│   ├── _layout.tsx         # Root layout
│   └── +not-found.tsx      # 404 error screen
├── components/              # Reusable UI components
├── features/                # Feature-based organization
│   ├── journal/            # Journal functionality
│   │   ├── components/     # Feature-specific components
│   │   └── index.ts        # Feature exports
│   └── ai-feedback/        # AI feedback features
├── constants/               # Design tokens and configuration
│   ├── colors.ts           # Color palette
│   ├── design-tokens.ts    # Design system tokens
│   ├── styles.ts           # Global styles
│   ├── theme.ts            # Theme configuration
│   └── index.ts            # Unified constants export
├── database/                # SQLite database layer
│   ├── schema.ts           # Database schema definitions
│   ├── query.ts            # Query utilities and helpers
│   └── index.ts            # Database exports
├── models/                  # Zod schema definitions
├── services/                # Data services and API clients
├── hooks/                   # Custom React hooks
└── package.json             # Mobile package configuration
```

### Schemas Package (`packages/schemas/`)

**Schema-driven Development**:
```
schemas/
├── src/
│   ├── db/                 # Database schema definitions
│   │   ├── schema.ts       # Database table schemas
│   │   ├── types.ts        # Generated database types
│   │   └── index.ts        # Database exports
│   └── api/                # API schema definitions
│       ├── errors.ts       # Error response schemas
│       ├── types.ts        # API type definitions
│       ├── validators.ts   # Request/response validators
│       └── index.ts        # API exports
├── components/              # Reusable OpenAPI components
├── paths/                   # API endpoint definitions
├── generated/               # Auto-generated client code
│   ├── openapi/            # OpenAPI specification files
│   ├── json-schema/        # JSON schema definitions
│   └── zod/                # Zod validation schemas
├── scripts/                 # Code generation scripts
└── package.json             # Schema package configuration
```

### API Package (`packages/api/`)

**Backend Service Structure**:
```api/
├── src/                     # Source code
├── migrations/              # Database migrations
├── wrangler.toml           # Cloudflare Workers configuration
└── package.json            # API package configuration
```

## Code Organization Patterns

### Feature-based Architecture
- **Mobile Features**: Each feature contains its own components, hooks, and logic
- **Domain Separation**: Clear boundaries between journal, ai-feedback, and other features
- **Shared Resources**: Common components, constants, and utilities are globally accessible

### File-based Routing (Expo Router)
- **Route Groups**: `(tabs)/` creates tab-based navigation without affecting URL structure
- **Layout Files**: `_layout.tsx` files define nested layout hierarchies
- **Dynamic Routes**: `[id].tsx` pattern for parameterized routes
- **Error Handling**: `+not-found.tsx` for 404 error pages

### Schema-driven Development
- **API First**: OpenAPI specifications drive both client and server development
- **Type Generation**: Automatic TypeScript type generation from schemas
- **Validation**: Zod schemas provide runtime type checking and validation

## File Naming Conventions

### General Conventions
- **Components**: PascalCase for React components (`UserProfile.tsx`)
- **Utilities**: camelCase for utility functions and non-component files (`formatDate.ts`)
- **Constants**: camelCase with descriptive names (`designTokens.ts`, `apiEndpoints.ts`)
- **Types**: PascalCase for type definitions, often with `Type` or `Schema` suffix

### Expo Router Conventions
- **Route Files**: kebab-case or camelCase (`user-profile.tsx`, `userProfile.tsx`)
- **Layout Files**: Always `_layout.tsx` for route group layouts
- **Special Files**: `+` prefix for special pages (`+not-found.tsx`)
- **Route Groups**: Parentheses for layout groups `(tabs)/`

### Database and Schema Conventions
- **Schema Files**: Descriptive names with `.schema.ts` or `.ts` (`userSchema.ts`)
- **Migration Files**: Timestamp prefix for database migrations
- **Type Files**: `.types.ts` suffix for generated or manual type definitions

## Import Organization

### Import Order (enforced by ESLint)
1. **External Libraries**: React, React Native, third-party packages
2. **Internal Packages**: Other monorepo packages (`@soyokaze/schemas`)
3. **Relative Imports**: Local files and directories
4. **Type-only Imports**: Separated with `import type` syntax

### Index File Pattern
- Each directory with multiple exports includes an `index.ts` barrel file
- Features export their public API through index files
- Constants are consolidated through unified index exports

## Key Architectural Principles

### Separation of Concerns
- **UI Layer**: React components focus on presentation
- **Business Logic**: Custom hooks and services handle application logic
- **Data Layer**: Database queries and API calls are abstracted into services

### Type Safety
- **End-to-end**: Types flow from database schemas to UI components
- **Runtime Validation**: Zod provides runtime type checking for external data
- **Build-time Checking**: TypeScript ensures compile-time type safety

### Scalability
- **Feature Isolation**: Features can be developed and tested independently
- **Package Boundaries**: Clear interfaces between mobile, API, and schema packages
- **Code Generation**: Automated generation reduces manual synchronization overhead