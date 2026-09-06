import js from "@eslint/js"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import prettier from "eslint-config-prettier"
import { defineConfig } from "eslint/config"
import globals from "globals"
import { fileURLToPath } from "node:url"

export default defineConfig([
    {
        ignores: ["dist/**", ".cache/**", ".yarn/**"],
    },
    js.configs.recommended,
    {
        files: ["**/*.{js,cjs,mjs}"],
        languageOptions: {
            globals: { ...globals.node, ...globals.mocha },
        },
    },
    {
        files: ["public/**/*.js", "public_firefox/**/*.js"],
        languageOptions: {
            globals: { ...globals.browser, ...globals.webextensions },
        },
    },
    {
        files: ["**/*.{ts,tsx}"],
        extends: [tsPlugin.configs["flat/recommended-type-checked"]],
        languageOptions: {
            globals: { ...globals.node, ...globals.browser, ...globals.mocha },
            parserOptions: {
                project: ["./tsconfig.json", "./tests/tsconfig.json"],
                tsconfigRootDir: fileURLToPath(new URL(".", import.meta.url)),
            },
        },
    },
    prettier,
])
