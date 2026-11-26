# SYNQT Web SDK

Take payments (SYNQT payins) in a web page. The SDK can show a Synqt-branded payment sheet that asks the payer for exactly the details their payment method needs, send the payment, and tell you what to do next. You don't build or maintain any payment forms.

It covers SYNQT API version 2 (spec 2.84): the direct API for all payment methods except CARD, and the hosted Payment Web App. It is the web counterpart of SYNQT's [Android](https://github.com/synqt-pay/synqt-android), [iOS](https://github.com/synqt-pay/synqt-ios) and [Flutter](https://github.com/synqt-pay/synqt-flutter) SDKs: the same API, the same payment sheet, the same field rules and the same wording.

This SDK has no card fields. It never collects, sees or sends a card number, which keeps it, and the pages that use it, out of PCI DSS scope for card data.

## Requirements

- A current browser: Chrome, Edge, Firefox or Safari from 2023 on (it uses `<dialog>`, `:has()`, `inert` and `AbortSignal.timeout`).
- One script, `synqt.min.js`, with no dependencies and no modules. It sets one global, `SynqtSDK`.
- A backend of your own that mints a SYNQT token for each order. The page never holds the merchant's private key or secret key.

## Install

From npm:

```
npm install @synqt/js
```

The package's `dist` folder holds `synqt.min.js`, its source map `synqt.min.js.map`, a readable `synqt.js`, and the `fonts` folder beside them; `LICENSE`, `NOTICE`, `CHANGELOG.md` and `THIRD_PARTY_NOTICES.md` sit at the top. The script is a classic script, not a module, so a bundler can't import it. Serve the `dist` folder (or copy `synqt.min.js`, its map and `fonts/` together into your static files, for example in your build's copy step) and load `synqt.min.js` with a script tag. It finds its fonts from its own URL, so keep `fonts/` next to it:

```html
<script src="/node_modules/@synqt/js/dist/synqt.min.js"></script>
```

### From a CDN

jsDelivr serves the npm package as it is, so the fonts load from the same folder as `synqt.min.js` with nothing to copy:

```html
<script src="https://cdn.jsdelivr.net/npm/@synqt/js@0.3.0/dist/synqt.min.js"
        integrity="sha384-<hash>"
        crossorigin="anonymous"></script>
```

Pin the exact version, never a range or `@latest`, and add Subresource Integrity so the browser refuses a file that has changed. To get the hash, either press the SRI button next to `dist/synqt.min.js` on the package's jsDelivr page and copy the `integrity` value, or compute it from the published file yourself:

```
npm pack @synqt/js@0.3.0
tar -xzf synqt-js-0.3.0.tgz package/dist/synqt.min.js
echo "sha384-$(openssl dgst -sha384 -binary package/dist/synqt.min.js | openssl base64 -A)"
```

If your page has a Content Security Policy, allow `https://cdn.jsdelivr.net` in `script-src` and `font-src`.

### From GitHub Releases

Each [release](https://github.com/synqt-pay/synqt-js/releases) has a `synqt-js-<version>.zip` with the built files: `synqt.min.js`, its source map, a readable `synqt.js`, the `fonts` folder, `LICENSE`, `NOTICE` and `THIRD_PARTY_NOTICES.md`. Unzip it into your static files, keeping `fonts/` next to the script. The repository itself holds only the source in `src/`, so a download of the repository needs a build first (see [Building](#building)).

## Integrating the SDK, step by step

Steps 1 and 2 happen once; steps 3 to 7 happen for every order.

### 1. Add the SDK to your project

Install the package (see [Install](#install)), or copy `synqt.min.js`, `synqt.min.js.map` and the `fonts` folder from `dist` next to each other on your site. Then load it with a plain script tag before your own code:

```html
<script src="/js/synqt.min.js"></script>
<script>
  const { Synqt, IncomingPaymentsApi, Money, nextStep, redirect, isFinal, payerMessage, PaymentStatus } = SynqtSDK;
</script>
```

The SDK brings its own strings, and loads Instrument Sans from the `fonts` folder beside `synqt.min.js`. If the fonts can't be loaded (a page opened from disk, or a strict Content Security Policy without `font-src 'self'`), the sheet uses the system font instead.

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

### 3. Create the checkout in the page

When the payer clicks your checkout button, fetch a token from your backend, then:

```js
const synqt = new Synqt('sandbox');
const money = new Money('1250.00', 'ZAR'); // the same amount and currency as the token
const checkout = synqt.checkout({
  token: response.token,
  payinID: response.payinID,
  money,
  returnURL: 'https://shop.example.com/payment/return', // https, see "Other ways to pay"
  callbackURL: 'https://shop.example.com/synqt/callback', // your backend, step 7
});
const api = IncomingPaymentsApi.create(synqt, response.token); // the API, for steps 4 and 6
```

This makes no network call. It throws `SynqtArgumentError` if the payin ID or amount is malformed. `money` can also be a plain `{ amount, currencyCode }`, and `callbackURL` is optional. Use `'sandbox'` while testing and `'live'` for real payments. Give amounts as text (`'1250.00'`) so they are never rounded.

### 4. Choose the payment method

Ask SYNQT what this merchant can take for this amount, and keep the ones the sheet supports:

```js
const offered = (await api.payinAvailablePaymentOptions({ money })).data ?? [];
const supported = Synqt.directPaymentMethods; // each { code, name }, name being the payer-facing name
const choices = supported.filter((m) => offered.some((o) => o.paymentMethodCode === m.code));
```

Show `choices` in your own checkout, using `name` as the payer-facing name, and let the payer pick one. If your checkout only offers one method, skip this step and pass its code, such as `'CAPITEC_PAY'`, in step 5.

### 5. Show the payment sheet

```js
const accepted = await checkout.presentPaymentSheet({
  paymentMethodCode: methodCode,
  prefill: { emailAddress: email, 'customerName.firstName': firstName, 'customerName.lastName': lastName },
  onPresented: () => {},       // the sheet is on screen
  onPaymentStarted: () => {},  // details sent to SYNQT: start showing progress, step 6
});
const to = accepted && redirect(accepted);
if (accepted === null) {
  // the payer closed the sheet without paying
} else if (to) {
  // send the payer to to.url, see below
} else {
  // the sheet already showed the next step; go to step 6
}
```

Pass in `prefill` whatever your page already knows about the payer. The sheet hides those fields, and pays straight away when nothing mandatory is left to ask. See [The payment sheet](#the-payment-sheet) for what it shows.

The sheet resolves with SYNQT's PayinAcceptedResponse. When `redirect(accepted)` gives a Redirection, the payer finishes on a bank's page. For `method` GET, open `url` (`location.assign(to.url)`, or a new tab). For POST, submit `formData` to it as an HTML form: build a `<form method="post" action="${url}">` with one hidden input per entry and call `submit()`.

To skip the sheet and use SYNQT's hosted Payment Web App instead, call `presentPaymentApp` here; see [Other ways to pay](#other-ways-to-pay).

### 6. Show the payer where the payment stands

Once `onPaymentStarted` has run (or the Payment Web App has opened), poll `api.getPayin(payinID)` every few seconds until it is final:

```js
const detail = await api.getPayin(response.payinID);
const status = detail.process?.status;
if (status === PaymentStatus.SUCCESS) { /* show "Paid", but fulfil only from step 7 */ }
else if (status === PaymentStatus.FAILED || status === PaymentStatus.REFUSED) showError(payerMessage(detail.process.failureReasons));
// PROCESSING, or a status SYNQT adds later: keep polling
```

Stop polling when the payer leaves the page or `isFinal(detail)` is true. Before the payment is created, `getPayin` throws `SynqtAPIError` with HTTP 410.

### 7. Confirm the payment on your backend

SYNQT posts `{"idEntity":"order-1042-1"}` to your `callbackURL` on every status change. Reply 200 at once, then call `GET /payins/order-1042-1` from your backend and fulfil the order only when `process.status` is `SUCCESS` and the amount matches. The callback carries no status and no signature, and the page's view of the status is not proof of payment.

### 8. Go live

Switch to `'live'` and your live merchant credentials, test one real payment per method you offer, and work through [Security and compliance](#security-and-compliance).

## The payment sheet

`presentPaymentSheet` shows a modal dialog: a bottom sheet on narrow screens, a centred card from 600 pixels wide. It sits in a shadow root, so your page's CSS doesn't change it and its CSS doesn't leak into your page. It has:

- the Synqt wordmark, an order summary (amount due, payment method, reference, and the merchant name if the token allows `GET /merchant-info`)
- one plain-language field per detail the method needs, grouped into sections, with optional fields marked. A section with any mandatory field in it is mandatory as a whole, which is stricter than SYNQT's spec
- the right on-screen keyboard and browser autofill for each field, and checks on length and format before anything is sent
- a menu of the banks or providers SYNQT returns for this payin and payment method, instead of raw operator codes. An optional bank field is hidden when SYNQT lists none, as on Capitec Pay, Absa Pay, FNB Pay and Nedbank Pay. If the list can't be loaded (the connection fails or SYNQT has a server error, tried three times, 2 seconds apart), a mandatory bank or provider field says so and offers "Try again"
- a Pay button with the amount, and a processing state with the Synqt Orbit loader while the request runs. The loader is drawn on a canvas from the designer's Lottie file, so the SDK needs no animation library; it holds still when the browser asks for reduced motion. The sheet closes only from its close button or Escape, never by clicking outside it, and neither works while a payment is being sent

Fields the page prefills are hidden when their value passes its checks, and a section goes when all of its fields are filled in; once the first and last name are filled in, the optional title, middle name and suffix go too. When every mandatory field of a method is filled in this way, the sheet skips the form and pays straight away, showing only the processing screen. If SYNQT refuses a value, the form appears with the error so the payer can correct it.

When SYNQT accepts a payment the payer finishes in another app (Zapper, SnapScan, UPI and others), the sheet stays open and shows the next step: the QR code to scan, the amount (or the exact amount SYNQT requires), the reference, and a live "Time left to pay" countdown. On a phone or tablet it also offers an "Open Zapper" button, which opens the method's link in a new tab (the app takes it if it is installed). On a computer the QR code is the way to pay, so the button only appears when SYNQT sent no QR code. Unlike the apps, the web sheet never opens the method's app by itself, because browsers block windows a page opens without a click. For Pay offline the next step is "How to pay": the one-time reference in its own card at the top, then the bank account to transfer to and the amount, with copy buttons, then a four-point "Before you pay" notice. Done, or closing the sheet, returns the result. Pages with their own screens get the same details from `nextStep(accepted)`.

If SYNQT refuses the payment, the reason appears under the field it is about, so the payer can fix it and try again. Screen readers hear every error as it appears. The sheet follows the device's light or dark setting, and its text sizes follow the browser's.

What the page hears from the sheet, in order:

1. `onPresented` runs once the sheet is on screen. Before that the SDK fetches the bank list and merchant name, so there is a short gap after the call.
2. `onPaymentStarted` runs each time the payer's details pass the sheet's checks and go to SYNQT. From here `api.getPayin()` has something to report.
3. The promise resolves once the sheet has closed: `null` if the payer closed it without paying, otherwise SYNQT's PayinAcceptedResponse.

Pass an `AbortSignal` as `signal` to close the sheet from your code. It then resolves with `null` even if SYNQT already accepted the payment, so check `api.getPayin()` after an abort.

## Other ways to pay

**Call the API yourself.** `IncomingPaymentsApi` works like the Carpentum Java SDK's: one instance per token, `createPayin(idPayin, payin)` with the whole Payin request, and SYNQT's full response back. Requests and responses are plain objects with the field names of SYNQT's spec, which are also the Java SDK's. A payment method has its `paymentMethodCode` and the fields SYNQT's spec lists for it. `createPayin` checks the whole request against the spec before sending and throws `SynqtArgumentError` naming the missing or unexpected field (`error.path`):

```js
const accepted = await api.createPayin(response.payinID, {
  paymentRequested: { money },
  paymentMethod: {
    paymentMethodCode: 'CAPITEC_PAY',
    phoneNumber: '0821234567',
    customerName: { lastName: 'Doe' },
  },
  returnUrl: 'https://shop.example.com/payment/return',
  callbackUrl: 'https://shop.example.com/synqt/callback',
});
const next = nextStep(accepted); // the QR code, app link, amount, reference and expiry to show
```

Retrying `createPayin` after a network failure is safe: if SYNQT already has the payin, the SDK fetches it instead of creating another.

**Use SYNQT's hosted Payment Web App** when you don't want any payment UI in the page:

```js
payButton.onclick = async () => {
  const result = await checkout.presentPaymentApp({
    merchantCode: 'MID',
    paymentMethodCode: 'CAPITEC_PAY',        // optional: open on this method
    prefill: { phoneNumber: '+27821234567' }, // optional: the payer can still edit it
  });
  // result.type is 'returned' (result.url carries what the Payment Web App added) or 'closed'
  const detail = await api.getPayin(response.payinID); // either way, ask where the payment stands
};
```

`presentPaymentApp` opens the Payment Web App in a popup window and resolves when the payer reaches `returnURL` (same origin and path, any query) or closes the popup. Call it straight from a click handler, or the browser blocks the popup and it throws `SynqtArgumentError`. The SDK can only see the popup reach `returnURL` when that URL is on your page's origin; otherwise the popup stays open on it until the payer closes it. To use the whole tab instead, `openPaymentApp(...)` sends this tab to the Payment Web App, and the payer comes back through `returnURL`. The `returnURL` must be https either way.

`paymentMethodCode` opens the Payment Web App on that method, and the payer can still pick another. `prefill` uses the Payment Web App's parameter names, not the sheet's field paths: `phoneNumber`, `emailAddress`, `accountName`, `accountNumber`, `upiId`, `idCustomer`, `governmentId`, `passportNumber`, `postalCode`, `city`, `district`. The SDK does not check these values. To lock the method or the details instead, leave these out and pass the raw parameters in `extra`.

## API reference

Each call needs a token that allows its SYNQT operation: a `PAYIN_CREATE` token covers creating the payin, its payment options and `getPayin`, while `paymentOperators` and the merchant name in the sheet need operations your backend adds when it mints the token.

### 1. Set up

| Call | What it does |
|---|---|
| `new Synqt(environment, { fetch })` | The entry point for one environment: `'sandbox'`, `'live'` or `'stable'`. `fetch` is optional and replaces the browser's, for example to send calls through your own backend, add logging or change the 30 second timeout. |
| `environments` | The base URLs (`apiBaseURL`, `paymentAppBaseURL`) per environment, for your backend's own calls such as minting tokens. |
| `IncomingPaymentsApi.create(synqt, accessToken)` | SYNQT's payin API for one token, as in the Carpentum Java SDK. |
| `synqt.checkout({ token, payinID, money, returnURL, callbackURL })` | One order's `PayinCheckout`, for the payment sheet and the Payment Web App. `payinID` must match the token; `money` is a `Money` or `{ amount, currencyCode }`; `callbackURL` is optional. Throws `SynqtArgumentError` for a malformed ID or amount, or a `returnURL` that is not https. |
| `new Money(amount, currencyCode)` | An amount as decimal text, never rounded, sent as a JSON number. `String(money)` is the house format, such as `R1,250.00`; `money.plainAmount` drops trailing zeros. |
| `checkout.id`, `checkout.money` | The order's payin ID and amount (a `Money`). |

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
| `api.payinAvailablePaymentOptions(paymentRequested)` | SYNQT's AvailablePayinOptionList for `{ money, segmentCode }`: `data`, the methods SYNQT allows for this merchant and amount, each `{ paymentMethodCode, paymentOperators, segmentCode }`. |
| `Synqt.directPaymentMethods` | The methods the sheet can collect details for, each `{ code, name }`, `name` being the payer-facing name. |
| `synqt.paymentOperators({ token })` | Every bank and provider SYNQT knows, as SYNQT sends them: `{ code, name, externalProviders: { providers } }`. Needs a token with `GET /payment-operators`, which `PAYIN_CREATE` does not give. |

### 3. Take the payment

| Call | What it does |
|---|---|
| `checkout.presentPaymentSheet({ paymentMethodCode, prefill, customerIP, onPresented, onPaymentStarted, signal })` | The Synqt payment sheet. Resolves with SYNQT's PayinAcceptedResponse once it has closed, or `null` when the payer closed it without paying. |
| `api.createPayin(idPayin, payin)` | Your own UI: send a Payin request, `{ paymentRequested: { money, segmentCode?, exchangedToCurrency? }, paymentMethod, returnUrl, callbackUrl?, customerIp? }`. Resolves with SYNQT's PayinAcceptedResponse. |
| `validatePayin(payin)`, `validatePaymentMethod(paymentMethod)` | The checks `createPayin` runs, for your own forms. |
| `checkout.presentPaymentApp({ merchantCode, paymentMethodCode, prefill, extra, onPresented, signal })` | SYNQT's hosted Payment Web App in a popup. Resolves `{ type: 'returned', url }` or `{ type: 'closed' }`. |
| `checkout.openPaymentApp({ merchantCode, paymentMethodCode, prefill, extra })` | Sends this tab to the Payment Web App. |
| `checkout.paymentAppURL({ merchantCode, paymentMethodCode, prefill, extra })` | The Payment Web App's URL, for an iframe or link of your own. |

`customerIP` (`customerIp` in a Payin request) is checked against the merchant's IP allow and deny lists, so pass the payer's real IP if your backend has it.

### 4. After the payment is created

The sheet and `createPayin` resolve with SYNQT's PayinAcceptedResponse as sent: `{ paymentRequested, paymentMethodResponse }` when the payer finishes elsewhere, or `{ paymentRequested, redirectTo }` when they go to a bank's page. These helpers read it:

| Call | What it gives |
|---|---|
| `redirect(accepted)` | SYNQT's `redirectTo`, `{ method, url, data }`, plus `formData`, the fields parsed from `data`; undefined when there is none. GET: open `url`. POST: submit `formData` to it as a form. |
| `nextStep(accepted)` | What to show from `paymentMethodResponse`, read from the fields each method has, or undefined for a redirect. The sheet already shows it. `appLink` (open on this device), `qrCodeImageURL` (a temporary image link) or `qrCodeData` (draw your own), `amountToPay` (a `Money`; if set, the payer must pay exactly this), `reference`, `expiresAt` (ISO 8601) and `payInto` (Pay offline: the account to transfer to, with `accountName`, `accountNumber`, `accountType`, `bankName`, `bankCode` and `bankBranch`). |
| `api.setPayinExternalReference(idPayin, reference)` | Sends the payer's bank or UTR reference, for methods that need it. |
| `api.getPayinAccounts(idPayin)` | SYNQT's PaymentAccountDetail: the payer's account as entered and as the payment used it. The token must allow `GET /payins/{id}/accounts`. |

### 5. Check the outcome

| Call or field | What it is |
|---|---|
| `api.getPayin(idPayin)` | SYNQT's PayinDetail as sent, at any time once a payment has been sent: `paymentRequested`, `process` (`status`, `failureReasons`, `isTest`, `createdAt`, `processedAt`), `fee`, `paymentMethodResponse`, `settlement` and `customer`. HTTP 410 means SYNQT has no payin with this ID yet. |
| `PaymentStatus` | The known statuses: `PROCESSING`, `SUCCESS`, `FAILED` and `REFUSED`. Statuses are strings, so one SYNQT adds later never breaks anything; treat it like processing. |
| `isFinal(detail)` | True for success, failed and refused, which do not change again. |
| `payerMessage(detail.process.failureReasons)` | The wording to show the payer. SYNQT's own `message` is written for the merchant. |

The page's view of the status is for display only. Only your backend's own `GET /payins/{id}` decides that an order is paid.

### 6. Errors

| Error | When |
|---|---|
| `SynqtAPIError` | SYNQT refused the request. `httpCode` and `errors`, a list of `{ code, field, description }`. A 406 is a business error such as `INVALID_PHONE_NUMBER`, and `field` names the input it is about. |
| `SynqtArgumentError` | Something the page passed can't be sent: a malformed payin ID or amount, an unknown method code, a method missing a field. `message`, and `path` naming the field. |
| `TypeError`, `TimeoutError` | `fetch` could not reach SYNQT (including a CORS refusal), or had no answer within 30 seconds. |

`SynqtAPIError` never contains the raw response, because SYNQT echoes what the payer typed in it.

A payin ID can be used once. Calling `createPayin` again with the same ID is a safe retry and returns the existing payin, but only for the same payment method. If the ID was already used with another method, `createPayin` throws `SynqtAPIError` with HTTP 409 and the code `PAYIN_ALREADY_STARTED`, and the sheet tells the payer to start a new payment. Use a new payin ID and token for each attempt.

## Coming from the Carpentum Java SDK

The API calls match the Java SDK's, in JavaScript's own idiom: requests and responses are plain objects with the same field names as the Java models, calls return promises, and the models' helpers are functions.

| Java SDK | This SDK |
|---|---|
| `IncomingPaymentsApi.create(context, token)` | `IncomingPaymentsApi.create(new Synqt(environment), token)` (the token comes from your backend; there is no `PaymentContext` or secret in a page) |
| `payinAvailablePaymentOptions(PaymentRequested)` | the same, with `{ money, segmentCode }`, resolving with the AvailablePayinOptionList object |
| `createPayin(idPayin, Payin)` | the same, with `{ paymentRequested, paymentMethod, returnUrl, callbackUrl, customerIp }`, resolving with the PayinAcceptedResponse object |
| `getPayin(idPayin)`, `getPayinAccounts(idPayin)` | the same, resolving with the PayinDetail and PaymentAccountDetail objects |
| `setPayinExternalReference(idPayin, reference)` | the same |
| `CapitecPayMethod.builder()...build()` | `{ paymentMethodCode: 'CAPITEC_PAY', ... }`, checked by `validatePaymentMethod` |
| `MoneyPaymentRequested` | `new Money('100.00', 'ZAR')`, or `{ amount: 100, currencyCode: 'ZAR' }` |
| `instanceof PayinAcceptedRedirectResponse` | `redirect(accepted)`, or whether `accepted.redirectTo` is set |
| `ResponseException` and its subclasses | `SynqtAPIError` (`httpCode`, `errors`), and fetch's `TypeError` or `TimeoutError` |

Unlike the Java SDK, this SDK checks fields, lengths and formats before sending, retries a payin it already created after a 409, and reads the next step of a payment method it doesn't know from the field names every method uses instead of failing.

## Translations

Every piece of text the SDK shows a payer is a string key, so the sheet follows the browser's language once translations exist:

- `sheetStringsEn` in `src/synqt.js`, inside the generated block: the sheet's own text (headings, buttons, next-step, error and failure messages), with the same wording in every SYNQT SDK.
- `formStringsEn` in `src/synqt.js`, inside the generated block: method names, field labels, hints, validation messages and question wording, generated with the code that uses it (see below).

The keys are the Android SDK's string resource names, so one translation can serve every platform. To add a language, copy both objects (for example to `sheetStringsAf` and `formStringsAf`), translate the text keeping the keys and the `%1$s` placeholders, and list them in `translations` in `src/synqt.js`, then run `npm run build`. A string with no translation falls back to English. Bank and provider names stay in English, as they come from SYNQT's servers.

## Security and compliance

- Never put the merchant's private key or secret key in a page. Tokens come from your backend, one per order, locked to the amount.
- Only your backend's own status check proves a payment. The return URL, the sheet closing and `api.getPayin()` in the page do not.
- CARD is not offered in the sheet, and `createPayin` refuses raw card numbers (`cardDataRaw`). Collecting card details needs PCI DSS compliant hosted fields and a decision from SYNQT compliance.
- Links and QR images from SYNQT's responses are only opened or shown when they can't run script in your page (`javascript:` and `data:` links are refused), and the sheet writes every value as text, never as HTML.
- The token is in the Payment Web App's URL, as on the other platforms, so it can appear in browser history. It is short-lived and locked to one payin and amount.
- Payment details include personal information (ID numbers, account numbers, phone numbers, emails) covered by POPIA. Don't log requests, responses or `SynqtAPIError` details alongside customer data, including in front-end error tracking.

## Generated code and the SYNQT API version

The block between `BEGIN GENERATED` and `END GENERATED` in `src/synqt.js` (the payment method rules, the Payin request rules, which response fields feed each method's next step, the sheet's fields, all of the sheet's text, the failure message map and the colours) and `test/field-cases.test.js` are generated from SYNQT's OpenAPI spec; the rest of the file is written by hand. In JavaScript a payment method is a plain object, so instead of typed models the block holds, per method, the paths it takes and the paths it requires, and `validatePaymentMethod` and `validatePayin` check objects against them. CARD's raw card number fields are left out of this SDK, as they put the app in PCI DSS scope; only the card editions include them.

They are generated from SYNQT API 2.84 today, and the spec lives with the generator app. A new SYNQT API version replaces the generated files in one commit, and every SYNQT SDK moves to the same version together, so they all ask payers for the same things in the same words.

The Android README describes the South African mandatory fields, the "at least one of" tiles and the ID or passport question.

## Building

The source is `src/synqt.js`. `npm install`, then `npm run build`, bundles it with esbuild into `dist/`: `synqt.js`, the minified `synqt.min.js` with its source map, and a copy of `fonts/`. `dist/` is not committed; `npm pack` and `npm publish` build it first.

## Tests

`npm test` (Node 20 or later, after `npm install`) builds `dist/` and runs `test/`: the built bundle, the forms and their SA rules, payment method checks, parsing, the API calls against a fake `fetch`, the sheet's behaviour without a browser, error wording and the loader's keyframes. They are ports of the Flutter SDK's tests.

## Running the demo

The demo app lives in the [synqt-examples](https://github.com/synqt-pay/synqt-examples) repo, under `javascript/`. It installs the published package by default; `npm run local` there uses this checkout instead, so clone that repo next to this one to try unpublished changes. Its README has the steps.

## Licence

The SDK is licensed under the Apache License 2.0; see [LICENSE](LICENSE) and [NOTICE](NOTICE). If you redistribute it, keep both files with it. The bundled Instrument Sans fonts (SIL Open Font License 1.1) and Phosphor icons (MIT) keep their own licences, listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Status

The test suite passes on Node 26 (47 tests).
