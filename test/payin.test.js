const assert = require('node:assert/strict');
const { test } = require('node:test');
const SDK = require('../src/synqt.js');

const { isReturn, formatMoney, Money, parseErrors, SynqtAPIError, SynqtArgumentError, Synqt, IncomingPaymentsApi, PaymentStatus, nextStep, redirect, isFinal, payerMessage, validatePayin, ease, orbitDot, methodForms } = { ...SDK, ...SDK.internals };

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

const checkout = (id = 'order-1', fetch = undefined) =>
  new Synqt('sandbox', fetch && { fetch }).checkout({
    token: 'a.b+c', payinID: id, money: new Money('12.30', 'ZAR'), returnURL: 'https://x.io/return', callbackURL: 'https://x.io/cb',
  });

const api = (fetch) => IncomingPaymentsApi.create(new Synqt('sandbox', { fetch }), 'a.b+c');

const capitec = {
  paymentRequested: { money: new Money('12.30', 'ZAR') },
  paymentMethod: { paymentMethodCode: 'CAPITEC_PAY', phoneNumber: '0821234567' },
  returnUrl: 'https://x.io/return',
};

test('payment app url encodes params', () => {
  assert.equal(
    checkout().paymentAppURL({ merchantCode: 'MID', extra: { emailAddress: 'a@b.co' } }),
    'https://payment.sandbox.synqt.io/?merchantCode=MID&idPayin=order-1&token=a.b%2Bc&amount=12.3' +
      '&currencyCode=ZAR&callbackUrl=https%3A%2F%2Fx.io%2Fcb&returnUrl=https%3A%2F%2Fx.io%2Freturn&emailAddress=a%40b.co',
  );
});

test('payment app offers a method and editable prefill', () => {
  const url = checkout().paymentAppURL({ merchantCode: 'MID', paymentMethodCode: 'CAPITEC_PAY', prefill: { phoneNumber: '+27821234567' } });
  assert.ok(url.endsWith('&paymentMethodCode=CAPITEC_PAY&optionsAvailable=true&phoneNumber=%2B27821234567&allowCustomerDataChange=true'));
  assert.ok(!checkout().paymentAppURL({ merchantCode: 'MID' }).includes('optionsAvailable'));
  assert.ok(checkout().paymentAppURL({ merchantCode: "it's (ok)!" }).includes("merchantCode=it%27s%20%28ok%29%21"));
});

test('rejects an unsafe payin ID, a malformed amount, an unknown environment and a non-https return URL', () => {
  assert.throws(() => checkout('../x'), SynqtArgumentError);
  assert.throws(() => new Money('12,30', 'ZAR'), SynqtArgumentError);
  assert.throws(() => new Synqt('prod'), SynqtArgumentError);
  assert.throws(() => new Synqt('sandbox').checkout({ token: 't', payinID: 'o-1', money: { amount: '12,30', currencyCode: 'ZAR' }, returnURL: 'https://x.io' }), SynqtArgumentError);
  const withReturn = (returnURL) => () => new Synqt('sandbox').checkout({ token: 't', payinID: 'o-1', money: { amount: 1, currencyCode: 'ZAR' }, returnURL });
  assert.throws(withReturn('http://x.io/return'), SynqtArgumentError);
  assert.throws(withReturn('not a url'), SynqtArgumentError);
  assert.throws(withReturn(undefined), SynqtArgumentError);
});

test('a payin request has the Java SDK shape, and callbackUrl is optional', () => {
  validatePayin({ ...capitec, paymentRequested: { money: { amount: 12.3, currencyCode: 'ZAR' }, segmentCode: 'S1' }, customerIp: '10.0.0.1' });
  const refused = (payin, path) => assert.throws(() => validatePayin(payin), (error) => error instanceof SynqtArgumentError && error.path === path);
  refused({ ...capitec, returnUrl: undefined }, 'returnUrl');
  refused({ ...capitec, paymentRequested: {} }, 'paymentRequested.money');
  refused({ ...capitec, paymentRequested: { money: { amount: 1 } } }, 'paymentRequested.money.currencyCode');
  refused({ ...capitec, callbackURL: 'https://x.io/cb' }, 'callbackURL'); // the spec's names, not the checkout's
  refused({ ...capitec, paymentMethod: undefined }, 'paymentMethod');
  assert.throws(() => validatePayin({ ...capitec, paymentMethod: { paymentMethodCode: 'CAPITEC_PAY', phone: '1' } }), SynqtArgumentError);
});

test('the accepted response is told apart by the field SYNQT sent', () => {
  const redirected = {
    paymentRequested: { money: { amount: 12.3, currencyCode: 'ZAR' } },
    redirectTo: { method: 'POST', url: 'https://p.io', data: '{"k":"v","n":1}' },
  };
  assert.deepEqual(redirect(redirected), { method: 'POST', url: 'https://p.io', data: '{"k":"v","n":1}', formData: { k: 'v', n: '1' } });
  assert.equal(nextStep(redirected), undefined);

  const instructed = { paymentMethodResponse: { paymentMethodCode: 'PAYSHAP', reference: 'REF1' } };
  assert.equal(nextStep(instructed).reference, 'REF1');
  assert.equal(redirect(instructed), undefined);
});

test('the next step is read from the fields each method has', () => {
  const offline = nextStep({ paymentMethodResponse: {
    paymentMethodCode: 'OFFLINE', reference: '', moneyRequired: { amount: 12.35, currencyCode: 'ZAR' }, account: { accountNumber: '0000000000' },
  } });
  assert.equal(offline.reference, undefined); // empty counts as missing
  assert.equal(String(offline.amountToPay), 'R12.35');
  assert.equal(offline.payInto.accountNumber, '0000000000');
  // CAPITEC_PAY's account is the payer's own, never one to pay into.
  assert.equal(nextStep({ paymentMethodResponse: { paymentMethodCode: 'CAPITEC_PAY', account: { accountNumber: '1' } } }).payInto, undefined);
  const zapper = nextStep({ paymentMethodResponse: { paymentMethodCode: 'ZAPPER_QR', zapperQrDeepLink: 'zapper://x', qrCode: 'https://q.io/1.png' } });
  assert.deepEqual([zapper.appLink, zapper.qrCodeImageURL], ['zapper://x', 'https://q.io/1.png']);
  // A method this SDK version doesn't know uses the generic field names, and never gets payInto.
  const unknown = nextStep({ paymentMethodResponse: { paymentMethodCode: 'BRAND_NEW', deepLink: 'app://pay', account: { accountNumber: '1' } } });
  assert.deepEqual([unknown.appLink, unknown.payInto], ['app://pay', undefined]);
});

test('a payin detail is read as SYNQT sent it, settlement included', async () => {
  const body = {
    paymentRequested: { money: { amount: 100.5, currencyCode: 'ZAR' } },
    fee: { amount: 2, currencyCode: 'ZAR' },
    process: { status: 'FAILED', isTest: true, createdAt: '2026-10-26T10:00:00Z', failureReasons: { failureReasonCode: 'ENTITY_EXPIRED', message: 'Expired' } },
    paymentMethodResponse: { paymentMethodCode: 'CAPITEC_PAY' },
    settlement: { paymentMethodCode: 'CRYPTO_TRANSFER', paymentOperatorCode: 'OP', account: { accountNumber: 'A1' } },
    customer: { idCustomer: 'C1' },
  };
  const { fetch, sent } = fakeFetch(() => [200, JSON.stringify(body)]);
  const detail = await api(fetch).getPayin('order-1');
  assert.equal(sent[0].url, 'https://api.sandbox.synqt.io/payins/order-1');
  assert.deepEqual(detail, body);
  assert.equal(detail.process.status, PaymentStatus.FAILED);
  assert.ok(isFinal(detail));
  assert.equal(payerMessage(detail.process.failureReasons), 'The payment was not approved in time. Start a new payment to try again.');
  assert.equal(payerMessage(undefined), payerMessage({ failureReasonCode: 'NEW_CODE' }));
});

test('an unknown status is not final', () => {
  assert.equal(isFinal({ process: { status: 'ON_HOLD' } }), false);
  assert.equal(isFinal({}), false);
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

test('createPayin posts the payin with SYNQT headers and returns what SYNQT accepted', async () => {
  const accepted = { paymentRequested: { money: { amount: 12.3, currencyCode: 'ZAR' } }, paymentMethodResponse: { paymentMethodCode: 'CAPITEC_PAY', reference: 'R1' } };
  const { fetch, sent } = fakeFetch(() => [201, JSON.stringify(accepted)]);
  assert.deepEqual(await api(fetch).createPayin('order-1', capitec), accepted);
  const [req] = sent;
  assert.equal(req.method, 'POST');
  assert.equal(req.url, 'https://api.sandbox.synqt.io/payins/order-1');
  assert.equal(req.headers['X-API-Version'], '2');
  assert.equal(req.headers.Authorization, 'Bearer a.b+c');
  assert.deepEqual(req.json, {
    paymentRequested: { money: { amount: 12.3, currencyCode: 'ZAR' } },
    paymentMethod: { paymentMethodCode: 'CAPITEC_PAY', phoneNumber: '0821234567' },
    returnUrl: 'https://x.io/return',
  });
});

test('createPayin checks the id, the return URL and the payin before sending anything', async () => {
  const { fetch, sent } = fakeFetch(() => [200, '{}']);
  await assert.rejects(api(fetch).createPayin('order-1', { ...capitec, paymentMethod: { paymentMethodCode: 'CAPITEC_PAY', phone: '1' } }), SynqtArgumentError);
  await assert.rejects(api(fetch).createPayin('../x', capitec), SynqtArgumentError);
  await assert.rejects(api(fetch).createPayin('order-1', { ...capitec, returnUrl: 'http://x.io/return' }), SynqtArgumentError);
  assert.equal(sent.length, 0);
});

test('a retry of the same payin returns the existing one', async () => {
  const existing = {
    paymentRequested: { money: { amount: 12.3, currencyCode: 'ZAR' } },
    process: { status: 'PROCESSING' },
    paymentMethodResponse: { paymentMethodCode: 'CAPITEC_PAY', reference: 'R1' },
  };
  const { fetch, sent } = fakeFetch((request) => (request.method === 'POST' ? [409, '[{"code":"PAYIN_ALREADY_EXISTS"}]'] : [200, JSON.stringify(existing)]));
  const accepted = await api(fetch).createPayin('order-1', capitec);
  assert.deepEqual(accepted, { paymentRequested: existing.paymentRequested, paymentMethodResponse: existing.paymentMethodResponse });
  assert.equal(nextStep(accepted).reference, 'R1');
  assert.deepEqual([sent[1].method, sent[1].url], ['GET', 'https://api.sandbox.synqt.io/payins/order-1']);
});

test('a retry with another method is refused', async () => {
  const { fetch } = fakeFetch((request) => (request.method === 'POST' ? [409, '[]'] : [200, '{"paymentMethodResponse":{"paymentMethodCode":"FNB_DIRECT_EFT"}}']));
  await assert.rejects(
    api(fetch).createPayin('order-1', capitec),
    (error) => error instanceof SynqtAPIError && error.httpCode === 409 && error.errors[0].code === 'PAYIN_ALREADY_STARTED',
  );
});

test('a refusal keeps its codes but not what the payer typed', async () => {
  const { fetch } = fakeFetch(() => [406, '[{"code":"INVALID_PHONE_NUMBER","attrCode":"phoneNumber","attrValue":"0821234567","description":"bad"}]']);
  await assert.rejects(api(fetch).createPayin('order-1', capitec), (error) => {
    assert.deepEqual(error.errors, [{ code: 'INVALID_PHONE_NUMBER', field: 'phoneNumber', description: 'bad' }]);
    assert.ok(!error.message.includes('0821234567') && !JSON.stringify(error).includes('0821234567'));
    return true;
  });
});

test('options, accounts and the external reference go to their endpoints', async () => {
  const { fetch, sent } = fakeFetch((request) =>
    request.url.endsWith('availablePaymentOptions')
      ? [200, '{"data":[{"paymentMethodCode":"PAYSHAP","paymentOperators":[{"code":"B","name":"Banco Ñ"}]}]}']
      : request.url.endsWith('/accounts') ? [200, '{"accountPayer":{"accountNumber":"0000000000"}}'] : [401, '{"code":"TOKEN_EXPIRED"}']);
  const payins = api(fetch);
  const options = await payins.payinAvailablePaymentOptions({ money: new Money('12.30', 'ZAR'), segmentCode: 'S1' });
  assert.equal(options.data[0].paymentOperators[0].name, 'Banco Ñ');
  assert.deepEqual(sent[0].json, { money: { amount: 12.3, currencyCode: 'ZAR' }, segmentCode: 'S1' });
  assert.equal((await payins.getPayinAccounts('order-1')).accountPayer.accountNumber, '0000000000');
  await assert.rejects(payins.setPayinExternalReference('order-1', 'UTR1'), (error) => error.httpCode === 401 && error.errors[0].code === 'TOKEN_EXPIRED');
  assert.deepEqual([sent[2].url, sent[2].json], ['https://api.sandbox.synqt.io/payins/order-1/!setExternalReference', { reference: 'UTR1' }]);
  await assert.rejects(payins.setPayinExternalReference('order-1', ''), SynqtArgumentError);
});

test('a checkout without a callback URL leaves it out of the Payment Web App link', () => {
  const order = new Synqt('sandbox').checkout({ token: 't', payinID: 'o-1', money: { amount: '1.00', currencyCode: 'ZAR' }, returnURL: 'https://x.io/r' });
  assert.equal(String(order.money), 'R1.00');
  assert.ok(!order.paymentAppURL({ merchantCode: 'MID' }).includes('callbackUrl'));
});

/** The sheet's bank list for Pay offline, with SYNQT answering each request with the next of `statuses` (the last repeats). */
async function sheetBanks(statuses, signal, onRequest = () => {}) {
  let requests = 0;
  const { fetch } = fakeFetch(() => {
    onRequest();
    const status = statuses[Math.min(requests++, statuses.length - 1)];
    return [status, status === 200 ? '{"data":[{"paymentMethodCode":"OFFLINE","paymentOperators":[{"code":"ABSA","name":"Absa"}]}]}' : '{"errors":[]}'];
  });
  const loaded = await checkout('order-1', fetch)._sheetOperators(methodForms.find((form) => form.code === 'OFFLINE'), signal, 1);
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
