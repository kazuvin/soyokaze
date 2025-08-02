// Soyokaze API TypeSpec Definition
// Entry point for the API specification

import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";

// Import core types and models
import "./lib/index.tsp";
import "./models/common.tsp";
import "./models/auth.tsp";

// Import service definitions
import "./services/auth.tsp";

using TypeSpec.Http;
using TypeSpec.Rest;
