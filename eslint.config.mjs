import { FlatCompat } from "@eslint/eslintrc";
import playwright from "eslint-plugin-playwright";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
    plugins: ["promise"],
    parserOptions: {
      project: "./tsconfig.json",
    },
    rules: {
      // Require await of async functions
      "@typescript-eslint/await-thenable": "error",
      // Require Promise-like statements to be handled appropriately
      "@typescript-eslint/no-floating-promises": [
        "error",
        { ignoreVoid: false },
      ],
      // Ensure each time a then() is applied to a Promise, a catch() is applied as well
      "promise/catch-or-return": "error",
      // Enforce consistent param names when creating new promises
      "promise/param-names": "error",
    },
  }),
  {
    ignores: ["src/client/**/*"],
  },
  {
    ...playwright.configs["flat/recommended"],
    files: ["tests/**"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      "playwright/expect-expect": [
        "error",
        {
          assertFunctionNames: ["testSearchFunctionality"],
        },
      ],
    },
  },
];

export default eslintConfig;
