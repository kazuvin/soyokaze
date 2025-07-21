const { defineConfig } = require("orval");

module.exports = defineConfig({
  // Zod Schemas
  zod: {
    input: {
      target: "./generated/@typespec/openapi3/openapi.yaml",
    },
    output: {
      mode: "single",
      target: "./generated/zod.ts",
      client: "zod",
    },
  },

  // Native Fetch Client
  "native-fetch": {
    input: {
      target: "./generated/@typespec/openapi3/openapi.yaml",
    },
    output: {
      mode: "single",
      target: "./generated/fetch.ts",
      client: "fetch",
      override: {
        mutator: {
          path: "./src/mutator/custom-fetch.ts",
          name: "customFetch",
        },
      },
    },
  },

  // TanStack Query Client
  "tanstack-query": {
    input: {
      target: "./generated/@typespec/openapi3/openapi.yaml",
    },
    output: {
      mode: "single",
      target: "./generated/tanstack-query.ts",
      client: "react-query",
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

