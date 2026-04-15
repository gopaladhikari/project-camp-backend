import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig(
  { ignores: ["node_modules/", "dist/"] },

  {
    files: ["src/**/*.ts"],
    languageOptions: {
      globals: globals.node,
    },
    extends: [
      pluginJs.configs.recommended,
      tseslint.configs.recommended,
    ],
    rules: {
      "prefer-const": "error",
      "no-console": "warn",
      "node/no-unsupported-features/es-syntax": 0,
      "node/no-missing-import": 0,
      "node/file-extension-in-import": 0,
      "@typescript-eslint/no-non-null-asserted-optional-chain": 0,
      "no-process-exit": 0,
    },
  },
);
