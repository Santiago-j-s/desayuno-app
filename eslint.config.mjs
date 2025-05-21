// @ts-check

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import { globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default tseslint.config([
  globalIgnores(["node_modules/", ".next/"]),
  tseslint.configs.recommended,
  js.configs.recommended,
  ...compat.config({
    extends: ["plugin:@next/next/core-web-vitals", "next/typescript"],
  }),
]);
