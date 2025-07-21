const { defineConfig } = require('orval');

module.exports = defineConfig({
  // Native Fetch Client
  'native-fetch': {
    input: {
      target: './generated/@typespec/openapi3/openapi.yaml',
    },
    output: {
      mode: 'split',
      target: './generated/clients/native-fetch',
      client: 'fetch',
      override: {
        mutator: {
          path: './src/mutator/custom-fetch.ts',
          name: 'customFetch',
        },
      },
    },
  },

  // TanStack Query Client
  'tanstack-query': {
    input: {
      target: './generated/@typespec/openapi3/openapi.yaml',
    },
    output: {
      mode: 'split',
      target: './generated/clients/tanstack-query',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/mutator/custom-fetch.ts',
          name: 'customFetch',
        },
        query: {
          useQuery: true,
          useMutation: true,
          useSuspenseQuery: true,
          useInfiniteQuery: true,
          signal: true,
        },
      },
    },
  },
});