module.exports = {
  root: true,
  plugins: ["unused-imports", "tailwindcss", "simple-import-sort", "check-file"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
		"check-file/filename-naming-convention": [
      "error",
      {
        "src/**/*.{js,ts,jsx,tsx}": "KEBAB_CASE"
      }
    ],
    "indent": ["error", "tab"],
    "jsx-a11y/anchor-is-valid": "warn",
    "jsx-a11y/click-events-have-key-events": "warn",
    "jsx-a11y/no-noninteractive-element-interactions": "warn",
    "import/extensions": "off",
    "react/function-component-definition": "off",
    "react/destructuring-assignment": "off",
    "react/require-default-props": "off",
    "react/jsx-props-no-spreading": "off",
    "@next/next/no-img-element": "off",
    "no-restricted-syntax": [
      "error",
      "ForInStatement",
      "LabeledStatement",
      "WithStatement",
    ],
    "import/prefer-default-export": "off",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
      },
    ],
  },
  extends: [
    "plugin:tailwindcss/recommended",
    "eslint:recommended",
    "airbnb",
    "airbnb-typescript",
    "next/core-web-vitals",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: [
    ".eslintrc.js",
    "webpack.config.js",
		"src/components/ui/*",
    "build/",
    "node_modules/",
    ".vscode/"
  ],
};
