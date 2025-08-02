import { createTypeSpecLibrary } from "@typespec/compiler";

export const $lib = createTypeSpecLibrary({
  name: "",
  diagnostics: {},
});

export const { reportDiagnostic, createDiagnostic } = $lib;
