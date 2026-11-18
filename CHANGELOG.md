# Changelog

## 0.1.0 (Unreleased)

First public release, published on npm as `@synqt/js`.

- A Synqt-branded payment sheet that asks the payer for exactly the details their payment method needs, sends the payment and shows the next step (open the app, QR code, countdown, or how to pay offline).
- The SYNQT direct API (API version 2, spec 2.84) for every payment method except CARD, with payment method checks before anything is sent.
- The hosted Payment Web App, opened in a popup.
- One plain script, `synqt.js`, with no dependencies and no build step. It sets the global `SynqtSDK` and loads Instrument Sans from the `fonts` folder beside it.
- No card fields, so the SDK stays out of PCI DSS scope.
