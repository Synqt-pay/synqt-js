// Checks dist/ as built by `npm run build` (run before the tests by pretest).
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { existsSync, readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dist = (file) => path.join(__dirname, '../dist', file);

test('the minified bundle sets the SynqtSDK global in a page and points to its source map', () => {
    const code = readFileSync(dist('synqt.min.js'), 'utf8');
    const page = { document: { currentScript: { src: 'https://cdn.example/synqt.min.js' } }, location: { href: 'https://shop.example/' } };
    page.globalThis = page;
    vm.runInNewContext(code, page);
    assert.equal(typeof page.SynqtSDK.Synqt, 'function');
    assert.equal(typeof page.SynqtSDK.Money, 'function');
    assert.match(code, /\/\/# sourceMappingURL=synqt\.min\.js\.map\s*$/);
    assert.deepEqual(JSON.parse(readFileSync(dist('synqt.min.js.map'), 'utf8')).sources, ['../src/synqt.js']);
});

test('the bundles can be required from Node, and the fonts sit beside them', () => {
    assert.equal(typeof require(dist('synqt.js')).Synqt, 'function');
    assert.equal(typeof require(dist('synqt.min.js')).Synqt, 'function');
    assert.ok(existsSync(dist('fonts/synqt_instrument_sans_regular.ttf')));
});
