# SYNQT Web SDK

Take payments (SYNQT payins) in a web page. The SDK can show a Synqt-branded payment sheet that asks the payer for exactly the details their payment method needs, send the payment, and tell you what to do next. You don't build or maintain any payment forms.

It covers SYNQT API version 2 (spec 2.84): the direct API for all payment methods except CARD, and the hosted Payment Web App. It is the web counterpart of SYNQT's [Android](https://github.com/synqt-pay/synqt-android), [iOS](https://github.com/synqt-pay/synqt-ios) and [Flutter](https://github.com/synqt-pay/synqt-flutter) SDKs: the same API, the same payment sheet, the same field rules and the same wording.

This SDK has no card fields. It never collects, sees or sends a card number, which keeps it, and the pages that use it, out of PCI DSS scope for card data.

## Requirements

- A current browser: Chrome, Edge, Firefox or Safari from 2023 on (it uses `<dialog>`, `:has()`, `inert` and `AbortSignal.timeout`).
- One plain JavaScript file, `synqt.js`, with no build step, no dependencies and no modules. It sets one global, `SynqtSDK`.
- A backend of your own that mints a SYNQT token for each order. The page never holds the merchant's private key or secret key.
- **SYNQT's API must accept calls from your page's origin (CORS).** Stable allows any origin but does not yet list the `Authorization` header the SDK sends, which browsers require (see [Before merchants use this](#before-merchants-use-this)). Until SYNQT changes that, pass a `fetch` that sends the calls through your backend; see [Set up](#1-set-up).

## Install

From npm:

```
npm install @synqt/js
```

The package is `synqt.js`, the `fonts` folder beside it, `LICENSE`, `NOTICE`, `CHANGELOG.md` and `THIRD_PARTY_NOTICES.md`. `synqt.js` is a classic script, not a module, so a bundler can't import it. Serve the package folder (or copy `synqt.js` and `fonts/` together into your static files, for example in your build's copy step) and load `synqt.js` with a script tag. It finds its fonts from its own URL, so keep `fonts/` next to it:

```html
<script src="/node_modules/@synqt/js/synqt.js"></script>
```

### From a CDN

jsDelivr serves the npm package as it is, so the fonts load from the same folder as `synqt.js` with nothing to copy:

```html
<script src="https://cdn.jsdelivr.net/npm/@synqt/js@0.1.0/synqt.js"
        integrity="sha384-<hash>"
        crossorigin="anonymous"></script>
```

Pin the exact version, never a range or `@latest`, and add Subresource Integrity so the browser refuses a file that has changed. To get the hash, either press the SRI button next to `synqt.js` on the package's jsDelivr page and copy the `integrity` value, or compute it from the published file yourself:

```
npm pack @synqt/js@0.1.0
tar -xzf synqt-js-0.1.0.tgz package/synqt.js
echo "sha384-$(openssl dgst -sha384 -binary package/synqt.js | openssl base64 -A)"
```

If your page has a Content Security Policy, allow `https://cdn.jsdelivr.net` in `script-src` and `font-src`.

## Integrating the SDK, step by step

Steps 1 and 2 happen once; steps 3 to 7 happen for every order.

### 1. Add the SDK to your project

Install the package (see [Install](#install)), or copy `synqt.js` and the `fonts` folder next to each other on your site. Then load it with a plain script tag before your own code:

```html
<script src="/js/synqt.js"></script>
<script>
  const { Synqt, Money } = SynqtSDK;
</script>
```

The SDK brings its own strings, and loads Instrument Sans from the `fonts` folder beside `synqt.js`. If the fonts can't be loaded (a page opened from disk, or a strict Content Security Policy without `font-src 'self'`), the sheet uses the system font instead.

Sites that ship the SDK must include the Phosphor Icons MIT notice and the Instrument Sans OFL notice in `THIRD_PARTY_NOTICES.md`, for example on a credits page.

### 2. Add a token endpoint to your backend

SYNQT calls need a short-lived token, and minting one needs the merchant's private key, so this runs on your server only. For each order, your backend:

1. Creates a payin ID that is new for this attempt, such as `order-1042-1` (letters, digits, `_` and `-`, at most 250 characters).
2. Calls `POST /auth-tokens-by-action` with header `X-API-Version: 2` and this body, signed with SHA256withRSA over the exact bytes sent, base64-encoded in an `X-SIGNATURE` header:

   ```json
   {"merchantCode":"MID","validitySecs":1800,"action":"PAYIN_CREATE","idPayment":"order-1042-1",
    "money":{"amount":1250.00,"currencyCode":"ZAR"},"timestamp":1793625059}
   ```

3. Returns the `token` from the response, the payin ID and the amount to the page.

`PAYIN_CREATE` covers everything the sheet and the Payment Web App need. To show the merchant's name in the sheet's summary, use `POST /auth-tokens` instead, with the same signature and an `operations` list: `POST /payins/!availablePaymentOptions`, `POST /payins/order-1042-1`, `GET /payins/order-1042-1` and `GET /merchant-info`. The demos repo's `scripts/sandbox-token.sh` is a working example of the signing, in shell.

The `money` in the token locks it to that amount, so the page can't change it. Never return a token with wildcard operations to a browser.

### 3. Create the payin in the page

When the payer clicks your checkout button, fetch a token from your backend, then:

```js
const payin = new Synqt('sandbox').payin({
  token: response.token,
  payinID: response.payinID,
  money: new Money('1250.00', 'ZAR'), // the same amount and currency as the token
  returnURL: 'https://shop.example.com/payment/return', // https, see "Other ways to pay"
  callbackURL: 'https://shop.example.com/synqt/callback', // your backend, step 7
});
```

This makes no network call. It throws `SynqtArgumentError` if the payin ID is malformed. Use `'sandbox'` while testing and `'live'` for real payments. Give amounts as text (`'1250.00'`) so they are never rounded.

### 4. Choose the payment method

Ask SYNQT what this merchant can take for this amount, and keep the ones the sheet supports:

```js
const offered = await payin.availablePaymentOptions();
const supported = new Set(Synqt.directPaymentMethods.map((m) => m.code));
const choices = offered.filter((o) => supported.has(o.code));
```

Show `choices` in your own checkout, using `option.name` as the payer-facing name, and let the payer pick one. If your checkout only offers one method, skip this step and pass its code, such as `'CAPITEC_PAY'`, in step 5.

### 5. Show the payment sheet

```js
const result = await payin.presentPaymentSheet({
  paymentMethodCode: methodCode,
  prefill: { emailAddress: email, 'customerName.firstName': firstName, 'customerName.lastName': lastName },
  onPresented: () => {},       // the sheet is on screen
  onPaymentStarted: () => {},  // details sent to SYNQT: start showing progress, step 6
});
if (result === null) {
  // the payer closed the sheet without paying
} else if (result.type === 'instructions') {
  // the sheet already showed the next step; go to step 6
} else if (result.type === 'redirect') {
  // send the payer to result.url, see below
}
```

Pass in `prefill` whatever your page already knows about the payer. The sheet hides those fields, and pays straight away when nothing mandatory is left to ask. See [The payment sheet](#the-payment-sheet) for what it shows.

A `redirect` means the payer finishes on a bank's page. For `httpMethod` GET, open `url` (`location.assign(result.url)`, or a new tab). For POST, submit `formData` to it as an HTML form: build a `<form method="post" action="${url}">` with one hidden input per entry and call `submit()`.

To skip the sheet and use SYNQT's hosted Payment Web App instead, call `presentPaymentApp` here; see [Other ways to pay](#other-ways-to-pay).

### 6. Show the payer where the payment stands

Once `onPaymentStarted` has run (or the Payment Web App has opened), poll `payin.status()` every few seconds until it is final:

```js
const s = await payin.status();
if (s.status === 'SUCCESS') { /* show "Paid", but fulfil only from step 7 */ }
else if (s.status === 'FAILED' || s.status === 'REFUSED') showError(s.failureReason?.payerMessage);
// PROCESSING or UNKNOWN: keep polling
```

Stop polling when the payer leaves the page or `s.isFinal` is true. Before the payment is created, `status()` throws `SynqtAPIError` with HTTP 410.

### 7. Confirm the payment on your backend

SYNQT posts `{"idEntity":"order-1042-1"}` to your `callbackURL` on every status change. Reply 200 at once, then call `GET /payins/order-1042-1` from your backend and fulfil the order only when `process.status` is `SUCCESS` and the amount matches. The callback carries no status and no signature, and the page's view of the status is not proof of payment.

### 8. Go live

Switch to `'live'` and your live merchant credentials, test one real payment per method you offer, and work through [Security and compliance](#security-and-compliance) and [Before merchants use this](#before-merchants-use-this) below.

## The payment sheet

`presentPaymentSheet` shows a modal dialog: a bottom sheet on narrow screens, a centred card from 600 pixels wide. It sits in a shadow root, so your page's CSS doesn't change it and its CSS doesn't leak into your page. It has:

- the Synqt wordmark, an order summary (amount due, payment method, reference, and the merchant name if the token allows `GET /merchant-info`)
- one plain-language field per detail the method needs, grouped into sections, with optional fields marked. A section with any mandatory field in it is mandatory as a whole, which is stricter than SYNQT's spec
- the right on-screen keyboard and browser autofill for each field, and checks on length and format before anything is sent
- a menu of the banks or providers SYNQT returns for this payin and payment method, instead of raw operator codes. An optional bank field is hidden when SYNQT lists none, as on Capitec Pay, Absa Pay, FNB Pay and Nedbank Pay
- a Pay button with the amount, and a processing state with the Synqt Orbit loader while the request runs. The loader is drawn on a canvas from the designer's Lottie file, so the SDK needs no animation library; it holds still when the browser asks for reduced motion. The sheet closes only from its close button or Escape, never by clicking outside it, and neither works while a payment is being sent

Fields the page prefills are hidden when their value passes its checks, and a section goes when all of its fields are filled in; once the first and last name are filled in, the optional title, middle name and suffix go too. When every mandatory field of a method is filled in this way, the sheet skips the form and pays straight away, showing only the processing screen. If SYNQT refuses a value, the form appears with the error so the payer can correct it.

When SYNQT accepts a payment the payer finishes in another app (Zapper, SnapScan, UPI and others), the sheet stays open and shows the next step: the QR code to scan, the amount (or the exact amount SYNQT requires), the reference, and a live "Time left to pay" countdown. On a phone or tablet it also offers an "Open Zapper" button, which opens the method's link in a new tab (the app takes it if it is installed). On a computer the QR code is the way to pay, so the button only appears when SYNQT sent no QR code. Unlike the apps, the web sheet never opens the method's app by itself, because browsers block windows a page opens without a click. For Pay offline the next step is "How to pay": the one-time reference in its own card at the top, then the bank account to transfer to and the amount, with copy buttons, then a four-point "Before you pay" notice. The notice is draft wording and needs sign-off from SYNQT's compliance owner before release. Done, or closing the sheet, returns the result. Pages with their own screens get the same details from the result's `nextStep`.

If SYNQT refuses the payment, the reason appears under the field it is about, so the payer can fix it and try again. Screen readers hear every error as it appears. The sheet follows the device's light or dark setting, and its text sizes follow the browser's.

What the page hears from the sheet, in order:

1. `onPresented` runs once the sheet is on screen. Before that the SDK fetches the bank list and merchant name, so there is a short gap after the call.
2. `onPaymentStarted` runs each time the payer's details pass the sheet's checks and go to SYNQT. From here `payin.status()` has something to report.
3. The promise resolves once the sheet has closed: `null` if the payer closed it without paying, otherwise the result.

Pass an `AbortSignal` as `signal` to close the sheet from your code. It then resolves with `null` even if SYNQT already accepted the payment, so check `payin.status()` after an abort.

## Other ways to pay

**Build the payment method yourself.** A payment method is a plain object with its `paymentMethodCode` and the fields SYNQT's spec lists for it. `create` checks it against the spec before sending and throws `SynqtArgumentError` naming the missing or unexpected field (`error.path`):

```js
const result = await payin.create({
  paymentMethodCode: 'CAPITEC_PAY',
  phoneNumber: '0821234567',
  customerName: { lastName: 'Doe' },
});
```

Retrying `create` after a network failure is safe: if SYNQT already has the payin, the SDK fetches it instead of creating another.

**Use SYNQT's hosted Payment Web App** when you don't want any payment UI in the page:

```js
payButton.onclick = async () => {
  const result = await payin.presentPaymentApp({
    merchantCode: 'MID',
    paymentMethodCode: 'CAPITEC_PAY',        // optional: open on this method
    prefill: { phoneNumber: '+27821234567' }, // optional: the payer can still edit it
  });
  // result.type is 'returned' (result.url carries what the Payment Web App added) or 'closed'
  const status = await payin.status(); // either way, ask where the payment stands
};
```

`presentPaymentApp` opens the Payment Web App in a popup window and resolves when the payer reaches `returnURL` (same origin and path, any query) or closes the popup. Call it straight from a click handler, or the browser blocks the popup and it throws `SynqtArgumentError`. The SDK can only see the popup reach `returnURL` when that URL is on your page's origin; otherwise the popup stays open on it until the payer closes it. To use the whole tab instead, `openPaymentApp(...)` sends this tab to the Payment Web App, and the payer comes back through `returnURL`. The `returnURL` must be https either way.

`paymentMethodCode` opens the Payment Web App on that method, and the payer can still pick another. `prefill` uses the Payment Web App's parameter names, not the sheet's field paths: `phoneNumber`, `emailAddress`, `accountName`, `accountNumber`, `upiId`, `idCustomer`, `governmentId`, `passportNumber`, `postalCode`, `city`, `district`. The SDK does not check these values. To lock the method or the details instead, leave these out and pass the raw parameters in `extra`.

## API reference

Each call needs a token that allows its SYNQT operation: a `PAYIN_CREATE` token covers creating the payin, its payment options and its status, while `paymentOperators` and the merchant name in the sheet need operations your backend adds when it mints the token.

### 1. Set up

| Call | What it does |
|---|---|
| `new Synqt(environment, { fetch })` | The entry point for one environment: `'sandbox'`, `'live'` or `'stable'`. `fetch` is optional and replaces the browser's, for example to send calls through your own backend, add logging or change the 30 second timeout. |
| `environments` | The base URLs (`apiBaseURL`, `paymentAppBaseURL`) per environment, for your backend's own calls such as minting tokens. |
| `synqt.payin({ token, payinID, money, returnURL, callbackURL })` | One order's `Payin`. `payinID` must match the token. Throws `SynqtArgumentError` for a malformed ID. |
| `new Money(amount, currencyCode)` | An amount as decimal text, never rounded. `String(money)` is the house format, such as `R1,250.00`; `money.plainAmount` drops trailing zeros. |
| `payin.id`, `payin.money` | The order's payin ID and amount. |

| Environment | API | Use |
|---|---|---|
| `'sandbox'` | `api.sandbox.synqt.io` | Testing. The amount decides the outcome (see SYNQT's sandbox docs). |
| `'live'` | `api.synqt.io` | Real payments. |
| `'stable'` | `api.stable.aopay.io` | SYNQT's internal development platform. Not for merchants. |

A `fetch` that sends every call through your backend, which forwards it to SYNQT with the same method, headers and body:

```js
const synqt = new Synqt('live', {
  fetch: (url, init) => fetch(url.replace('https://api.synqt.io', '/synqt-proxy'), init),
});
```

### 2. Choose a payment method

| Call | What it does |
|---|---|
| `payin.availablePaymentOptions({ segmentCode })` | The methods SYNQT allows for this merchant and amount, each `{ code, name, operators, segmentCode }`. `name` is the payer-facing name, undefined for methods the sheet doesn't support. |
| `Synqt.directPaymentMethods` | The methods the sheet can collect details for, each `{ code, name }`. |
| `synqt.paymentOperators({ token })` | Every bank and provider SYNQT knows, each `{ code, name, externalProviders }`. Needs a token with `GET /payment-operators`, which `PAYIN_CREATE` does not give. |

### 3. Take the payment

| Call | What it does |
|---|---|
| `payin.presentPaymentSheet({ paymentMethodCode, prefill, customerIP, onPresented, onPaymentStarted, signal })` | The Synqt payment sheet. Resolves with the `create` result once it has closed, or `null` when the payer closed it without paying. |
| `payin.create(paymentMethod, { customerIP })` | Your own UI: send a payment method object you built. |
| `validatePaymentMethod(paymentMethod)` | The check `create` runs, for your own forms. |
| `payin.presentPaymentApp({ merchantCode, paymentMethodCode, prefill, extra, onPresented, signal })` | SYNQT's hosted Payment Web App in a popup. Resolves `{ type: 'returned', url }` or `{ type: 'closed' }`. |
| `payin.openPaymentApp({ merchantCode, paymentMethodCode, prefill, extra })` | Sends this tab to the Payment Web App. |
| `payin.paymentAppURL({ merchantCode, paymentMethodCode, prefill, extra })` | The Payment Web App's URL, for an iframe or link of your own. |

`customerIP` is checked against the merchant's IP allow and deny lists, so pass the payer's real IP if your backend has it.

### 4. After the payment is created

| Result | What it means |
|---|---|
| `{ type: 'redirect', httpMethod, url, formData }` | Send the payer to `url`. GET: open it. POST: submit `formData` to it as a form. |
| `{ type: 'instructions', paymentMethod, nextStep }` | The payer finishes elsewhere. `paymentMethod` is SYNQT's `paymentMethodResponse` as sent; `nextStep` gathers what to show. The sheet already shows it. |
| `nextStep` | `appLink` (open on this device), `qrCodeImageURL` (a temporary image link) or `qrCodeData` (draw your own), `amountToPay` (a `Money`; if set, the payer must pay exactly this), `reference`, `expiresAt` (ISO 8601) and `payInto` (Pay offline: the account to transfer to, with `accountName`, `accountNumber`, `accountType`, `bankName`, `bankCode` and `bankBranch`). |
| `payin.setExternalReference(reference)` | Sends the payer's bank or UTR reference, for methods that need it. |

### 5. Check the outcome

| Call or field | What it is |
|---|---|
| `payin.status()` | This payin's status, at any time once a payment has been sent. HTTP 410 means SYNQT has no payin with this ID yet. |
| `status`, `isFinal` | `'PROCESSING'`, `'SUCCESS'`, `'FAILED'`, `'REFUSED'`, or `'UNKNOWN'` for one this SDK version doesn't know (treat it like processing). `isFinal` is true for success, failed and refused. |
| `requested`, `fee` | `Money`. |
| `isTest`, `paymentMethod`, `createdAt`, `processedAt` | As SYNQT reports them. |
| `failureReason` | `code`, `message` (written for the merchant), `failedAt`, and `payerMessage`, the wording to show the payer. |

The page's view of the status is for display only. Only your backend's own `GET /payins/{id}` decides that an order is paid.

### 6. Errors

| Error | When |
|---|---|
| `SynqtAPIError` | SYNQT refused the request. `httpCode` and `errors`, a list of `{ code, field, description }`. A 406 is a business error such as `INVALID_PHONE_NUMBER`, and `field` names the input it is about. |
| `SynqtArgumentError` | Something the page passed can't be sent: a malformed payin ID or amount, an unknown method code, a method missing a field. `message`, and `path` naming the field. |
| `TypeError`, `TimeoutError` | `fetch` could not reach SYNQT (including a CORS refusal), or had no answer within 30 seconds. |

`SynqtAPIError` never contains the raw response, because SYNQT echoes what the payer typed in it.

A payin ID can be used once. Calling `create` again with the same ID is a safe retry and returns the existing payin, but only for the same payment method. If the ID was already used with another method, `create` throws `SynqtAPIError` with HTTP 409 and the code `PAYIN_ALREADY_STARTED`, and the sheet tells the payer to start a new payment. Use a new payin ID and token for each attempt.

## Translations

Every piece of text the SDK shows a payer is a string key, so the sheet follows the browser's language once translations exist:

- `sheetStringsEn` in `synqt.js`, inside the generated block: the sheet's own text (headings, buttons, next-step, error and failure messages), with the same wording in every SYNQT SDK.
- `formStringsEn` in `synqt.js`, inside the generated block: method names, field labels, hints, validation messages and question wording, generated with the code that uses it (see below), so don't edit it by hand.

The keys are the Android SDK's string resource names, so one translation can serve every platform. To add a language, copy both objects (for example to `sheetStringsAf` and `formStringsAf`), translate the text keeping the keys and the `%1$s` placeholders, and list them in `translations` in `synqt.js`. A string with no translation falls back to English. Bank and provider names stay in English, as they come from SYNQT's servers.

## Security and compliance

- Never put the merchant's private key or secret key in a page. Tokens come from your backend, one per order, locked to the amount.
- Only your backend's own status check proves a payment. The return URL, the sheet closing and `payin.status()` do not.
- CARD is not offered in the sheet, and `create` refuses raw card numbers (`cardDataRaw`). Collecting card details needs PCI DSS compliant hosted fields and a decision from SYNQT compliance.
- Links and QR images from SYNQT's responses are only opened or shown when they can't run script in your page (`javascript:` and `data:` links are refused), and the sheet writes every value as text, never as HTML.
- The token is in the Payment Web App's URL, as on the other platforms, so it can appear in browser history. It is short-lived and locked to one payin and amount.
- Payment details include personal information (ID numbers, account numbers, phone numbers, emails) covered by POPIA. Don't log requests, responses or `SynqtAPIError` details alongside customer data, including in front-end error tracking.

## Generated code and the SYNQT API version

The block between `BEGIN GENERATED` and `END GENERATED` in `synqt.js` (the payment method rules, the sheet's fields, all of the sheet's text, the failure message map and the colours) and `test/field-cases.test.js` are generated from SYNQT's OpenAPI spec, so don't edit it by hand; the rest of the file is written by hand. In JavaScript a payment method is a plain object, so instead of typed models the block holds, per method, the paths it takes and the paths it requires, and `validatePaymentMethod` checks objects against them. CARD's raw card number fields are left out of this SDK, as they put the app in PCI DSS scope; only the card editions include them.

They are generated from SYNQT API 2.84 today, and the spec lives with the generator app. A new SYNQT API version replaces the generated files in one commit, and every SYNQT SDK moves to the same version together, so they all ask payers for the same things in the same words.

The Android README describes the South African mandatory fields, the "at least one of" tiles and the ID or passport question.

## Release

Published by hand from a developer machine to the public npm registry, under the `@synqt` organisation. There is no CI workflow.

1. Your npm account must be a member of the `@synqt` organisation with two-factor authentication on. If you publish with a token, use a granular or automation token given to npm through the environment (for example `NPM_TOKEN` read by your user `~/.npmrc`), never in a file in this repo.
2. On an up-to-date `main`: `npm test && npm run lint`.
3. `npm version <new version> --no-git-tag-version`, add the version to `CHANGELOG.md`, commit, and merge through a PR.
4. `npm pack --dry-run` and check the name, version and file list (`synqt.js`, `fonts/`, `LICENSE`, `NOTICE`, `CHANGELOG.md`, `THIRD_PARTY_NOTICES.md`, `README.md`, `package.json`, nothing else).
5. Tag the merged commit `vX.Y.Z` (`git tag v<version> && git push origin v<version>`), then `npm publish` from that commit. `publishConfig` already makes the scoped package public.
6. In the examples repo, `cd javascript && npm install @synqt/js@<version>` and commit the updated `package.json` and `package-lock.json`.

npm refuses to publish a version that already exists, so every release needs a new version number. Tags are never moved once pushed.

## Tests

`npm test` (Node 20 or later, no install needed) runs `test/`: the forms and their SA rules, payment method checks, parsing, the API calls against a fake `fetch`, the sheet's behaviour without a browser, error wording and the loader's keyframes. They are ports of the Flutter SDK's tests.

## Running the demo

The demo app lives in the [synqt-examples](https://github.com/synqt-pay/synqt-examples) repo, under `javascript/`. It installs the published package by default; `npm run local` there uses this checkout instead, so clone that repo next to this one to try unpublished changes. Its README has the steps.

## Before merchants use this

Still open, for the people who own them. The first is a blocker for the SDK as designed; the rest are shared with the other SDKs, as the wording is.

- **CORS on SYNQT's API: `Authorization` must be listed explicitly.** Checked against Stable on 5 Nov 2026: preflights for every path answer 204 with `Access-Control-Allow-Origin: *`, `Access-Control-Allow-Methods: *` and `Access-Control-Allow-Headers: *`, also for `Origin: null` (a page opened from disk), and real responses, errors included, carry `Access-Control-Allow-Origin: *`. But under the Fetch standard the `*` in `Access-Control-Allow-Headers` does not cover `Authorization`, so browsers that follow it refuse every call that sends the token, which is every SDK call. Only `POST /auth-tokens` (the demo's secret-key button) sends no `Authorization` and is unaffected. The fix is on SYNQT's side: list the headers, for example `Access-Control-Allow-Headers: Authorization, Content-Type, X-API-Version, Accept`. Until then, merchants need the proxy `fetch` above. Not yet checked: Sandbox and Live, and the behaviour in a real browser.
- Whether the Payment Web App may be framed (it opens in a popup for now, which needs no framing).
- payment method names not covered by the payment glossary, and the generated field labels and hints (including the "OTT Voucher" and "Voucher PIN" drafts, the question wording for Capitec Pay and PayShap, PayShap's "Which ID do you want to give?", the payer-facing failure messages in `sheetStringsEn` (one per SYNQT failure reason code, new and in draft), and the provider menu's "Provider" label)
- web only: "Scan the code below with %1$s on your phone." for computers (`synqt_next_scan_desktop`), a new string that needs adding to the other SDKs' translation files if it is kept
- the "Before you pay" notice for Pay offline, which needs sign-off from SYNQT's compliance owner
- the provisional mobile type scale
- the typeface: Instrument Sans (SIL Open Font License) replaces Inter in every SDK, chosen on 16 November 2026 and awaiting the Innovation Manager's sign-off
- the light Orbit loader puts aqua `#27FFE2` on a light background, which the brand reserves for dark backgrounds; it is decorative and sits beside "Processing your payment"

The design decisions recorded in the Android README (wordmark artwork, colours, field borders, label style, Phosphor icons) apply here unchanged.

## Licence

The SDK is licensed under the Apache License 2.0; see [LICENSE](LICENSE) and [NOTICE](NOTICE). If you redistribute it, keep both files with it. The bundled Instrument Sans fonts (SIL Open Font License 1.1) and Phosphor icons (MIT) keep their own licences, listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Status

The test suite passes on Node 26 (47 tests). Not yet done: the sheet has not been opened in a browser (this environment could not launch one), no payment has been made against Sandbox or Stable, and Stable's CORS headers do not yet allow the `Authorization` header (see above). Opening the demo page and previewing a few methods in each browser is the next step.
