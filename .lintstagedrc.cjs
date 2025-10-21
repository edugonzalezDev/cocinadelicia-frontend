module.exports = {
  "**/*.{js,jsx,ts,tsx}": [
    "npx prettier --write",
    "npx eslint --fix"
  ],
  "**/*.{json,md,css,scss,html}": [
    "npx prettier --write"
  ]
};
