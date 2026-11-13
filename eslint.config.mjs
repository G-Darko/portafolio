import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    // Static export output (next.config distDir).
    "dist/**",
    // Tooling artifacts committed to the repo (Impeccable skill output).
    ".impeccable/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
