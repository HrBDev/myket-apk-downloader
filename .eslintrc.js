/* eslint-disable */
module.exports = {
    root: true,
    extends: ["eslint:recommended"],
    env: { node: true, es6: true, mocha: true },
    parserOptions: {
        ecmaVersion: 8,
    },
    overrides: [
        {
            files: ["**/*.ts", "**/*.tsx"],
            env: {
                browser: true,
                es2021: true,
            },
            extends: [
                "eslint:recommended",
                "plugin:@typescript-eslint/recommended",
                "plugin:@typescript-eslint/recommended-requiring-type-checking",
                "prettier",
            ],
            overrides: [],
            parser: "@typescript-eslint/parser",
            parserOptions: {
                project: "./tsconfig.json",
            },
            plugins: ["@typescript-eslint"],
            rules: {},
        },
    ],
}
