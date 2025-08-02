import { defineConfig } from 'orval';

export default defineConfig({
  'tanstack-query': {
    input: '../tsp/tsp-output/@typespec/openapi3/openapi.yaml',
    output: {
      mode: 'split',
      target: './generated/tanstack-query',
      client: 'react-query',
      schemas: './generated/tanstack-query/model',
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: './src/mutator.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useInfiniteQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
  },
  'client-library': {
    input: '../tsp/tsp-output/@typespec/openapi3/openapi.yaml',
    output: {
      mode: 'split',
      target: './generated/client',
      client: 'axios',
      schemas: './generated/client/model',
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: './src/mutator.ts',
          name: 'customInstance',
        },
      },
    },
  },
  'zod-schemas': {
    input: '../tsp/tsp-output/@typespec/openapi3/openapi.yaml',
    output: {
      mode: 'single',
      target: './generated/zod/schemas.ts',
      client: 'zod',
      clean: true,
      prettier: true,
    },
  },
  'msw-mocks': {
    input: '../tsp/tsp-output/@typespec/openapi3/openapi.yaml',
    output: {
      mode: 'split',
      target: './generated/msw',
      client: 'axios',
      mock: true,
      clean: true,
      prettier: true,
      override: {
        mock: {
          type: 'msw',
          properties: () => 'faker',
        },
      },
    },
  },
});