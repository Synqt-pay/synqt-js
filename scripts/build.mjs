// Builds dist/: synqt.js (readable), synqt.min.js with its source map, and the fonts the script loads from beside itself.
import { build } from 'esbuild';
import { cpSync, rmSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });

const options = {
    entryPoints: ['src/synqt.js'],
    bundle: true,
    format: 'iife',
    globalName: 'SynqtSDK', // the browser global; src/synqt.js exports through module.exports, which esbuild wraps
    footer: { js: "if (typeof module === 'object' && module.exports) module.exports = SynqtSDK;" }, // Node can require it
    legalComments: 'inline',
    logLevel: 'warning',
};
await build({ ...options, outfile: 'dist/synqt.js' });
await build({ ...options, outfile: 'dist/synqt.min.js', minify: true, sourcemap: true });
cpSync('fonts', 'dist/fonts', { recursive: true });
