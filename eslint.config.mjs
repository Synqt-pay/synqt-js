import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {ecmaVersion: 2024, sourceType: 'script', globals: {...globals.browser}},
        rules: {
            'no-var': 'error',
            'prefer-const': 'error',
            eqeqeq: ['error', 'always', {null: 'ignore'}],
            'no-unused-vars': ['error', {argsIgnorePattern: '^_', ignoreRestSiblings: true}],
        },
    },
    // synqt.js exports to module.exports under Node for the tests, else sets a browser global.
    {files: ['synqt.js'], languageOptions: {globals: {module: 'readonly'}}},
    {files: ['test/**'], languageOptions: {sourceType: 'commonjs', globals: {...globals.node}}},
];
