// .eslintrc.cjs
/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  plugins: ["react", "react-hooks", "jsx-a11y", "@typescript-eslint",],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  settings: {
    react: { version: "detect" },
  },
  rules: {
    // Estilo ya lo maneja Prettier; acá poné “lógica”/buenas prácticas
    "react/prop-types": "off", // si no usás PropTypes
    "react/jsx-uses-react": "off", // React 17+ (JSX transform)
    "react/react-in-jsx-scope": "off", // React 17+ (JSX transform)
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
  },
  ignorePatterns: ["dist/**", "build/**", "node_modules/**", "coverage/**"],
  overrides: [{ files: ["**/*.ts", "**/*.tsx"], parser: "@typescript-eslint/parser" }],
};
