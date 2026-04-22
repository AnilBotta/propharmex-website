/** @type {import('lint-staged').Config} */
export default {
  "*.{ts,tsx,js,jsx,mjs,cjs}": ["prettier --write", "eslint --fix"],
  "*.{json,md,mdx,css,yml,yaml}": ["prettier --write"]
};
