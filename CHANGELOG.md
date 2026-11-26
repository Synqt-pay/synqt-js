# Changelog

## 0.3.0 (Unreleased)

The payin API now works like the Carpentum Java SDK's. This replaces 0.1.0's payin calls, so code written for 0.1.0 needs updating. The version moves to 0.3.0 with every other SYNQT SDK.

- `IncomingPaymentsApi`, with the Java SDK's payin calls: `payinAvailablePaymentOptions`, `createPayin(idPayin, payin)`, `getPayin`, `getPayinAccounts` and `setPayinExternalReference`. They take and return plain objects with the spec's field names, such as SYNQT's full PayinAcceptedResponse and PayinDetail. `nextStep`, `redirect`, `isFinal`, `payerMessage` and `PaymentStatus` read them, and `validatePayin` checks a whole request before it is sent.
- `synqt.payin(...)` is now `synqt.checkout(...)`, returning a `PayinCheckout` that runs the payment sheet and the Payment Web App; its `callbackURL` is optional. The sheet resolves with SYNQT's PayinAcceptedResponse. The payin object's `create`, `availablePaymentOptions`, `status` and `setExternalReference` moved to `IncomingPaymentsApi`.
- `paymentOperators` returns SYNQT's operator objects as sent.

## 0.1.0 (24 November 2026)

First public release, on GitHub only (`synqt-js-0.1.0.zip` on the release page), not on npm.

- A Synqt-branded payment sheet that asks the payer for exactly the details their payment method needs, sends the payment and shows the next step (open the app, QR code, countdown, or how to pay offline).
- The SYNQT direct API (API version 2, spec 2.84) for every payment method except CARD, with payment method checks before anything is sent.
- The hosted Payment Web App, opened in a popup.
- One script with no dependencies, `dist/synqt.min.js` with its source map (and a readable `dist/synqt.js`), bundled with esbuild from `src/synqt.js`. It sets the global `SynqtSDK` and loads Instrument Sans from the `fonts` folder beside it.
- No card fields, so the SDK stays out of PCI DSS scope.
