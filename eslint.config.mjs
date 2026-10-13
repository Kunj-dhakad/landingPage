import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";
import globals from "globals";
export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "src/generated/**",
      "node_modules/**",
      "docs/**",
      "public/**",
      "src/components/ui.tsx",
      "src/components/media.tsx",
      "src/config/site.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    settings: { react: { version: "detect" } },
  },
  {
    files: ["**/*.tsx"],
    plugins: { react, "react-hooks": hooks },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
);
