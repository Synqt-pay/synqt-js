// The same inputs, checked the same way, in every SYNQT SDK. Generated: add cases to the shared table, not here.
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { methodForms, problem } = require('../synqt.js').internals;

const cases = [
  ["CAPITEC_PAY", "said", "0000000000000", undefined],
  ["CAPITEC_PAY", "said", "12345", "Enter 13 digits"],
  ["CAPITEC_PAY", "account.accountNumber", "1234567890", undefined],
  ["CAPITEC_PAY", "account.accountNumber", "12345678ab", "Enter 10 digits"],
  ["CAPITEC_PAY", "emailAddress", "test@example.com", undefined],
  ["CAPITEC_PAY", "emailAddress", "nope", "Enter a valid email address"],
  ["CAPITEC_PAY", "phoneNumber", "0821234567", undefined],
  ["CAPITEC_PAY", "phoneNumber", "821234567", "Enter up to 12 characters, starting with 0"],
  ["CAPITEC_PAY", "customerName.lastName", "", "Required"],
  ["CAPITEC_PAY", "customerName.lastName", "Doe", undefined],
  ["UPIID", "upiId", "name@bank", undefined],
  ["UPIID", "upiId", "namebank", "Enter a UPI ID like name@bank"],
  ["FNB_DIRECT_EFT", "passportNumber", "A1234567", undefined],
  ["FNB_DIRECT_EFT", "passportNumber", "1234", "Enter a letter followed by 7 or 8 numbers"],
  ["PIXQR", "taxId", "12345678901234", undefined],
  ["PIXQR", "taxId", "123", "Enter your 14-character CPF or CNPJ"],
  ["OTT_VOUCHER", "voucherPin", "123456789012", undefined],
];

test('every SDK checks these fields the same way', () => {
  for (const [code, path, value, want] of cases) {
    const field = methodForms.find((form) => form.code === code).fields.find((input) => input.path === path);
    assert.equal(problem(field, { [path]: value })?.text, want, `${code} ${path} "${value}"`);
  }
});
