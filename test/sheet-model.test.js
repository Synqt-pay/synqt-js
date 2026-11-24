const assert = require('node:assert/strict');
const { test } = require('node:test');
const SDK = require('../synqt.js');

const { methodForms, parseCreatePayin, parseErrors, SynqtAPIError, payinErrors, PaymentSheetModel, timeLeft } = { ...SDK, ...SDK.internals };

const all = { emailAddress: 'test@example.com', 'customerName.firstName': 'Jane', 'customerName.lastName': 'Doe' };
const tick = () => new Promise((resolve) => setTimeout(resolve));

const sheet = (code, prefill, submit, operators = []) =>
  new PaymentSheetModel({
    form: methodForms.find((methodForm) => methodForm.code === code),
    prefill,
    operators,
    summary: { amount: 'R1.00', method: 'x', reference: 'o-1' },
    submit,
  });

test('sheet errors are read out to screen readers and nothing is sent', () => {
  const model = sheet('CAPITEC_PAY', {}, () => assert.fail('sent'));
  const said = [];
  let started = 0;
  model.announce = (message) => said.push(message);
  model.onPaymentStarted = () => started++;
  model.pay();
  assert.deepEqual(said, ['Account number: Required\nLast name: Required']);
  assert.equal(started, 0);
});

test('payment starts when the details go to SYNQT, and an offline failure says so', async () => {
  const model = sheet('ZAPPER_QR', all, async () => {
    throw new TypeError('Failed to fetch');
  });
  let started = 0;
  model.onPaymentStarted = () => started++;
  model.start(); // everything mandatory is prefilled, so it pays straight away
  assert.equal(started, 1);
  assert.ok(model.processing);
  await tick();
  assert.ok(!model.processing);
  assert.equal(model.banner, 'Could not reach SYNQT. Check the connection and try again.');
});

test('a refused prefilled value comes back into view under its field', async () => {
  const model = sheet('ZAPPER_QR', all, async () => {
    throw new SynqtAPIError(406, [{ code: 'INVALID_EMAIL', field: 'emailAddress', description: 'Bad email' }]);
  });
  assert.ok(!model.visible('emailAddress'));
  model.start();
  await tick();
  assert.ok(model.visible('emailAddress'));
  assert.equal(model.marks.emailAddress, 'Check this field (INVALID_EMAIL)'); // never SYNQT's description
  assert.equal(model.focusRequest.path, 'emailAddress');
  // Typing in it clears SYNQT's error.
  model.setValue(model.inputs.find((field) => field.path === 'emailAddress'), 'new@example.com');
  assert.equal(model.marks.emailAddress, undefined);
});

test('closing after SYNQT accepted the payment returns that result, once', async () => {
  const accepted = parseCreatePayin('{"paymentMethodResponse":{"paymentMethodCode":"ZAPPER_QR","qrCode":"https://example.com/qr.png"}}');
  const model = sheet('ZAPPER_QR', all, async () => accepted);
  const results = [];
  model.onFinish = (result) => results.push(result);
  model.start();
  await tick();
  assert.equal(model.next.qrCodeImageURL, 'https://example.com/qr.png');
  model.close();
  model.close();
  assert.deepEqual(results, [accepted]);
});

test('choosing another answer empties the one left', () => {
  const model = sheet('CAPITEC_PAY', { phoneNumber: '0821234567' }, () => {});
  const [bank, mobile] = model.form.oneOfs[0].choices;
  assert.equal(model.chosen[0], mobile); // the prefilled answer is picked
  model.choose(0, bank);
  assert.equal(model.values.phoneNumber, '');
  assert.ok(!model.visible('phoneNumber'));
});

test('an optional bank with no list is not asked for; a list becomes a menu', () => {
  assert.ok(!sheet('CAPITEC_PAY', {}, () => {}).inputs.some((field) => field.path === 'paymentOperatorCode'));
  const withBanks = sheet('CAPITEC_PAY', { paymentOperatorCode: 'NOT_LISTED' }, () => {}, [{ code: 'B', name: 'Bank', externalProviders: [] }]);
  const bank = withBanks.inputs.find((field) => field.path === 'paymentOperatorCode');
  assert.deepEqual(withBanks.options(bank).map((option) => option.label), ['No preference', 'Bank']);
  assert.equal(withBanks.values.paymentOperatorCode, ''); // a prefill that is not on the list is dropped
  assert.equal(withBanks.marks.paymentOperatorCode, 'Check this field'); // and the payer is told why
});

test('a prefilled value that fails its checks is shown with its error from the start', () => {
  const model = sheet('ZAPPER_QR', { ...all, emailAddress: 'not-an-email' }, () => {});
  assert.ok(model.visible('emailAddress'));
  assert.ok(model.marks.emailAddress);
  assert.equal(model.marks['customerName.lastName'], undefined); // a valid prefill stays hidden with no error
});

test('an error found on leaving a field is read out once', () => {
  const model = sheet('ZAPPER_QR', {}, () => {});
  const said = [];
  model.announce = (message) => said.push(message);
  const email = model.inputs.find((field) => field.path === 'emailAddress');
  model.focus('emailAddress', true);
  model.setValue(email, 'bad');
  model.focus('emailAddress', false);
  model.focus('emailAddress', true);
  model.setValue(email, 'worse');
  model.focus('emailAddress', false);
  assert.equal(said.length, 1);
  assert.match(said[0], /^Email/);
});

test('input is cut at the field limit', () => {
  const model = sheet('CAPITEC_PAY', {}, () => {});
  const said = model.inputs.find((field) => field.path === 'said');
  model.setValue(said, '12345678901234567');
  assert.equal(model.values.said, '1234567890123');
});

test('sheet messages for refusals', () => {
  assert.deepEqual(payinErrors(new SynqtAPIError(406, parseErrors('{"code":"SYSTEM"}'))).map((error) => error.text), [
    'SYNQT could not process this payment (SYSTEM). Try again later or choose another method.',
  ]);
  assert.deepEqual(payinErrors(new SynqtAPIError(406)).map((error) => error.text), ['The payment could not be created (HTTP 406).']);
  assert.deepEqual(payinErrors(new SynqtAPIError(401)).map((error) => error.text), ['The payment session has expired (HTTP 401). Start the payment again.']);
  // A code with payer wording shows it instead of SYNQT's description, which is written for the merchant.
  assert.deepEqual(payinErrors(new SynqtAPIError(406, [{ code: 'INVALID_ACCOUNT_NUMBER', field: 'account.accountNumber', description: 'Bad account' }])).map((error) => error.text), [
    'Check the account number and try again. (INVALID_ACCOUNT_NUMBER)',
  ]);
  // One without never shows SYNQT's description, which is for the merchant: a field gets "Check this field".
  assert.deepEqual(payinErrors(new SynqtAPIError(406, [{ code: 'EMAIL_INVALID', field: 'emailAddress', description: 'Bad email' }])).map((error) => error.text), ['Check this field (EMAIL_INVALID)']);
  assert.deepEqual(payinErrors(new SynqtAPIError(406, [{ code: 'EMAIL_INVALID', description: 'Bad email' }])).map((error) => error.text), [
    'Your payment could not be completed. Please try again, or choose another payment method. (EMAIL_INVALID)',
  ]);
  assert.deepEqual(payinErrors(new SynqtAPIError(406, [{ code: 'NEW_CODE' }])).map((error) => error.text), [
    'Your payment could not be completed. Please try again, or choose another payment method. (NEW_CODE)',
  ]);
});

test('time left counts down to the expiry', () => {
  const now = Date.parse('2026-10-27T13:16:32Z');
  assert.equal(timeLeft('2026-10-27T15:15:49.725253752Z', now), '01:59:17');
  assert.equal(timeLeft('2026-10-27T13:00:00Z', now), '');
  assert.equal(timeLeft('not a time', now), undefined);
});

/** A sheet whose bank list could not be loaded. */
const failedSheet = (code) =>
  new PaymentSheetModel({
    form: methodForms.find((methodForm) => methodForm.code === code),
    prefill: {},
    summary: { amount: 'R1.00', method: 'x', reference: 'o-1' },
    submit: () => assert.fail('sent'),
  });

test('a mandatory bank field whose list did not load waits for Try again', async () => {
  const model = failedSheet('OFFLINE');
  const bank = model.inputs.find((field) => field.kind === 'paymentOperator');
  const said = [];
  model.announce = (message) => said.push(message);
  assert.ok(model.banksMissing(bank));
  // Pay marks it and goes to it, as the view focuses Try again there.
  model.pay();
  assert.equal(model.marks.paymentOperatorCode, 'Required');
  assert.equal(model.focusRequest.path, 'paymentOperatorCode');
  // A failed Try again keeps the state and says so.
  model.reloadOperators = async () => undefined;
  const failed = model.retryBanks();
  assert.ok(model.loadingBanks);
  await failed;
  assert.ok(!model.loadingBanks && model.banksMissing(bank));
  assert.equal(said.at(-1), 'The list of banks could not be loaded. Check the connection and try again.');
  // A working one brings the dropdown back and clears its error.
  model.reloadOperators = async () => [{ code: 'ABSA', name: 'Absa', externalProviders: [] }];
  await model.retryBanks();
  assert.ok(!model.banksMissing(bank));
  assert.equal(model.marks.paymentOperatorCode, undefined);
  assert.ok(model.options(bank).some((option) => option.value === 'ABSA'));
});

test('an optional bank field stays hidden when the list did not load', () => {
  const model = failedSheet('CAPITEC_PAY');
  assert.ok(!model.inputs.some((field) => field.kind === 'paymentOperator'));
});

test('the intro line shows only when there is nothing to enter', () => {
  assert.equal(sheet('CAPITEC_PAY', {}).intro, undefined);
  const empty = new PaymentSheetModel({
    form: { code: 'X', name: 'synqt_zapper', fields: [], oneOfs: [] },
    prefill: {},
    operators: [],
    summary: { amount: 'R1.00', method: 'x', reference: 'o-1' },
  });
  assert.equal(empty.intro, 'No details needed. Tap Pay to continue.');
});
