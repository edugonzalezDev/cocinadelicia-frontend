// .prettierrc.cjs
/** @type {import("prettier").Config} */
module.exports = {
  semi: true, // ; al final de línea
  singleQuote: false, // comillas dobles
  printWidth: 100, // buen balance para JSX
  tabWidth: 2,
  useTabs: false,
  trailingComma: "all", // diffs más limpios en listas/params
  bracketSpacing: true, // { foo: bar }
  bracketSameLine: false, // en JSX el ">" va en línea nueva
  arrowParens: "always",
  endOfLine: "lf",
  jsxSingleQuote: false,
  htmlWhitespaceSensitivity: "css",

  // Plugins
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/index.css",
};
