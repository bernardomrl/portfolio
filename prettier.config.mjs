/** @type {import("prettier").Config & import("prettier-plugin-tailwindcss").PluginOptions} */
const config = {
  singleQuote: true,
  printWidth: 100,
  plugins: ['prettier-plugin-tailwindcss'],
  // why: Tailwind 4 has no tailwind.config.js, so the plugin reads the theme from
  // the CSS entry point, and the path is resolved relative to this file. The
  // coupling is deliberate (D-40): this line moves with the stylesheet, in the same
  // commit, or class sorting silently falls back to an unconfigured order.
  tailwindStylesheet: './src/shared/ui/styles/globals.css',
  // why: cn() arrives in T-11; listed now so the file is not reopened for one line.
  tailwindFunctions: ['cn'],
};

export default config;
