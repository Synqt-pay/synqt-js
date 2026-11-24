const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const SDK = require('../src/synqt.js');

const { buildPaymentMethod, defaultChoices, filledIn, problem, problems, providers, readyToPay, regex, shows, validatePaymentMethod, methodForms, paymentMethodRules, parseOperators, parsePaymentOptions, hasText, text } = { ...SDK, ...SDK.internals };

const form = (code) => methodForms.find((methodForm) => methodForm.code === code);
const field = (code, path) => form(code).fields.find((formField) => formField.path === path);
const pairs = (errors) => errors.map((error) => `${error.attr}=${error.text}`);

test('every method except CARD has a named form', () => {
  assert.equal(new Set(methodForms.map((methodForm) => methodForm.code)).size, 32);
  assert.ok(!methodForms.some((methodForm) => methodForm.code === 'CARD'));
  assert.equal(text(form('CAPITEC_PAY').name), 'Capitec Pay');
});

test('every string the forms and the sheet use has English text', () => {
  const keys = methodForms.flatMap((methodForm) => [
    methodForm.name,
    ...methodForm.oneOfs.flatMap((question) => [question.question, ...question.choices.map((choice) => choice.label)]),
    ...methodForm.fields.flatMap((formField) => [formField.label, formField.hint, formField.placeholder, formField.section, formField.invalid, ...(formField.options ?? []).map((option) => option.label)].filter(Boolean)),
  ]);
  // Keys passed to text('…') in the sources, so a typo shows up here rather than as a raw key in front of a payer.
  const sdk = readFileSync(path.join(__dirname, '../src/synqt.js'), 'utf8');
  keys.push(...[...sdk.matchAll(/['"](synqt_[a-z0-9_]+)['"]/g)].map((match) => match[1]));
  assert.deepEqual(keys.filter((key) => !hasText(key)), []);
});

test('every spec pattern compiles in JavaScript', () => {
  for (const formField of methodForms.flatMap((methodForm) => methodForm.fields).filter((formField) => formField.pattern)) assert.ok(regex(formField.pattern), formField.pattern);
});

test('payers never see JSON paths', () => {
  const labels = methodForms.flatMap((methodForm) => methodForm.fields).map((formField) => text(formField.label));
  assert.deepEqual(labels.filter((label) => label.includes('.') || /^[a-z]+[A-Z]/.test(label)), []);
});

test('blank groups are left out and filled ones built', () => {
  const method = buildPaymentMethod(form('CAPITEC_PAY'), { phoneNumber: ' 0821234567 ', 'account.accountNumber': '', 'customerName.lastName': 'Doe' });
  assert.deepEqual(method, { paymentMethodCode: 'CAPITEC_PAY', phoneNumber: '0821234567', customerName: { lastName: 'Doe' } });
});

test('a missing required field names the path', () => {
  assert.throws(() => buildPaymentMethod(form('CAPITEC_PAY'), { 'customerName.firstName': 'Jane' }), { path: 'customerName.lastName' });
});

test('problems use the spec limits in plain words', () => {
  const found = problems(form('CAPITEC_PAY'), { said: '12345', 'account.accountNumber': '12345678ab', emailAddress: 'nope', 'customerName.lastName': 'Doe' }, []);
  assert.deepEqual(pairs(found), ['emailAddress=Enter a valid email address', 'said=Enter 13 digits', 'account.accountNumber=Enter 10 digits']);
});

test('a section with a mandatory field is mandatory', () => {
  assert.deepEqual(pairs(problems(form('CAPITEC_PAY'), {}, [])), ['customerName.lastName=Required']);
  assert.equal(text(field('CAPITEC_PAY', 'customerName.lastName').section), 'Your name');
  // A section with nothing mandatory in it stays optional.
  assert.equal(text(form('EWALLET').fields.find((formField) => formField.path.startsWith('account.')).section), 'Bank account (optional)');
  assert.deepEqual(pairs(problems(form('FNB_DIRECT_EFT'), {}).filter((error) => error.attr === 'account.accountNumber')), ['account.accountNumber=Required']);
});

test('Absa Pay asks for one detail and bank account is the default', () => {
  const absaPay = form('ABSA_PAY');
  const [bank, id] = absaPay.oneOfs[0].choices;
  assert.equal(text(bank.label), 'Bank account');
  const lastName = 'customerName.lastName=Required'; // asked for on Absa Pay, though the spec makes it optional
  assert.deepEqual(pairs(problems(absaPay, {})), ['account.accountNumber=Required', lastName]);
  // Picking the ID number makes it the required one, and a stale account number is not checked or sent.
  assert.deepEqual(pairs(problems(absaPay, { 'account.accountNumber': 'x' }, [id])), ['said=Required', lastName]);
  assert.ok(shows(absaPay, 'emailAddress', [id]));
  assert.ok(!shows(absaPay, 'account.accountNumber', [id]));
  const method = buildPaymentMethod(absaPay, { said: '0000000000000', 'customerName.lastName': 'Doe' });
  assert.equal(method.said, '0000000000000');
  assert.equal(method.account, undefined);
});

test('PayShap choices need their companion fields', () => {
  const payShap = form('PAYSHAP');
  const [bank, mobile] = payShap.oneOfs[0].choices;
  const values = { paymentOperatorCode: 'BANK', 'customerName.lastName': 'Doe' };
  assert.deepEqual(problems(payShap, values, [bank]).map((error) => error.attr), ['account.accountName', 'account.accountNumber']);
  assert.deepEqual(problems(payShap, values, [mobile]).map((error) => error.attr), ['phoneNumber', 'externalProviderCode']);
  assert.deepEqual(problems(payShap, { ...values, phoneNumber: '000000000000', externalProviderCode: 'X' }, [mobile]), []);
});

test('FNB Pay asks for ID or passport with ID first, PayShap leaves its ID question optional', () => {
  const [id, passport] = form('FNB_DIRECT_EFT').oneOfs[0].choices;
  assert.deepEqual([text(id.label), text(passport.label)], ['South African ID number', 'Passport number']);
  assert.ok(!problems(form('FNB_DIRECT_EFT'), {}, [passport]).some((error) => error.attr === 'said'));
  const [pay, ids] = form('PAYSHAP').oneOfs;
  assert.equal(text(ids.question), 'Which ID do you want to give?');
  assert.ok(!problems(form('PAYSHAP'), {}, [pay.choices[0], ids.choices[0]]).some((error) => error.attr === 'said'));
});

test('only valid prefilled fields count as filled in', () => {
  const zapper = form('ZAPPER_QR');
  const prefill = { emailAddress: 'test@example.com', 'customerName.firstName': 'Jane', 'customerName.lastName': 'Doe' };
  assert.deepEqual(filledIn(zapper, prefill, prefill, []), ['emailAddress', 'customerName.firstName', 'customerName.lastName']);
  // A malformed email stays in view so the payer can fix it; a value the payer has since changed is theirs.
  const badEmail = { ...prefill, emailAddress: 'nope' };
  assert.deepEqual(filledIn(zapper, badEmail, badEmail, []), ['customerName.firstName', 'customerName.lastName']);
  assert.deepEqual(filledIn(zapper, { ...prefill, 'customerName.firstName': 'Janet' }, prefill, []), ['emailAddress', 'customerName.lastName']);
});

test('a prefilled first and last name hide the optional name fields', () => {
  const capitec = form('CAPITEC_PAY');
  const names = { 'customerName.firstName': 'Jane', 'customerName.lastName': 'Doe' };
  assert.deepEqual(filledIn(capitec, names, names, defaultChoices(capitec)), [
    'customerName.firstName', 'customerName.lastName', 'customerName.titleBefore', 'customerName.middleName', 'customerName.titleAfter',
  ]);
});

test('the sheet pays straight away only when every mandatory field is filled in', () => {
  const zapper = form('ZAPPER_QR');
  const all = { emailAddress: 'test@example.com', 'customerName.firstName': 'Jane', 'customerName.lastName': 'Doe' };
  assert.ok(readyToPay(zapper, all, filledIn(zapper, all, all, []), []));
  const { emailAddress, ...noEmail } = all;
  assert.ok(!readyToPay(zapper, noEmail, filledIn(zapper, noEmail, noEmail, []), []));
  // Net banking has only optional fields, so the payer still sees its form.
  assert.ok(!readyToPay(form('NETBANKING'), {}, [], []));
});

test('South African rules make spec-optional fields mandatory', () => {
  assert.deepEqual(form('ONLINE').fields.filter((formField) => formField.required).map((formField) => formField.path), [
    'paymentOperatorCode', 'emailAddress', 'account.accountName', 'account.accountNumber', 'account.accountType',
  ]);
  assert.ok(field('OFFLINE', 'paymentOperatorCode').required);
});

test('every form builds a method that passes its own checks', () => {
  for (const methodForm of methodForms) {
    const values = Object.fromEntries(methodForm.fields.map((formField) => [formField.path, formField.options?.[0]?.value ?? 'x']));
    assert.doesNotThrow(() => buildPaymentMethod(methodForm, values), methodForm.code);
  }
});

test('a payment method is checked against its own fields', () => {
  const pse = { paymentMethodCode: 'PSE', emailAddress: 'a@b.co', phoneNumber: '+27821234567' };
  assert.throws(() => validatePaymentMethod({ ...pse, account: {} }), { message: 'PSE needs account.accountName', path: 'account.accountName' });
  assert.throws(() => validatePaymentMethod({ ...pse, account: { accountName: 'A', accountNumber: '1' } }), { message: 'PSE does not take account.accountNumber' });
  assert.throws(() => validatePaymentMethod({ paymentMethodCode: 'NOPE' }), { message: 'Unknown paymentMethodCode NOPE' });
  // An optional section left out, or set to null, is fine.
  assert.doesNotThrow(() => validatePaymentMethod({ paymentMethodCode: 'CAPITEC_PAY', phoneNumber: '0821234567', customerName: { lastName: 'D' }, account: null }));
});

test('card requests have no raw card field', () => {
  assert.ok(paymentMethodRules.CARD.allowed.includes('card.cardDataVault.vaultToken'));
  assert.ok(!paymentMethodRules.CARD.allowed.some((path) => path.includes('cardDataRaw')));
});

test('SA mobile numbers are up to 12 characters starting with 0', () => {
  for (const code of ['PAYSHAP', 'CAPITEC_PAY']) {
    const phone = field(code, 'phoneNumber');
    assert.equal(problem(phone, { phoneNumber: '0000000000' }), undefined);
    assert.equal(problem(phone, { phoneNumber: '1000000000' })?.text, 'Enter up to 12 characters, starting with 0');
    assert.equal(problem(phone, { phoneNumber: '0000000000000' })?.text, 'Enter up to 12 characters, starting with 0');
  }
});

test('account names take letters from any language', () => {
  const name = field('CAPITEC_PAY', 'account.accountName');
  assert.equal(problem(name, { 'account.accountName': "Zoë O'Neill-Nkosi" }), undefined);
  assert.equal(problem(name, { 'account.accountName': 'A <b>' })?.text, 'Use letters, numbers, spaces and common punctuation only');
});

test('operators carry their providers, listed once across banks', () => {
  const ops = parseOperators([
    { code: 'ZA_BANK', name: 'A Bank', externalProviders: { providers: [{ code: 'P1', name: 'Provider one' }, { name: 'no code' }] } },
    { code: 'ZA_OTHER' },
    { name: 'no code' },
  ]);
  assert.deepEqual(ops, [
    { code: 'ZA_BANK', name: 'A Bank', externalProviders: [{ code: 'P1', name: 'Provider one' }] },
    { code: 'ZA_OTHER', name: 'ZA_OTHER', externalProviders: [] },
  ]);
  const p1 = { code: 'S', name: 'S' };
  const p2 = { code: 'C', name: 'C' };
  assert.deepEqual(providers([{ externalProviders: [p1, p2] }, { externalProviders: [p2, p1] }]), [p1, p2]);
});

test('payment options carry operators and payer-facing names', () => {
  const [fpx, other] = parsePaymentOptions({
    data: [{ paymentMethodCode: 'FPX', paymentOperators: [{ code: 'MBB', name: 'Maybank' }] }, { paymentMethodCode: 'BRAND_NEW', segmentCode: 'S1' }],
  });
  assert.equal(fpx.name, 'FPX online banking');
  assert.deepEqual(fpx.operators, [{ code: 'MBB', name: 'Maybank', externalProviders: [] }]);
  assert.equal(other.name, undefined); // the sheet cannot show it, so it has no payer-facing name
  assert.equal(other.segmentCode, 'S1');
});
