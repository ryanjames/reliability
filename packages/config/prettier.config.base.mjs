import tailwindPlugin from 'prettier-plugin-tailwindcss';

/** @type {import("prettier").Config} */
export default {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 80,
  semi: true,
  plugins: [tailwindPlugin],
};