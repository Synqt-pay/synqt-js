const assert = require('node:assert/strict');
const { test } = require('node:test');
const SDK = require('../src/synqt.js');

const { isReturn, formatMoney, Money, parseCreatePayin, parseErrors, parsePayinStatus, SynqtAPIError, SynqtArgumentError, Synqt, ease, orbitDot, methodForms } = { ...SDK, ...SDK.internals };

/** A fetch that records each request and answers with `reply(request)`: `[status, body]`. */
function fakeFetch(reply) {
  const sent = [];
  const fetch = async (url, init) => {
    const request = { url, ...init, json: init.body && JSON.parse(init.body) };
    sent.push(request);
    const [status, body] = reply(request);
    return new Response(body, { status });
  };
  return { fetch, sent };
}

const payin = (id = 'order-1', fetch = undefined) =>
  new Synqt('sandbox', fetch && { fetch }).payin({
    token: 'a.b+c', payinID: id, money: new Money('12.30', 'ZAR'), returnURL: 'https://x.io/return', callbackURL: 'https://x.io/cb',
  });

test('payment app url encodes params', () => {
  assert.equal(
    payin().paymentAppURL({ merchantCode: 'MID', extra: { emailAddress: 'a@b.co' } }),
    'https://payment.sandbox.synqt.io/?merchantCode=MID&idPayin=order-1&token=a.b%2Bc&amount=12.3' +
      '&currencyCode=ZAR&callbackUrl=https%3A%2F%2Fx.io%2Fcb&returnUrl=https%3A%2F%2Fx.io%2Freturn&emailAddress=a%40b.co',
  );
});

test('payment app offers a method and editable prefill', () => {
  const url = payin().paymentAppURL({ merchantCode: 'MID', paymentMethodCode: 'CAPITEC_PAY', prefill: { phoneNumber: '+27821234567' } });
  assert.ok(url.endsWith('&paymentMethodCode=CAPITEC_PAY&optionsAvailable=true&phoneNumber=%2B27821234567&allowCustomerDataChange=true'));
  assert.ok(!payin().paymentAppURL({ merchantCode: 'MID' }).includes('optionsAvailable'));
  assert.ok(payin().paymentAppURL({ merchantCode: "it's (ok)!" }).includes("merchantCode=it%27s%20%28ok%29%21"));
});

test('rejects an unsafe payin ID, a malformed amount, an unknown environment and a non-https return URL', () => {
  assert.throws(() => payin('../x'), SynqtArgumentError);
  assert.throws(() => new Money('12,30', 'ZAR'), SynqtArgumentError);
  assert.throws(() => new Synqt('prod'), SynqtArgumentError);
  const withReturn = (returnURL) => () => new Synqt('sandbox').payin({ token: 't', payinID: 'o-1', money: new Money('1.00', 'ZAR'), returnURL });
  assert.throws(withReturn('http://x.io/return'), SynqtArgumentError);
  assert.throws(withReturn('not a url'), SynqtArgumentError);
  assert.throws(withReturn(undefined), SynqtArgumentError);
});

test('parses a redirect', () => {
  assert.deepEqual(parseCreatePayin('{"redirectTo":{"method":"POST","url":"https://p.io","data":"{\\"k\\":\\"v\\",\\"n\\":1}"}}'), {
    type: 'redirect', httpMethod: 'POST', url: 'https://p.io', formData: { k: 'v', n: '1' },
  });
});

test('parses status', () => {
  const status = parsePayinStatus({
    paymentRequested: { money: { amount: 100.5, currencyCode: 'ZAR' } },
    fee: { amount: 2, currencyCode: 'ZAR' },
    process: { status: 'FAILED', isTest: true, createdAt: '2026-10-26T10:00:00Z', failureReasons: { failureReasonCode: 'ENTITY_EXPIRED', message: 'Expired' } },
    paymentMethodResponse: { paymentMethodCode: 'CAPITEC_PAY' },
  });
  assert.equal(status.status, 'FAILED');
  assert.ok(status.isFinal && status.isTest);
  assert.equal(String(status.requested), 'R100.50');
  assert.equal(status.fee.amount, '2');
  assert.equal(status.failureReason.code, 'ENTITY_EXPIRED');
  assert.equal(status.failureReason.payerMessage, 'The payment was not approved in time. Start a new payment to try again.');
  assert.equal(status.paymentMethod.paymentMethodCode, 'CAPITEC_PAY');
  const unknown = parsePayinStatus({ process: { status: 'ON_HOLD' } });
  assert.deepEqual([unknown.status, unknown.isFinal], ['UNKNOWN', false]);
});

test('rand uses the house format', () => {
  assert.equal(formatMoney('1250', 'ZAR'), 'R1,250.00');
  assert.equal(formatMoney('1250.5', 'USD'), 'USD 1,250.50');
  assert.equal(formatMoney('0.00012345', 'BTC'), 'BTC 0.00012345'); // real decimals are never rounded away
  assert.equal(formatMoney('1234567.10', 'ZAR'), 'R1,234,567.10');
  assert.equal(String(new Money(1250, 'ZAR')), 'R1,250.00');
});

test('errors keep code and field but never the value', () => {
  const body = '[{"code":"INVALID_ACCOUNT_NUMBER","description":"Bad account","attrCode":"account.accountNumber","attrValue":"1234567890"}]';
  const error = new SynqtAPIError(406, parseErrors(body));
  assert.deepEqual(error.errors, [{ code: 'INVALID_ACCOUNT_NUMBER', field: 'account.accountNumber', description: 'Bad account' }]);
  assert.equal(error.message, 'SYNQT HTTP 406: INVALID_ACCOUNT_NUMBER (account.accountNumber)');
  assert.ok(!JSON.stringify(error).includes('1234567890'));
  assert.deepEqual(parseErrors('<html>'), []);
});

test('orbit dots follow the Lottie keyframes', () => {
  const near = (actual, expected, tolerance = 0.001) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} vs ${expected}`);
  near(ease(0), 0);
  near(ease(0.5), 0.5);
  near(ease(1), 1);
  near(orbitDot(0)[1], 40);
  near(orbitDot(96.05)[0], 360, 0.01); // one full turn
  near(orbitDot(130)[1], 0); // resting in the hub
  near(orbitDot(-7.2)[1], 35.51, 0.05); // aqua runs 7.2 frames behind
});

test('return url matches its path only', () => {
  assert.ok(isReturn('https://x.io/return?idPayin=1', 'https://x.io/return'));
  assert.ok(!isReturn('https://x.io/returned', 'https://x.io/return'));
  assert.ok(!isReturn('https://evil.io/return', 'https://x.io/return'));
});

test('create sends the method with SYNQT headers', async () => {
  const { fetch, sent } = fakeFetch(() => [200, '{"paymentMethodResponse":{"paymentMethodCode":"CAPITEC_PAY","reference":"R1"}}']);
  const result = await payin('order-1', fetch).create({ paymentMethodCode: 'CAPITEC_PAY', phoneNumber: '0821234567', customerName: { lastName: 'Doe' } });
  const [req] = sent;
  assert.equal(req.method, 'POST');
  assert.equal(req.url, 'https://api.sandbox.synqt.io/payins/order-1');
  assert.equal(req.headers['X-API-Version'], '2');
  assert.equal(req.headers.Authorization, 'Bearer a.b+c');
  assert.deepEqual(req.json.paymentRequested, { money: { amount: 12.3, currencyCode: 'ZAR' } });
  assert.equal(req.json.paymentMethod.paymentMethodCode, 'CAPITEC_PAY');
  assert.ok(!('customerIp' in req.json));
  assert.equal(result.type, 'instructions');
  assert.equal(result.paymentMethod.reference, 'R1');
});

test('create checks the method before sending anything', async () => {
  const { fetch, sent } = fakeFetch(() => [200, '{}']);
  await assert.rejects(payin('order-1', fetch).create({ paymentMethodCode: 'CAPITEC_PAY', phone: '1' }), SynqtArgumentError);
  assert.equal(sent.length, 0);
});

test('a 409 retry fetches the existing payin, but only for the same method', async () => {
  const { fetch } = fakeFetch((request) =>
    request.method === 'POST' ? [409, '[{"code":"PAYIN_ALREADY_EXISTS"}]'] : [200, '{"paymentMethodResponse":{"paymentMethodCode":"CAPITEC_PAY"}}']);
  const payment = payin('order-1', fetch);
  assert.equal((await payment.create({ paymentMethodCode: 'CAPITEC_PAY', phoneNumber: '0821234567' })).type, 'instructions');
  await assert.rejects(
    payment.create({ paymentMethodCode: 'ZAPPER_QR', emailAddress: 'a@b.co', customerName: { firstName: 'A', lastName: 'B' } }),
    (error) => error instanceof SynqtAPIError && error.errors[0].code === 'PAYIN_ALREADY_STARTED',
  );
});

test('options parse and a refusal keeps its codes', async () => {
  const { fetch, sent } = fakeFetch((request) =>
    request.url.endsWith('availablePaymentOptions')
      ? [200, '{"data":[{"paymentMethodCode":"PAYSHAP","paymentOperators":[{"code":"B","name":"Banco Ñ"}]}]}']
      : [401, '{"code":"TOKEN_EXPIRED"}']);
  const payment = payin('order-1', fetch);
  assert.equal((await payment.availablePaymentOptions()).at(0).operators.at(0).name, 'Banco Ñ');
  assert.deepEqual(sent[0].json, { money: { amount: 12.3, currencyCode: 'ZAR' } });
  await assert.rejects(payment.status(), (error) => error.httpCode === 401 && error.errors[0].code === 'TOKEN_EXPIRED');
});

/** The sheet's bank list for Pay offline, with SYNQT answering each request with the next of `statuses` (the last repeats). */
async function sheetBanks(statuses, signal, onRequest = () => {}) {
  let requests = 0;
  const { fetch } = fakeFetch(() => {
    onRequest();
    const status = statuses[Math.min(requests++, statuses.length - 1)];
    return [status, status === 200 ? '{"data":[{"paymentMethodCode":"OFFLINE","paymentOperators":[{"code":"ABSA","name":"Absa"}]}]}' : '{"errors":[]}'];
  });
  const loaded = await payin('order-1', fetch)._sheetOperators(methodForms.find((form) => form.code === 'OFFLINE'), signal, 1);
  return { loaded, requests };
}

test('the bank list is tried twice more after a server error, then loads', async () => {
  const { loaded, requests } = await sheetBanks([503, 500, 200]);
  assert.deepEqual(loaded.map((operator) => operator.code), ['ABSA']);
  assert.equal(requests, 3);
});

test('three server errors mean the bank list could not be loaded', async () => {
  assert.deepEqual(await sheetBanks([503]), { loaded: undefined, requests: 3 });
});

test('a refusal of the bank list is not retried', async () => {
  assert.deepEqual(await sheetBanks([403]), { loaded: undefined, requests: 1 });
});

test('closing the sheet stops the bank list retries', async () => {
  const controller = new AbortController();
  assert.deepEqual(await sheetBanks([503], controller.signal, () => controller.abort()), { loaded: undefined, requests: 1 });
});

test('app links are judged on the scheme the browser parses, so control characters and tabs cannot hide javascript:', () => {
    const { isUnsafeLink } = SDK.internals;
    for (const link of ['javascript:alert(1)', ' JavaScript:alert(1)', '\u0001javascript:alert(1)', '\u001fjavascript:alert(1)',
        'java\tscript:alert(1)', 'java\nscript:alert(1)', 'data:text/html,x', 'vbscript:x', 'file:///etc/hosts', 'not a url']) {
        assert.equal(isUnsafeLink(link), true, JSON.stringify(link));
    }
    for (const link of ['https://pay.example/x', 'zapper://pay?x=1', 'snapscan://x', 'upi://pay?pa=x@bank']) {
        assert.equal(isUnsafeLink(link), false, link);
    }
});
