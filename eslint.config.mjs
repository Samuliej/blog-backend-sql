import globals from "globals"
import pluginJs from "@eslint/js"
import prettierConfig from "eslint-config-prettier"
import unusedImports from "eslint-plugin-unused-imports"

if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = (obj) => JSON.parse(JSON.stringify(obj))
}

export default [
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
    plugins: {
      "unused-imports": unusedImports
    },
    rules: {
      "no-unused-vars": "error",
      "indent": ["error", 2],
      "semi": ["error", "never"],
      "unused-imports/no-unused-imports": "error"
    },
    env: {
      node: true
    }
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  prettierConfig
]