const { defineConfig } = require('orval');

module.exports = defineConfig({
  // Native Fetch Client
  'native-fetch': {
    input: {
      target: './generated/@typespec/openapi3/openapi.yaml',
    },
    output: {
      mode: 'single',
      target: './generated/clients/native-fetch.ts',
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
      mode: 'single',
      target: './generated/clients/tanstack-query.ts',
      client: 'react-query',
      override: {
        query: {
          useQuery: true,
          useMutation: true,
          useSuspenseQuery: true,
          useInfiniteQuery: false,
          signal: true,
        },
      },
    },
  },

});