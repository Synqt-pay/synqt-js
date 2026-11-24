import js from '@eslint/js';
import globals from 'globals';

export default [
    {ignores: ['dist/']},
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
    // src/synqt.js exports to module.exports under Node for the tests, else sets a browser global.
    {files: ['src/synqt.js'], languageOptions: {globals: {module: 'readonly'}}},
    {files: ['scripts/**'], languageOptions: {sourceType: 'module', globals: {...globals.node}}},
    {files: ['test/**'], languageOptions: {sourceType: 'commonjs', globals: {...globals.node}}},
];
