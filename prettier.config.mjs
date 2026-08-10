/** @type {import("prettier").Config & import("prettier-plugin-tailwindcss").PluginOptions} */
const config = {
  singleQuote: true,
  printWidth: 100,
  plugins: ['prettier-plugin-tailwindcss'],
  // why: Tailwind 4 has no tailwind.config.js, so the plugin reads the theme
  // from the CSS entry point. Path is resolved relative to this file.
  // T-06 moves this stylesheet to src/shared/ui/styles/globals.css — update here
  // in the same commit or class sorting silently falls back to an unconfigured order.
  tailwindStylesheet: './src/app/globals.css',
  // why: cn() arrives in T-11; listed now so the file is not reopened for one line.
  tailwindFunctions: ['cn'],
};

export default config;
