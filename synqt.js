/*
 * SYNQT Web SDK: take SYNQT payins in a web page. One plain script with no dependencies and no build step:
 *
 *   <script src="synqt.js"></script>
 *   const { Synqt, Money } = SynqtSDK;
 *
 * It sets the global SynqtSDK. See README.md. The block between BEGIN GENERATED and END GENERATED is generated from
 * SYNQT's OpenAPI spec; never edit it by hand.
 */
(function () {
    'use strict';

// Where this file was loaded from, so the fonts beside it can be found. Read now: currentScript is only set while the
// script first runs.
    const SCRIPT_URL = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : '';

// BEGIN GENERATED
/** Per method code: `allowed`, every path the method's object takes, and `required`, the paths it must have. A
 * required path below an optional object applies once that object is set. */
const paymentMethodRules = {
  ABSA_PAY: {
    required: ["customerName.lastName"],
    allowed: ["account", "account.accountNumber", "account.accountName", "emailAddress", "passportNumber", "said", "customerName", "customerName.titleBefore", "customerName.firstName", "customerName.middleName", "customerName.lastName", "customerName.titleAfter"],
  },
  CAPITEC_PAY: {
    required: ["customerName.lastName"],
    allowed: ["account", "account.accountName", "account.accountNumber", "emailAddress", "phoneNumber", "said", "customerName", "customerName.titleBefore", "customerName.firstName", "customerName.middleName", "customerName.lastName", "customerName.titleAfter", "paymentOperatorCode"],
  },
  CARD: {
    required: ["card", "card.cardDataVault.vaultToken", "card.cardDataVault.securityCode.cipherText", "card.cardDataVault.securityCode.wrappedDEK", "card.cardDataVault.securityCode.initializationVector", "card.cardDataVault.securityCode.kekId", "paymentContacts.billingContact.personName.lastName", "paymentContacts.shippingContact.personName.lastName", "recurring.isFixedAmount", "recurring.isFixedPeriod"],
    allowed: ["card", "card.cardDataVault", "card.cardDataVault.vaultToken", "card.cardDataVault.securityCode", "card.cardDataVault.securityCode.cipherText", "card.cardDataVault.securityCode.wrappedDEK", "card.cardDataVault.securityCode.initializationVector", "card.cardDataVault.securityCode.kekId", "paymentContacts", "paymentContacts.billingContact", "paymentContacts.billingContact.addressLines", "paymentContacts.billingContact.administrativeArea", "paymentContacts.billingContact.country", "paymentContacts.billingContact.countryCode", "paymentContacts.billingContact.locality", "paymentContacts.billingContact.postalCode", "paymentContacts.billingContact.personName", "paymentContacts.billingContact.personName.titleBefore", "paymentContacts.billingContact.personName.firstName", "paymentContacts.billingContact.personName.middleName", "paymentContacts.billingContact.personName.lastName", "paymentContacts.billingContact.personName.titleAfter", "paymentContacts.billingContact.emailAddress", "paymentContacts.billingContact.phoneNumber", "paymentContacts.shippingContact", "paymentContacts.shippingContact.addressLines", "paymentContacts.shippingContact.administrativeArea", "paymentContacts.shippingContact.country", "paymentContacts.shippingContact.countryCode", "paymentContacts.shippingContact.locality", "paymentContacts.shippingContact.postalCode", "paymentContacts.shippingContact.personName", "paymentContacts.shippingContact.personName.titleBefore", "paymentContacts.shippingContact.personName.firstName", "paymentContacts.shippingContact.personName.middleName", "paymentContacts.shippingContact.personName.lastName", "paymentContacts.shippingContact.personName.titleAfter", "paymentContacts.shippingContact.emailAddress", "paymentContacts.shippingContact.phoneNumber", "paymentOperatorCode", "saveCardForFutureUse", "recurring", "recurring.idOfInitialTransaction", "recurring.isFixedAmount", "recurring.isFixedPeriod"],
  },
  CODE_PAYMENT: {
    required: ["account.accountName", "paymentOperatorCode", "emailAddress", "phoneNumber", "paymentLocation", "paymentLocation.postalCode", "paymentLocation.city", "paymentLocation.district"],
    allowed: ["account", "account.accountName", "paymentOperatorCode", "emailAddress", "phoneNumber", "paymentLocation", "paymentLocation.postalCode", "paymentLocation.city", "paymentLocation.district"],
  },
  CRYPTO_OFFLINE: {
    required: ["paymentOperatorCode"],
    allowed: ["paymentOperatorCode", "emailAddress"],
  },
  DUITNOW: {
    required: ["account", "account.accountName"],
    allowed: ["account", "account.accountName", "account.accountNumber", "paymentOperatorCode", "emailAddress"],
  },
  EWALLET: {
    required: ["paymentOperatorCode"],
    allowed: ["account", "account.accountName", "emailAddress", "phoneNumber", "paymentOperatorCode"],
  },
  FNB_DIRECT_EFT: {
    required: ["customerName", "customerName.firstName", "customerName.lastName", "emailAddress", "account", "account.accountNumber"],
    allowed: ["customerName", "customerName.firstName", "customerName.lastName", "emailAddress", "account", "account.accountNumber", "passportNumber", "said"],
  },
  FPX: {
    required: ["account", "account.accountName", "account.accountType", "paymentOperatorCode"],
    allowed: ["account", "account.accountName", "account.accountType", "emailAddress", "paymentOperatorCode"],
  },
  IMPS: {
    required: ["account", "account.accountName"],
    allowed: ["account", "account.accountName", "account.accountNumber", "emailAddress"],
  },
  MOBILE_MONEY: {
    required: ["account", "account.accountName", "phoneNumber"],
    allowed: ["account", "account.accountName", "paymentOperatorCode", "emailAddress", "phoneNumber"],
  },
  MOMOPAY: {
    required: [],
    allowed: ["emailAddress"],
  },
  NEDBANK_DIRECT_EFT: {
    required: ["account", "account.accountName", "said", "customerName.lastName"],
    allowed: ["account", "account.accountName", "said", "emailAddress", "customerName", "customerName.titleBefore", "customerName.firstName", "customerName.middleName", "customerName.lastName", "customerName.titleAfter"],
  },
  NETBANKING: {
    required: [],
    allowed: ["account", "account.accountName", "account.accountNumber", "emailAddress", "phoneNumber", "paymentOperatorCode"],
  },
  OFFLINE: {
    required: ["customerName.firstName", "customerName.lastName"],
    allowed: ["account", "account.accountName", "account.accountNumber", "paymentOperatorCode", "emailAddress", "phoneNumber", "productId", "taxId", "customerName", "customerName.titleBefore", "customerName.firstName", "customerName.middleName", "customerName.lastName", "customerName.titleAfter"],
  },
  ONLINE: {
    required: [],
    allowed: ["account", "account.accountName", "account.accountNumber", "account.accountType", "paymentOperatorCode", "emailAddress"],
  },
  OTT_VOUCHER: {
    required: ["voucherPin", "phoneNumber", "emailAddress", "customerName", "customerName.firstName", "customerName.lastName"],
    allowed: ["voucherPin", "phoneNumber", "emailAddress", "customerName", "customerName.titleBefore", "customerName.firstName", "customerName.middleName", "customerName.lastName", "customerName.titleAfter"],
  },
  P2A_V2: {
    required: ["paymentOperatorCode"],
    allowed: ["account", "account.accountName", "account.accountNumber", "paymentOperatorCode", "emailAddress"],
  },
  PAYSHAP: {
    required: ["customerName.lastName", "paymentOperatorCode"],
    allowed: ["account", "account.accountName", "account.accountNumber", "phoneNumber", "emailAddress", "passportNumber", "said", "customerName", "customerName.titleBefore", "customerName.firstName", "customerName.middleName", "customerName.lastName", "customerName.titleAfter", "paymentOperatorCode", "externalProviderCode"],
  },
  PAY_ME: {
    required: ["account", "account.accountName"],
    allowed: ["account", "account.accountName", "account.accountNumber", "emailAddress", "phoneNumber"],
  },
  PIXQR: {
    required: ["account", "account.accountName", "taxId"],
    allowed: ["account", "account.accountName", "taxId"],
  },
  PROMPTPAY: {
    required: ["account.accountNumber"],
    allowed: ["account", "account.accountName", "account.accountNumber", "paymentOperatorCode", "emailAddress"],
  },
  PSE: {
    required: ["account", "account.accountName", "emailAddress", "phoneNumber"],
    allowed: ["account", "account.accountName", "emailAddress", "phoneNumber"],
  },
  QRISPAY: {
    required: [],
    allowed: ["account", "account.accountName", "account.accountNumber", "emailAddress"],
  },
  QRPH: {
    required: [],
    allowed: ["account", "account.accountName", "account.accountNumber", "emailAddress", "paymentOperatorCode", "phoneNumber"],
  },
  SNAPSCAN_QR: {
    required: ["emailAddress", "customerName", "customerName.firstName", "customerName.lastName"],
    allowed: ["emailAddress", "customerName", "customerName.titleBefore", "customerName.firstName", "customerName.middleName", "customerName.lastName", "customerName.titleAfter"],
  },
  UPICOLLECT: {
    required: ["account", "account.accountName", "upiId", "emailAddress", "phoneNumber"],
    allowed: ["account", "account.accountName", "upiId", "emailAddress", "phoneNumber"],
  },
  UPIID: {
    required: ["upiId"],
    allowed: ["upiId", "emailAddress"],
  },
  UPIQR: {
    required: [],
    allowed: ["account", "account.accountName", "upiId", "emailAddress", "phoneNumber", "paymentOperatorCode"],
  },
  VAPAY: {
    required: ["paymentLocation.postalCode", "paymentLocation.city", "paymentLocation.district"],
    allowed: ["account", "account.accountName", "account.accountNumber", "paymentOperatorCode", "emailAddress", "phoneNumber", "paymentLocation", "paymentLocation.postalCode", "paymentLocation.city", "paymentLocation.district"],
  },
  VAPAY_VERIF: {
    required: ["account", "account.accountNumber", "paymentOperatorCode"],
    allowed: ["account", "account.accountName", "account.accountNumber", "paymentOperatorCode", "emailAddress"],
  },
  VIETQR: {
    required: ["paymentOperatorCode"],
    allowed: ["paymentOperatorCode", "emailAddress"],
  },
  ZAPPER_QR: {
    required: ["emailAddress", "customerName", "customerName.firstName", "customerName.lastName"],
    allowed: ["emailAddress", "customerName", "customerName.firstName", "customerName.lastName"],
  },
};

/** One entry per direct API payment method a payer can fill in, shown by `Payin.presentPaymentSheet`. */
const methodForms = [
  {
    code: "ABSA_PAY",
    name: "synqt_absa_pay",
    fields: [
      { path: "emailAddress", label: "synqt_email_address_optional", kind: "email", required: false, invalid: "synqt_enter_a_valid_email_address" },
      { path: "passportNumber", label: "synqt_passport_number", kind: "text", required: false, hint: "synqt_a_letter_followed_by_numbers", minLength: 8, maxLength: 9, pattern: "^[a-zA-Z][0-9]+$", invalid: "synqt_enter_a_letter_followed_by_7_or_8_numbers" },
      { path: "said", label: "synqt_south_african_id_number", kind: "number", required: false, hint: "synqt_13_digits", minLength: 13, maxLength: 13, pattern: "^[0-9]*$", invalid: "synqt_enter_13_digits" },
      { path: "account.accountNumber", label: "synqt_account_number", kind: "text", required: false },
      { path: "account.accountName", label: "synqt_account_holder_name_optional", kind: "text", required: false, maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
      { path: "customerName.titleBefore", label: "synqt_title_optional", kind: "text", required: false, section: "synqt_your_name" },
      { path: "customerName.firstName", label: "synqt_first_name_optional", kind: "text", required: false, section: "synqt_your_name" },
      { path: "customerName.middleName", label: "synqt_middle_name_optional", kind: "text", required: false, section: "synqt_your_name" },
      { path: "customerName.lastName", label: "synqt_last_name", kind: "text", required: true, section: "synqt_your_name" },
      { path: "customerName.titleAfter", label: "synqt_name_suffix_optional", kind: "text", required: false, section: "synqt_your_name" },
    ],
    oneOfs: [
      { question: "synqt_how_do_you_want_to_confirm_it_s_you", choices: [
        { label: "synqt_bank_account", paths: ["account.accountNumber", "account.accountName"], required: ["account.accountNumber"] },
        { label: "synqt_south_african_id_number", paths: ["said"], required: ["said"] },
        { label: "synqt_passport_number", paths: ["passportNumber"], required: ["passportNumber"] },
      ] },
    ],
  },
  {
    code: "CAPITEC_PAY",
    name: "synqt_capitec_pay",
    fields: [
      { path: "paymentOperatorCode", label: "synqt_bank_or_provider_optional", kind: "paymentOperator", required: false, maxLength: 30, pattern: "^[A-Za-z0-9_-]+$", invalid: "synqt_use_letters_numbers_and_only" },
      { path: "emailAddress", label: "synqt_email_address_optional", kind: "email", required: false, invalid: "synqt_enter_a_valid_email_address" },
      { path: "phoneNumber", label: "synqt_mobile_number", kind: "phone", required: false, placeholder: "synqt_0821234567", maxLength: 12, pattern: "^0", invalid: "synqt_enter_up_to_12_characters_starting_with_0" },
      { path: "said", label: "synqt_south_african_id_number", kind: "number", required: false, hint: "synqt_13_digits", minLength: 13, maxLength: 13, pattern: "^[0-9]*$", invalid: "synqt_enter_13_digits" },
      { path: "account.accountName", label: "synqt_account_holder_name_optional", kind: "text", required: false, maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
      { path: "account.accountNumber", label: "synqt_account_number", kind: "number", required: false, placeholder: "synqt_10_digits", minLength: 10, maxLength: 10, pattern: "^[0-9]*$", invalid: "synqt_enter_10_digits" },
      { path: "customerName.titleBefore", label: "synqt_title_optional", kind: "text", required: false, section: "synqt_your_name" },
      { path: "customerName.firstName", label: "synqt_first_name_optional", kind: "text", required: false, section: "synqt_your_name" },
      { path: "customerName.middleName", label: "synqt_middle_name_optional", kind: "text", required: false, section: "synqt_your_name" },
      { path: "customerName.lastName", label: "synqt_last_name", kind: "text", required: true, section: "synqt_your_name" },
      { path: "customerName.titleAfter", label: "synqt_name_suffix_optional", kind: "text", required: false, section: "synqt_your_name" },
    ],
    oneOfs: [
      { question: "synqt_how_do_you_want_to_confirm_it_s_you", choices: [
        { label: "synqt_bank_account", paths: ["account.accountNumber", "account.accountName"], required: ["account.accountNumber"] },
        { label: "synqt_mobile_number", paths: ["phoneNumber"], required: ["phoneNumber"] },
        { label: "synqt_south_african_id_number", paths: ["said"], required: ["said"] },
      ] },
    ],
  },
  {
    code: "CODE_PAYMENT",
    name: "synqt_payment_code",
    fields: [
      { path: "paymentOperatorCode", label: "synqt_bank_or_provider", kind: "paymentOperator", required: true, maxLength: 30, pattern: "^[A-Za-z0-9_-]+$", invalid: "synqt_use_letters_numbers_and_only" },
      { path: "emailAddress", label: "synqt_email_address", kind: "email", required: true, invalid: "synqt_enter_a_valid_email_address" },
      { path: "phoneNumber", label: "synqt_mobile_number", kind: "phone", required: true, placeholder: "synqt_27821234567", minLength: 7, maxLength: 16, pattern: "^\\+?[0-9]+$", invalid: "synqt_enter_the_number_with_your_country_code_and_no_s" },
      { path: "account.accountName", label: "synqt_account_holder_name", kind: "text", required: true, section: "synqt_bank_account", maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
      { path: "paymentLocation.postalCode", label: "synqt_postal_code", kind: "text", required: true, section: "synqt_where_you_are_paying" },
      { path: "paymentLocation.city", label: "synqt_city", kind: "text", required: true, section: "synqt_where_you_are_paying" },
      { path: "paymentLocation.district", label: "synqt_district", kind: "text", required: true, section: "synqt_where_you_are_paying" },
    ],
    oneOfs: [],
  },
  {
    code: "CRYPTO_OFFLINE",
    name: "synqt_crypto",
    fields: [
      { path: "paymentOperatorCode", label: "synqt_bank_or_provider", kind: "paymentOperator", required: true, maxLength: 30, pattern: "^[A-Za-z0-9_-]+$", invalid: "synqt_use_letters_numbers_and_only" },
      { path: "emailAddress", label: "synqt_email_address_optional", kind: "email", required: false, invalid: "synqt_enter_a_valid_email_address" },
    ],
    oneOfs: [],
  },
  {
    code: "DUITNOW",
    name: "synqt_duitnow",
    fields: [
      { path: "paymentOperatorCode", label: "synqt_bank_or_provider_optional", kind: "paymentOperator", required: false, maxLength: 30, pattern: "^[A-Za-z0-9_-]+$", invalid: "synqt_use_letters_numbers_and_only" },
      { path: "emailAddress", label: "synqt_email_address_optional", kind: "email", required: false, invalid: "synqt_enter_a_valid_email_address" },
      { path: "account.accountName", label: "synqt_account_holder_name", kind: "text", required: true, section: "synqt_bank_account", maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
      { path: "account.accountNumber", label: "synqt_account_number_optional", kind: "text", required: false, section: "synqt_bank_account" },
    ],
    oneOfs: [],
  },
  {
    code: "EWALLET",
    name: "synqt_e_wallet",
    fields: [
      { path: "paymentOperatorCode", label: "synqt_bank_or_provider", kind: "paymentOperator", required: true, maxLength: 30, pattern: "^[A-Za-z0-9_-]+$", invalid: "synqt_use_letters_numbers_and_only" },
      { path: "emailAddress", label: "synqt_email_address_optional", kind: "email", required: false, invalid: "synqt_enter_a_valid_email_address" },
      { path: "phoneNumber", label: "synqt_mobile_number_optional", kind: "phone", required: false, placeholder: "synqt_27821234567", minLength: 7, maxLength: 16, pattern: "^\\+?[0-9]+$", invalid: "synqt_enter_the_number_with_your_country_code_and_no_s" },
      { path: "account.accountName", label: "synqt_account_holder_name_optional", kind: "text", required: false, section: "synqt_bank_account_optional", maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
    ],
    oneOfs: [],
  },
  {
    code: "FNB_DIRECT_EFT",
    name: "synqt_fnb_pay",
    fields: [
      { path: "emailAddress", label: "synqt_email_address", kind: "email", required: true, invalid: "synqt_enter_a_valid_email_address" },
      { path: "passportNumber", label: "synqt_passport_number", kind: "text", required: false, hint: "synqt_a_letter_followed_by_numbers", minLength: 8, maxLength: 9, pattern: "^[a-zA-Z][0-9]+$", invalid: "synqt_enter_a_letter_followed_by_7_or_8_numbers" },
      { path: "said", label: "synqt_south_african_id_number", kind: "number", required: false, hint: "synqt_13_digits", minLength: 13, maxLength: 13, pattern: "^[0-9]*$", invalid: "synqt_enter_13_digits" },
      { path: "customerName.firstName", label: "synqt_first_name", kind: "text", required: true, section: "synqt_your_name" },
      { path: "customerName.lastName", label: "synqt_last_name", kind: "text", required: true, section: "synqt_your_name" },
      { path: "account.accountNumber", label: "synqt_account_number", kind: "text", required: true, section: "synqt_bank_account" },
    ],
    oneOfs: [
      { question: "synqt_how_do_you_want_to_confirm_it_s_you", choices: [
        { label: "synqt_south_african_id_number", paths: ["said"], required: ["said"] },
        { label: "synqt_passport_number", paths: ["passportNumber"], required: ["passportNumber"] },
      ] },
    ],
  },
  {
    code: "FPX",
    name: "synqt_fpx_online_banking",
    fields: [
      { path: "paymentOperatorCode", label: "synqt_bank_or_provider", kind: "paymentOperator", required: true, maxLength: 30, pattern: "^[A-Za-z0-9_-]+$", invalid: "synqt_use_letters_numbers_and_only" },
      { path: "emailAddress", label: "synqt_email_address_optional", kind: "email", required: false, invalid: "synqt_enter_a_valid_email_address" },
      { path: "account.accountName", label: "synqt_account_holder_name", kind: "text", required: true, section: "synqt_bank_account", maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
      { path: "account.accountType", label: "synqt_account_type", kind: "choice", required: true, section: "synqt_bank_account", options: [{ value: "savings", label: "synqt_savings" }, { value: "current", label: "synqt_current" }, { value: "corporate", label: "synqt_corporate" }] },
    ],
    oneOfs: [],
  },
  {
    code: "IMPS",
    name: "synqt_imps_bank_transfer",
    fields: [
      { path: "emailAddress", label: "synqt_email_address_optional", kind: "email", required: false, invalid: "synqt_enter_a_valid_email_address" },
      { path: "account.accountName", label: "synqt_account_holder_name", kind: "text", required: true, section: "synqt_bank_account", maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
      { path: "account.accountNumber", label: "synqt_account_number_optional", kind: "text", required: false, section: "synqt_bank_account" },
    ],
    oneOfs: [],
  },
  {
    code: "MOBILE_MONEY",
    name: "synqt_mobile_money",
    fields: [
      { path: "paymentOperatorCode", label: "synqt_bank_or_provider_optional", kind: "paymentOperator", required: false, maxLength: 30, pattern: "^[A-Za-z0-9_-]+$", invalid: "synqt_use_letters_numbers_and_only" },
      { path: "emailAddress", label: "synqt_email_address_optional", kind: "email", required: false, invalid: "synqt_enter_a_valid_email_address" },
      { path: "phoneNumber", label: "synqt_mobile_number", kind: "phone", required: true, placeholder: "synqt_27821234567", minLength: 7, maxLength: 16, pattern: "^\\+?[0-9]+$", invalid: "synqt_enter_the_number_with_your_country_code_and_no_s" },
      { path: "account.accountName", label: "synqt_account_holder_name", kind: "text", required: true, section: "synqt_bank_account", maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
    ],
    oneOfs: [],
  },
  {
    code: "MOMOPAY",
    name: "synqt_momopay",
    fields: [
      { path: "emailAddress", label: "synqt_email_address_optional", kind: "email", required: false, invalid: "synqt_enter_a_valid_email_address" },
    ],
    oneOfs: [],
  },
  {
    code: "NEDBANK_DIRECT_EFT",
    name: "synqt_nedbank_pay",
    fields: [
      { path: "said", label: "synqt_south_african_id_number", kind: "number", required: true, hint: "synqt_13_digits", minLength: 13, maxLength: 13, pattern: "^[0-9]*$", invalid: "synqt_enter_13_digits" },
      { path: "emailAddress", label: "synqt_email_address_optional", kind: "email", required: false, invalid: "synqt_enter_a_valid_email_address" },
      { path: "account.accountName", label: "synqt_account_holder_name", kind: "text", required: true, section: "synqt_bank_account", maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
      { path: "customerName.titleBefore", label: "synqt_title_optional", kind: "text", required: false, section: "synqt_your_name" },
      { path: "customerName.firstName", label: "synqt_first_name_optional", kind: "text", required: false, section: "synqt_your_name" },
      { path: "customerName.middleName", label: "synqt_middle_name_optional", kind: "text", required: false, section: "synqt_your_name" },
      { path: "customerName.lastName", label: "synqt_last_name", kind: "text", required: true, section: "synqt_your_name" },
      { path: "customerName.titleAfter", label: "synqt_name_suffix_optional", kind: "text", required: false, section: "synqt_your_name" },
    ],
    oneOfs: [],
  },
  {
    code: "NETBANKING",
    name: "synqt_net_banking",
    fields: [
      { path: "paymentOperatorCode", label: "synqt_bank_or_provider_optional", kind: "paymentOperator", required: false, maxLength: 30, pattern: "^[A-Za-z0-9_-]+$", invalid: "synqt_use_letters_numbers_and_only" },
      { path: "emailAddress", label: "synqt_email_address_optional", kind: "email", required: false, invalid: "synqt_enter_a_valid_email_address" },
      { path: "phoneNumber", label: "synqt_mobile_number_optional", kind: "phone", required: false, placeholder: "synqt_27821234567", minLength: 7, maxLength: 16, pattern: "^\\+?[0-9]+$", invalid: "synqt_enter_the_number_with_your_country_code_and_no_s" },
      { path: "account.accountName", label: "synqt_account_holder_name_optional", kind: "text", required: false, section: "synqt_bank_account_optional", maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
      { path: "account.accountNumber", label: "synqt_account_number_optional", kind: "text", required: false, section: "synqt_bank_account_optional" },
    ],
    oneOfs: [],
  },
  {
    code: "OFFLINE",
    name: "synqt_pay_offline",
    fields: [
      { path: "paymentOperatorCode", label: "synqt_bank_or_provider", kind: "paymentOperator", required: true, maxLength: 30, pattern: "^[A-Za-z0-9_-]+$", invalid: "synqt_use_letters_numbers_and_only" },
      { path: "emailAddress", label: "synqt_email_address_optional", kind: "email", required: false, invalid: "synqt_enter_a_valid_email_address" },
      { path: "phoneNumber", label: "synqt_mobile_number_optional", kind: "phone", required: false, placeholder: "synqt_27821234567", minLength: 7, maxLength: 16, pattern: "^\\+?[0-9]+$", invalid: "synqt_enter_the_number_with_your_country_code_and_no_s" },
      { path: "productId", label: "synqt_product_reference_optional", kind: "text", required: false, maxLength: 30, pattern: "^[A-Za-z0-9_-]+$" },
      { path: "taxId", label: "synqt_tax_number_optional", kind: "text", required: false, hint: "synqt_8_to_18_characters", minLength: 8, maxLength: 18, invalid: "synqt_enter_8_to_18_characters" },
      { path: "account.accountName", label: "synqt_account_holder_name_optional", kind: "text", required: false, section: "synqt_bank_account_optional", maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
      { path: "account.accountNumber", label: "synqt_account_number_optional", kind: "text", required: false, section: "synqt_bank_account_optional" },
      { path: "customerName.titleBefore", label: "synqt_title_optional", kind: "text", required: false, section: "synqt_your_name" },
      { path: "customerName.firstName", label: "synqt_first_name", kind: "text", required: true, section: "synqt_your_name" },
      { path: "customerName.middleName", label: "synqt_middle_name_optional", kind: "text", required: false, section: "synqt_your_name" },
      { path: "customerName.lastName", label: "synqt_last_name", kind: "text", required: true, section: "synqt_your_name" },
      { path: "customerName.titleAfter", label: "synqt_name_suffix_optional", kind: "text", required: false, section: "synqt_your_name" },
    ],
    oneOfs: [],
  },
  {
    code: "ONLINE",
    name: "synqt_online_banking",
    fields: [
      { path: "paymentOperatorCode", label: "synqt_bank_or_provider", kind: "paymentOperator", required: true, maxLength: 30, pattern: "^[A-Za-z0-9_-]+$", invalid: "synqt_use_letters_numbers_and_only" },
      { path: "emailAddress", label: "synqt_email_address", kind: "email", required: true, invalid: "synqt_enter_a_valid_email_address" },
      { path: "account.accountName", label: "synqt_account_holder_name", kind: "text", required: true, section: "synqt_bank_account", maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
      { path: "account.accountNumber", label: "synqt_account_number", kind: "text", required: true, section: "synqt_bank_account" },
      { path: "account.accountType", label: "synqt_account_type", kind: "text", required: true, section: "synqt_bank_account", maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
    ],
    oneOfs: [],
  },
  {
    code: "OTT_VOUCHER",
    name: "synqt_ott_voucher",
    fields: [
      { path: "voucherPin", label: "synqt_voucher_pin", kind: "text", required: true, hint: "synqt_the_12_digit_pin_on_your_voucher" },
      { path: "phoneNumber", label: "synqt_mobile_number", kind: "phone", required: true, placeholder: "synqt_27821234567", minLength: 7, maxLength: 16, pattern: "^\\+?[0-9]+$", invalid: "synqt_enter_the_number_with_your_country_code_and_no_s" },
      { path: "emailAddress", label: "synqt_email_address", kind: "email", required: true, invalid: "synqt_enter_a_valid_email_address" },
      { path: "customerName.titleBefore", label: "synqt_title_optional", kind: "text", required: false, section: "synqt_your_name" },
      { path: "customerName.firstName", label: "synqt_first_name", kind: "text", required: true, section: "synqt_your_name" },
      { path: "customerName.middleName", label: "synqt_middle_name_optional", kind: "text", required: false, section: "synqt_your_name" },
      { path: "customerName.lastName", label: "synqt_last_name", kind: "text", required: true, section: "synqt_your_name" },
      { path: "customerName.titleAfter", label: "synqt_name_suffix_optional", kind: "text", required: false, section: "synqt_your_name" },
    ],
    oneOfs: [],
  },
  {
    code: "P2A_V2",
    name: "synqt_bank_transfer",
    fields: [
      { path: "paymentOperatorCode", label: "synqt_bank_or_provider", kind: "paymentOperator", required: true, maxLength: 30, pattern: "^[A-Za-z0-9_-]+$", invalid: "synqt_use_letters_numbers_and_only" },
      { path: "emailAddress", label: "synqt_email_address_optional", kind: "email", required: false, invalid: "synqt_enter_a_valid_email_address" },
      { path: "account.accountName", label: "synqt_account_holder_name_optional", kind: "text", required: false, section: "synqt_bank_account_optional", maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
      { path: "account.accountNumber", label: "synqt_account_number_optional", kind: "text", required: false, section: "synqt_bank_account_optional" },
    ],
    oneOfs: [],
  },
  {
    code: "PAYSHAP",
    name: "synqt_payshap",
    fields: [
      { path: "paymentOperatorCode", label: "synqt_bank_or_provider", kind: "paymentOperator", required: true, maxLength: 30, pattern: "^[A-Za-z0-9_-]+$", invalid: "synqt_use_letters_numbers_and_only" },
      { path: "phoneNumber", label: "synqt_mobile_number", kind: "phone", required: false, placeholder: "synqt_0821234567", maxLength: 12, pattern: "^0", invalid: "synqt_enter_up_to_12_characters_starting_with_0" },
      { path: "emailAddress", label: "synqt_email_address_optional", kind: "email", required: false, invalid: "synqt_enter_a_valid_email_address" },
      { path: "passportNumber", label: "synqt_passport_number_optional", kind: "text", required: false, hint: "synqt_a_letter_followed_by_numbers", minLength: 8, maxLength: 9, pattern: "^[a-zA-Z][0-9]+$", invalid: "synqt_enter_a_letter_followed_by_7_or_8_numbers" },
      { path: "said", label: "synqt_south_african_id_number_optional", kind: "number", required: false, hint: "synqt_13_digits", minLength: 13, maxLength: 13, pattern: "^[0-9]*$", invalid: "synqt_enter_13_digits" },
      { path: "externalProviderCode", label: "synqt_provider", kind: "provider", required: false },
      { path: "account.accountName", label: "synqt_account_holder_name", kind: "text", required: false, maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
      { path: "account.accountNumber", label: "synqt_account_number", kind: "number", required: false, hint: "synqt_numbers_only", pattern: "^[0-9]*$", invalid: "synqt_use_numbers_only" },
      { path: "customerName.titleBefore", label: "synqt_title_optional", kind: "text", required: false, section: "synqt_your_name" },
      { path: "customerName.firstName", label: "synqt_first_name_optional", kind: "text", required: false, section: "synqt_your_name" },
      { path: "customerName.middleName", label: "synqt_middle_name_optional", kind: "text", required: false, section: "synqt_your_name" },
      { path: "customerName.lastName", label: "synqt_last_name", kind: "text", required: true, section: "synqt_your_name" },
      { path: "customerName.titleAfter", label: "synqt_name_suffix_optional", kind: "text", required: false, section: "synqt_your_name" },
    ],
    oneOfs: [
      { question: "synqt_how_do_you_want_to_pay", choices: [
        { label: "synqt_bank_account", paths: ["account.accountNumber", "account.accountName"], required: ["account.accountNumber", "account.accountName"] },
        { label: "synqt_mobile_number", paths: ["phoneNumber", "externalProviderCode"], required: ["phoneNumber", "externalProviderCode"] },
      ] },
      { question: "synqt_which_id_do_you_want_to_give", choices: [
        { label: "synqt_south_african_id_number", paths: ["said"], required: [] },
        { label: "synqt_passport_number", paths: ["passportNumber"], required: [] },
      ] },
    ],
  },
  {
    code: "PAY_ME",
    name: "synqt_payme",
    fields: [
      { path: "emailAddress", label: "synqt_email_address_optional", kind: "email", required: false, invalid: "synqt_enter_a_valid_email_address" },
      { path: "phoneNumber", label: "synqt_mobile_number_optional", kind: "phone", required: false, placeholder: "synqt_27821234567", minLength: 7, maxLength: 16, pattern: "^\\+?[0-9]+$", invalid: "synqt_enter_the_number_with_your_country_code_and_no_s" },
      { path: "account.accountName", label: "synqt_account_holder_name", kind: "text", required: true, section: "synqt_bank_account", maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
      { path: "account.accountNumber", label: "synqt_account_number_optional", kind: "text", required: false, section: "synqt_bank_account" },
    ],
    oneOfs: [],
  },
  {
    code: "PIXQR",
    name: "synqt_pix",
    fields: [
      { path: "taxId", label: "synqt_cpf_or_cnpj", kind: "text", required: true, hint: "synqt_14_characters", minLength: 14, maxLength: 14, invalid: "synqt_enter_your_14_character_cpf_or_cnpj" },
      { path: "account.accountName", label: "synqt_account_holder_name", kind: "text", required: true, section: "synqt_bank_account", maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
    ],
    oneOfs: [],
  },
  {
    code: "PROMPTPAY",
    name: "synqt_promptpay",
    fields: [
      { path: "paymentOperatorCode", label: "synqt_bank_or_provider_optional", kind: "paymentOperator", required: false, maxLength: 30, pattern: "^[A-Za-z0-9_-]+$", invalid: "synqt_use_letters_numbers_and_only" },
      { path: "emailAddress", label: "synqt_email_address_optional", kind: "email", required: false, invalid: "synqt_enter_a_valid_email_address" },
      { path: "account.accountName", label: "synqt_account_holder_name_optional", kind: "text", required: false, section: "synqt_bank_account", maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
      { path: "account.accountNumber", label: "synqt_account_number", kind: "text", required: true, section: "synqt_bank_account" },
    ],
    oneOfs: [],
  },
  {
    code: "PSE",
    name: "synqt_pse",
    fields: [
      { path: "emailAddress", label: "synqt_email_address", kind: "email", required: true, invalid: "synqt_enter_a_valid_email_address" },
      { path: "phoneNumber", label: "synqt_mobile_number", kind: "phone", required: true, placeholder: "synqt_27821234567", minLength: 7, maxLength: 16, pattern: "^\\+?[0-9]+$", invalid: "synqt_enter_the_number_with_your_country_code_and_no_s" },
      { path: "account.accountName", label: "synqt_account_holder_name", kind: "text", required: true, section: "synqt_bank_account", maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
    ],
    oneOfs: [],
  },
  {
    code: "QRISPAY",
    name: "synqt_qris",
    fields: [
      { path: "emailAddress", label: "synqt_email_address_optional", kind: "email", required: false, invalid: "synqt_enter_a_valid_email_address" },
      { path: "account.accountName", label: "synqt_account_holder_name_optional", kind: "text", required: false, section: "synqt_bank_account_optional", maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
      { path: "account.accountNumber", label: "synqt_account_number_optional", kind: "text", required: false, section: "synqt_bank_account_optional" },
    ],
    oneOfs: [],
  },
  {
    code: "QRPH",
    name: "synqt_qr_ph",
    fields: [
      { path: "paymentOperatorCode", label: "synqt_bank_or_provider_optional", kind: "paymentOperator", required: false, maxLength: 30, pattern: "^[A-Za-z0-9_-]+$", invalid: "synqt_use_letters_numbers_and_only" },
      { path: "emailAddress", label: "synqt_email_address_optional", kind: "email", required: false, invalid: "synqt_enter_a_valid_email_address" },
      { path: "phoneNumber", label: "synqt_mobile_number_optional", kind: "phone", required: false, placeholder: "synqt_27821234567", minLength: 7, maxLength: 16, pattern: "^\\+?[0-9]+$", invalid: "synqt_enter_the_number_with_your_country_code_and_no_s" },
      { path: "account.accountName", label: "synqt_account_holder_name_optional", kind: "text", required: false, section: "synqt_bank_account_optional", maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
      { path: "account.accountNumber", label: "synqt_account_number_optional", kind: "text", required: false, section: "synqt_bank_account_optional" },
    ],
    oneOfs: [],
  },
  {
    code: "SNAPSCAN_QR",
    name: "synqt_snapscan",
    fields: [
      { path: "emailAddress", label: "synqt_email_address", kind: "email", required: true, invalid: "synqt_enter_a_valid_email_address" },
      { path: "customerName.titleBefore", label: "synqt_title_optional", kind: "text", required: false, section: "synqt_your_name" },
      { path: "customerName.firstName", label: "synqt_first_name", kind: "text", required: true, section: "synqt_your_name" },
      { path: "customerName.middleName", label: "synqt_middle_name_optional", kind: "text", required: false, section: "synqt_your_name" },
      { path: "customerName.lastName", label: "synqt_last_name", kind: "text", required: true, section: "synqt_your_name" },
      { path: "customerName.titleAfter", label: "synqt_name_suffix_optional", kind: "text", required: false, section: "synqt_your_name" },
    ],
    oneOfs: [],
  },
  {
    code: "UPICOLLECT",
    name: "synqt_upi",
    fields: [
      { path: "upiId", label: "synqt_upi_id", kind: "text", required: true, placeholder: "synqt_name_bank", maxLength: 100, pattern: "[a-zA-Z0-9_\\-\\.]+@[a-zA-Z0-9_\\.]+", invalid: "synqt_enter_a_upi_id_like_name_bank" },
      { path: "emailAddress", label: "synqt_email_address", kind: "email", required: true, invalid: "synqt_enter_a_valid_email_address" },
      { path: "phoneNumber", label: "synqt_mobile_number", kind: "phone", required: true, placeholder: "synqt_27821234567", minLength: 7, maxLength: 16, pattern: "^\\+?[0-9]+$", invalid: "synqt_enter_the_number_with_your_country_code_and_no_s" },
      { path: "account.accountName", label: "synqt_account_holder_name", kind: "text", required: true, section: "synqt_bank_account", maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
    ],
    oneOfs: [],
  },
  {
    code: "UPIID",
    name: "synqt_upi_id",
    fields: [
      { path: "upiId", label: "synqt_upi_id", kind: "text", required: true, placeholder: "synqt_name_bank", maxLength: 100, pattern: "[a-zA-Z0-9_\\-\\.]+@[a-zA-Z0-9_\\.]+", invalid: "synqt_enter_a_upi_id_like_name_bank" },
      { path: "emailAddress", label: "synqt_email_address_optional", kind: "email", required: false, invalid: "synqt_enter_a_valid_email_address" },
    ],
    oneOfs: [],
  },
  {
    code: "UPIQR",
    name: "synqt_upi_qr",
    fields: [
      { path: "paymentOperatorCode", label: "synqt_bank_or_provider_optional", kind: "paymentOperator", required: false, maxLength: 30, pattern: "^[A-Za-z0-9_-]+$", invalid: "synqt_use_letters_numbers_and_only" },
      { path: "upiId", label: "synqt_upi_id_optional", kind: "text", required: false, placeholder: "synqt_name_bank", maxLength: 100, pattern: "[a-zA-Z0-9_\\-\\.]+@[a-zA-Z0-9_\\.]+", invalid: "synqt_enter_a_upi_id_like_name_bank" },
      { path: "emailAddress", label: "synqt_email_address_optional", kind: "email", required: false, invalid: "synqt_enter_a_valid_email_address" },
      { path: "phoneNumber", label: "synqt_mobile_number_optional", kind: "phone", required: false, placeholder: "synqt_27821234567", minLength: 7, maxLength: 16, pattern: "^\\+?[0-9]+$", invalid: "synqt_enter_the_number_with_your_country_code_and_no_s" },
      { path: "account.accountName", label: "synqt_account_holder_name_optional", kind: "text", required: false, section: "synqt_bank_account_optional", maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
    ],
    oneOfs: [],
  },
  {
    code: "VAPAY",
    name: "synqt_virtual_account",
    fields: [
      { path: "paymentOperatorCode", label: "synqt_bank_or_provider_optional", kind: "paymentOperator", required: false, maxLength: 30, pattern: "^[A-Za-z0-9_-]+$", invalid: "synqt_use_letters_numbers_and_only" },
      { path: "emailAddress", label: "synqt_email_address_optional", kind: "email", required: false, invalid: "synqt_enter_a_valid_email_address" },
      { path: "phoneNumber", label: "synqt_mobile_number_optional", kind: "phone", required: false, placeholder: "synqt_27821234567", minLength: 7, maxLength: 16, pattern: "^\\+?[0-9]+$", invalid: "synqt_enter_the_number_with_your_country_code_and_no_s" },
      { path: "account.accountName", label: "synqt_account_holder_name_optional", kind: "text", required: false, section: "synqt_bank_account_optional", maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
      { path: "account.accountNumber", label: "synqt_account_number_optional", kind: "text", required: false, section: "synqt_bank_account_optional" },
      { path: "paymentLocation.postalCode", label: "synqt_postal_code", kind: "text", required: true, section: "synqt_where_you_are_paying" },
      { path: "paymentLocation.city", label: "synqt_city", kind: "text", required: true, section: "synqt_where_you_are_paying" },
      { path: "paymentLocation.district", label: "synqt_district", kind: "text", required: true, section: "synqt_where_you_are_paying" },
    ],
    oneOfs: [],
  },
  {
    code: "VAPAY_VERIF",
    name: "synqt_verified_virtual_account",
    fields: [
      { path: "paymentOperatorCode", label: "synqt_bank_or_provider", kind: "paymentOperator", required: true, maxLength: 30, pattern: "^[A-Za-z0-9_-]+$", invalid: "synqt_use_letters_numbers_and_only" },
      { path: "emailAddress", label: "synqt_email_address_optional", kind: "email", required: false, invalid: "synqt_enter_a_valid_email_address" },
      { path: "account.accountName", label: "synqt_account_holder_name_optional", kind: "text", required: false, section: "synqt_bank_account", maxLength: 64, pattern: "^(\\p{L}\\p{M}*?|[\\d, ;:_'\"!%=@#&\\-\\.\\?\\$\\(\\)\\+\\*\\|])*$", invalid: "synqt_use_letters_numbers_spaces_and_common_punctuatio" },
      { path: "account.accountNumber", label: "synqt_account_number", kind: "number", required: true, hint: "synqt_numbers_only", section: "synqt_bank_account", pattern: "^[0-9-]*$", invalid: "synqt_use_numbers_only" },
    ],
    oneOfs: [],
  },
  {
    code: "VIETQR",
    name: "synqt_vietqr",
    fields: [
      { path: "paymentOperatorCode", label: "synqt_bank_or_provider", kind: "paymentOperator", required: true, maxLength: 30, pattern: "^[A-Za-z0-9_-]+$", invalid: "synqt_use_letters_numbers_and_only" },
      { path: "emailAddress", label: "synqt_email_address_optional", kind: "email", required: false, invalid: "synqt_enter_a_valid_email_address" },
    ],
    oneOfs: [],
  },
  {
    code: "ZAPPER_QR",
    name: "synqt_zapper",
    fields: [
      { path: "emailAddress", label: "synqt_email_address", kind: "email", required: true, invalid: "synqt_enter_a_valid_email_address" },
      { path: "customerName.firstName", label: "synqt_first_name", kind: "text", required: true, section: "synqt_your_name" },
      { path: "customerName.lastName", label: "synqt_last_name", kind: "text", required: true, section: "synqt_your_name" },
    ],
    oneOfs: [],
  },
];

// Payer-facing text of the forms. Translations copy this with the same keys and are listed in `translations`.
const formStringsEn = {
  synqt_0821234567: "0821234567",
  synqt_10_digits: "10 digits",
  synqt_13_digits: "13 digits",
  synqt_14_characters: "14 characters",
  synqt_27821234567: "+27821234567",
  synqt_8_to_18_characters: "8 to 18 characters",
  synqt_a_letter_followed_by_numbers: "A letter followed by numbers",
  synqt_absa_pay: "Absa Pay",
  synqt_account_holder_name: "Account holder name",
  synqt_account_holder_name_optional: "Account holder name (optional)",
  synqt_account_number: "Account number",
  synqt_account_number_optional: "Account number (optional)",
  synqt_account_type: "Account type",
  synqt_bank_account: "Bank account",
  synqt_bank_account_optional: "Bank account (optional)",
  synqt_bank_or_provider: "Bank or provider",
  synqt_bank_or_provider_optional: "Bank or provider (optional)",
  synqt_bank_transfer: "Bank transfer",
  synqt_capitec_pay: "Capitec Pay",
  synqt_city: "City",
  synqt_corporate: "Corporate",
  synqt_cpf_or_cnpj: "CPF or CNPJ",
  synqt_crypto: "Crypto",
  synqt_current: "Current",
  synqt_district: "District",
  synqt_duitnow: "DuitNow",
  synqt_e_wallet: "E-wallet",
  synqt_email_address: "Email address",
  synqt_email_address_optional: "Email address (optional)",
  synqt_enter_10_digits: "Enter 10 digits",
  synqt_enter_13_digits: "Enter 13 digits",
  synqt_enter_8_to_18_characters: "Enter 8 to 18 characters",
  synqt_enter_a_letter_followed_by_7_or_8_numbers: "Enter a letter followed by 7 or 8 numbers",
  synqt_enter_a_upi_id_like_name_bank: "Enter a UPI ID like name@bank",
  synqt_enter_a_valid_email_address: "Enter a valid email address",
  synqt_enter_the_number_with_your_country_code_and_no_s: "Enter the number with your country code and no spaces",
  synqt_enter_up_to_12_characters_starting_with_0: "Enter up to 12 characters, starting with 0",
  synqt_enter_your_14_character_cpf_or_cnpj: "Enter your 14-character CPF or CNPJ",
  synqt_first_name: "First name",
  synqt_first_name_optional: "First name (optional)",
  synqt_fnb_pay: "FNB Pay",
  synqt_fpx_online_banking: "FPX online banking",
  synqt_how_do_you_want_to_confirm_it_s_you: "How do you want to confirm it's you?",
  synqt_how_do_you_want_to_pay: "How do you want to pay?",
  synqt_imps_bank_transfer: "IMPS bank transfer",
  synqt_last_name: "Last name",
  synqt_middle_name_optional: "Middle name (optional)",
  synqt_mobile_money: "Mobile money",
  synqt_mobile_number: "Mobile number",
  synqt_mobile_number_optional: "Mobile number (optional)",
  synqt_momopay: "MoMoPay",
  synqt_name_bank: "name@bank",
  synqt_name_suffix_optional: "Name suffix (optional)",
  synqt_nedbank_pay: "Nedbank Pay",
  synqt_net_banking: "Net banking",
  synqt_numbers_only: "Numbers only",
  synqt_online_banking: "Online banking",
  synqt_ott_voucher: "OTT Voucher",
  synqt_passport_number: "Passport number",
  synqt_passport_number_optional: "Passport number (optional)",
  synqt_pay_offline: "Pay offline",
  synqt_payme: "PayMe",
  synqt_payment_code: "Payment code",
  synqt_payshap: "PayShap",
  synqt_pix: "Pix",
  synqt_postal_code: "Postal code",
  synqt_product_reference_optional: "Product reference (optional)",
  synqt_promptpay: "PromptPay",
  synqt_provider: "Provider",
  synqt_pse: "PSE",
  synqt_qr_ph: "QR Ph",
  synqt_qris: "QRIS",
  synqt_savings: "Savings",
  synqt_snapscan: "SnapScan",
  synqt_south_african_id_number: "South African ID number",
  synqt_south_african_id_number_optional: "South African ID number (optional)",
  synqt_tax_number_optional: "Tax number (optional)",
  synqt_the_12_digit_pin_on_your_voucher: "The 12-digit PIN on your voucher",
  synqt_title_optional: "Title (optional)",
  synqt_upi: "UPI",
  synqt_upi_id: "UPI ID",
  synqt_upi_id_optional: "UPI ID (optional)",
  synqt_upi_qr: "UPI QR",
  synqt_use_letters_numbers_and_only: "Use letters, numbers, - and _ only",
  synqt_use_letters_numbers_spaces_and_common_punctuatio: "Use letters, numbers, spaces and common punctuation only",
  synqt_use_numbers_only: "Use numbers only",
  synqt_verified_virtual_account: "Verified virtual account",
  synqt_vietqr: "VietQR",
  synqt_virtual_account: "Virtual account",
  synqt_voucher_pin: "Voucher PIN",
  synqt_where_you_are_paying: "Where you are paying",
  synqt_which_id_do_you_want_to_give: "Which ID do you want to give?",
  synqt_your_name: "Your name",
  synqt_zapper: "Zapper",
};

// Payer-facing text written for the payment sheet. Field labels, hints and method names are in formStringsEn.
// Translations copy this with the same keys, keeping the placeholders, and are listed in `translations`. Keys and
// text match the iOS, Android and Flutter SDKs. Draft wording awaiting sign-off is listed in the README.
const sheetStringsEn = {
  // Form
  synqt_sheet_your_details: "Your details",
  synqt_sheet_intro: "Enter your details to pay with %1$s.",
  synqt_sheet_intro_nothing_to_enter: "No details needed. Tap Pay to continue.",
  synqt_sheet_pay: "Pay %1$s",
  synqt_sheet_secure_checkout: "Secure checkout",
  synqt_sheet_choose_one: "Choose one",
  synqt_sheet_no_preference: "No preference",
  synqt_sheet_hint_bank_code: "The code from your bank or provider",
  synqt_sheet_hint_provider_code: "The code from your provider",
  synqt_sheet_required: "Required",
  synqt_sheet_check_field: "Check this field",
  // A field's label, then its error, in the banner when the field itself is not shown.
  synqt_sheet_field_error: "%1$s: %2$s",

  // Header, summary and processing
  synqt_sheet_logo: "Synqt",
  synqt_sheet_close: "Close",
  synqt_sheet_amount_due: "Amount due",
  synqt_sheet_paying: "Paying",
  synqt_sheet_payment_method: "Payment method",
  synqt_sheet_reference: "Reference",
  synqt_sheet_processing: "Processing your payment",
  synqt_sheet_processing_detail: "Keep this screen open. This can take a few seconds.",

  // Next step, for methods the payer finishes in another app
  synqt_next_title: "Finish paying with %1$s",
  synqt_next_open_or_scan: "Open %1$s on this phone to approve the payment, or scan the code below with %1$s on another phone.",
  synqt_next_open: "Open %1$s on this phone to approve the payment.",
  synqt_next_scan: "Scan the code below with %1$s on another phone.",
  // On a computer, where there is no app to open.
  synqt_next_scan_desktop: "Scan the code below with %1$s on your phone.",
  synqt_next_pay_exactly: "Pay exactly %1$s, not the original amount.",
  synqt_next_time_left: "Time left to pay",
  synqt_next_expired: "The time to pay has run out. Start a new payment to try again.",
  synqt_next_reference: "Reference: %1$s",
  synqt_next_open_app: "Open %1$s",
  synqt_next_done: "Done",
  synqt_next_no_app: "Nothing on this phone can open %1$s. Scan the QR code from another phone instead.",
  synqt_next_qr_description: "QR code to pay with %1$s",
  synqt_next_qr_loading: "Loading the QR code",
  synqt_next_qr_caption: "Scan with %1$s on another phone",

  // Next step for Pay offline: a bank transfer from the payer's own banking app
  synqt_next_transfer_title: "How to pay",
  synqt_next_transfer: "Open your banking app and make a bank transfer to the account below.",
  synqt_next_bank: "Bank",
  synqt_next_account_name: "Account holder",
  synqt_next_account_number: "Account number",
  synqt_next_account_type: "Account type",
  synqt_next_bank_code: "Bank code",
  synqt_next_branch: "Branch",
  synqt_next_reference_title: "One-time payment reference",
  synqt_next_reference_needed: "Your payment will fail without this reference.",
  // The copied value's label, such as "Account number".
  synqt_next_copy: "Copy %1$s",
  synqt_next_copied: "%1$s copied",
  synqt_next_notice_title: "Before you pay",
  // A numbered point of the notice: its number, then its text.
  synqt_next_notice_item: "%1$d. %2$s",
  synqt_next_notice_exact: "Transfer the exact amount due and use the one-time payment reference above.",
  synqt_next_notice_once: "The reference works for this payment only. Return to the merchant to make another payment.",
  synqt_next_notice_fees: "You pay your bank's transfer fee. Transfers made outside banking hours may take longer to arrive.",
  synqt_next_notice_own_account: "Pay from your own bank account. Payments from someone else's account are not accepted.",
  synqt_next_qr_failed: "The QR code could not be loaded.",

  // Errors. SYNQT's own descriptions arrive in English from its servers and are shown as sent.
  synqt_error_with_code: "%1$s (%2$s)",
  synqt_error_unreachable: "Could not reach SYNQT. Check the connection and try again.",
  synqt_error_system: "SYNQT could not process this payment (SYSTEM). Try again later or choose another method.",
  synqt_error_already_started: "This payment was already started with another payment method. Start a new payment to pay another way.",
  synqt_error_session_expired: "The payment session has expired (HTTP 401). Start the payment again.",
  synqt_error_not_allowed: "This payment session is not allowed to create this payment (HTTP 403).",
  synqt_error_http: "The payment could not be created (HTTP %1$d).",

  // Failure reasons, for payments SYNQT accepted and then failed, and for SYNQT's refusals of what the payer entered
  synqt_failure_general: "Your payment could not be completed. Please try again, or choose another payment method.",
  synqt_failure_payment_process_error: "Something went wrong while processing your payment. Please try again, or choose another payment method. If it keeps happening, contact the merchant.",
  synqt_failure_expired: "The payment was not approved in time. Start a new payment to try again.",
  synqt_failure_amount_mismatch: "The amount received did not match the amount due. Contact the merchant about this payment.",
  synqt_failure_method_unavailable: "This payment method is not available for this payment right now. Choose another payment method.",
  synqt_failure_bank_unavailable: "This bank is not available for this payment right now. Choose another bank or payment method.",
  synqt_failure_security: "This payment could not be completed for security reasons. Choose another payment method, or contact the merchant.",
  synqt_failure_balance: "There is not enough money in the account for this payment.",
  synqt_failure_account_number: "Check the account number and try again.",
  synqt_failure_account_name: "The name does not match the name on the account. Check it and try again.",
  synqt_failure_phone_number: "Check the mobile number and try again.",
  synqt_failure_id_number: "Check the ID number and try again.",
  synqt_failure_ifsc: "Check the IFSC code and try again.",
  synqt_failure_declined: "The payment was declined, so nothing was paid.",
  synqt_failure_not_verified: "The payment could not be verified. Please try again, or choose another payment method.",
  synqt_failure_account_ineligible: "This account cannot be used for this payment. Use another account or payment method.",
  synqt_failure_feature_unavailable: "This payment option is turned off or not available on your device. Check your banking app's settings, or choose another payment method.",
  synqt_failure_account_limit: "This payment is over your account's limit. Choose another payment method, or check your limits with your bank.",
  synqt_failure_not_registered: "You are not registered for this payment method. Register with your bank, or choose another payment method.",
  synqt_failure_voucher: "This voucher cannot be used for this payment. Check the voucher PIN, or use another voucher.",
};

/** Payer-facing text (a string key) for each of SYNQT's failure reason codes, whose own descriptions are written
 * for the merchant. */
const failureMessages = {
  SYSTEM: "synqt_failure_payment_process_error",
  PAYMENT_PROCESS_ERROR: "synqt_failure_payment_process_error",
  PAYMENT_METHOD_ERROR: "synqt_failure_payment_process_error",
  ENTITY_EXPIRED: "synqt_failure_expired",
  CUSTOMER_VERIFICATION_INACTIVITY: "synqt_failure_expired",
  DIFFERENT_AMOUNT_CONFIRMED: "synqt_failure_amount_mismatch",
  INCORRECT_CURRENCY: "synqt_failure_amount_mismatch",
  CURRENCY_NOT_SUPPORTED: "synqt_failure_method_unavailable",
  CURRENCY_PRECISION_EXCEEDED: "synqt_failure_method_unavailable",
  PAYMENT_METHOD_NOT_FOUND: "synqt_failure_method_unavailable",
  PAYMENT_CHANNEL_NO_ACTIVE_FOUND: "synqt_failure_method_unavailable",
  PAYMENT_CHANNEL_NO_OPENED_FOUND: "synqt_failure_method_unavailable",
  PAYMENT_CHANNEL_NO_SEGMENT_FOUND: "synqt_failure_method_unavailable",
  PAYMENT_CHANNEL_AMOUNT_LIMITS: "synqt_failure_method_unavailable",
  PAYMENT_CHANNEL_DAILY_LIMITS: "synqt_failure_method_unavailable",
  PAYMENT_OPERATOR_NOT_FOUND: "synqt_failure_bank_unavailable",
  PAYMENT_OPERATOR_INVALID: "synqt_failure_bank_unavailable",
  PAYMENT_OPERATOR_UNAVAILABLE: "synqt_failure_bank_unavailable",
  IP_DENIED: "synqt_failure_security",
  SECURITY_CHECK_FAILED: "synqt_failure_security",
  BALANCE_INSUFFICIENT: "synqt_failure_balance",
  INVALID_ACCOUNT_NUMBER: "synqt_failure_account_number",
  INVALID_ACCOUNT_NAME: "synqt_failure_account_name",
  NAME_SIMILARITY_CHECK_FAILED: "synqt_failure_account_name",
  INVALID_PHONE_NUMBER: "synqt_failure_phone_number",
  INVALID_ID_NUMBER: "synqt_failure_id_number",
  INVALID_IFSC: "synqt_failure_ifsc",
  CUSTOMER_VERIFICATION_REJECTED: "synqt_failure_declined",
  CUSTOMER_VERIFICATION_FAILED: "synqt_failure_not_verified",
  ACCOUNT_TYPE_INELIGIBLE: "synqt_failure_account_ineligible",
  FEATURE_UNAVAILABLE: "synqt_failure_feature_unavailable",
  CUSTOMER_ACCOUNT_LIMIT_EXCEEDED: "synqt_failure_account_limit",
  CUSTOMER_NOT_REGISTERED: "synqt_failure_not_registered",
  VOUCHER_INELIGIBLE: "synqt_failure_voucher",
};

/** The Synqt colour tokens from the brand design system as CSS custom properties, for the light and dark themes. */
const colorTokens = {
  light: [
    "--surface: #FFFFFF;",
    "--surface-panel: #F0F0F0;",
    "--text: #1A1C29;",
    "--text-muted: #4E5670;",
    "--on-accent: #1A1C29;",
    "--action: #B505BF;",
    "--on-action: #FFFFFF;",
    "/* Dark: magenta at 12%. */",
    "--action-tint: #FEEEFF;",
    "--eyebrow: #B505BF;",
    "--border: #E7EAF2;",
    "/* slate-muted: a 3:1 field edge in both themes (brand owner, 26 Oct 2026). */",
    "--border-control: #7A8296;",
    "--focus-ring: #1A1C29;",
    "--logo-ink: #1A1C29;",
    "--pressed-overlay: rgba(26,28,41,0.2);",
    "/* The icon, border and words of an error. Dark: danger-light (brand owner, 26 Oct 2026): #B4232C is 2.59:1 on the dark surface, this is 9.98:1. */",
    "--danger: #B4232C;",
    "/* Frames the error banner, with danger_line. */",
    "--danger-tint: #FCEBEC;",
    "--danger-line: #F2D1D3;",
  ].join('\n'),
  dark: [
    "--surface: #1A1C29;",
    "--surface-panel: #212536;",
    "--text: #FFFFFF;",
    "--text-muted: #A7AFC5;",
    "--on-accent: #1A1C29;",
    "--action: #F318FF;",
    "--on-action: #1A1C29;",
    "/* Dark: magenta at 12%. */",
    "--action-tint: rgba(243,24,255,0.12);",
    "--eyebrow: #F470FF;",
    "--border: #2A2F42;",
    "/* slate-muted: a 3:1 field edge in both themes (brand owner, 26 Oct 2026). */",
    "--border-control: #7A8296;",
    "--focus-ring: #27FFE2;",
    "--logo-ink: #FFFFFF;",
    "--pressed-overlay: rgba(255,255,255,0.2);",
    "/* The icon, border and words of an error. Dark: danger-light (brand owner, 26 Oct 2026): #B4232C is 2.59:1 on the dark surface, this is 9.98:1. */",
    "--danger: #FFB4AE;",
    "/* Frames the error banner, with danger_line. */",
    "--danger-tint: #212536;",
    "--danger-line: #FFB4AE;",
  ].join('\n'),
};
// END GENERATED

// ---- strings ----

    /**
     * Payer-facing text by language. To add one, copy both English files to `<language>` versions, translate them and
     * list them here, such as `af: { ...formStringsAf, ...sheetStringsAf }`. Keys are the Android SDK's string resource
     * names, so one translation serves every platform.
     */
    const translations = {
        en: {...formStringsEn, ...sheetStringsEn},
    };

    /**
     * Payer-facing text in the browser's language, falling back to English, then to the key itself. `%1$s` and `%1$d`
     * placeholders take `args` in order.
     * @param {string} key
     * @param {...(string|number)} args
     */
    function text(key, ...args) {
        const language = (globalThis.navigator?.language ?? 'en').split('-')[0];
        const template = translations[language]?.[key] ?? translations.en[key] ?? key;
        return template.replace(/%(\d+)\$[sd]/g, (_, position) => String(args[Number(position) - 1]));
    }

    /** Whether `key` has English text, so tests can catch a typo before a payer sees a raw key. */
    const hasText = (key) => key in translations.en;

// ---- results ----

    const DECIMAL = /^-?\d+(\.\d+)?$/;

    /**
     * An amount in major units (12.34, not 1234) and its ISO 4217 currency. IDR and INR take whole numbers only.
     * `amount` is kept as decimal text such as `'1250.00'`, so it is never rounded inside the page; a number is accepted
     * and turned into text.
     */
    class Money {
        /**
         * @param {string|number} amount
         * @param {string} currencyCode
         */
        constructor(amount, currencyCode) {
            this.amount = String(amount);
            this.currencyCode = currencyCode;
            if (!DECIMAL.test(this.amount)) {
                throw new SynqtArgumentError(`amount must be a decimal number such as 1250.00, not "${this.amount}"`);
            }
            Object.freeze(this);
        }

        /** The amount without trailing zeros, such as `12.3` for `12.30`, as the other SDKs write it into links. */
        get plainAmount() {
            return plain(this.amount);
        }

        // shortcut: the JSON number goes through a double, exact to 15 significant digits; send raw JSON if SYNQT ever takes longer amounts.
        toJSON() {
            return {amount: Number(this.amount), currencyCode: this.currencyCode};
        }

        /** R1,250.00 for rand, "USD 1,250.00" otherwise. */
        toString() {
            return formatMoney(this.amount, this.currencyCode);
        }
    }

    const plain = (amount) => (amount.includes('.') ? amount.replace(/\.?0+$/, '') : amount);

    /** The string key naming `code` for payers, or undefined if the sheet does not support it. */
    const methodName = (code) => methodForms.find((methodForm) => methodForm.code === code)?.name;

    /**
     * SYNQT refused a request. `errors` holds its reasons (for 406, the business errors such as INVALID_PHONE_NUMBER),
     * each `{ code, field, description }`, where `field` names the input it is about (SYNQT's attrCode). The raw response
     * is not kept: SYNQT echoes what the payer typed in it, which must not reach logs.
     */
    class SynqtAPIError extends Error {
        /**
         * @param {number} httpCode
         * @param {{code: string, field?: string, description?: string}[]} errors
         */
        constructor(httpCode, errors = []) {
            super(`SYNQT HTTP ${httpCode}` + (errors.length ? ': ' + errors.map((error) => error.code + (error.field ? ` (${error.field})` : '')).join(', ') : ''));
            this.name = 'SynqtAPIError';
            this.httpCode = httpCode;
            this.errors = errors;
        }
    }

    /**
     * The page passed something the SDK cannot send: a malformed payin ID or amount, an unknown method code, or a payment
     * method missing a field it needs (`path` names it).
     */
    class SynqtArgumentError extends Error {
        /**
         * @param {string} message
         * @param {string} [path]
         */
        constructor(message, path) {
            super(message);
            this.name = 'SynqtArgumentError';
            this.path = path;
        }
    }

// Loose JSON reading, as the other SDKs do: a missing, null or empty value reads as undefined rather than failing.

    /** The value as text, or undefined when it is missing, null, empty or not a scalar. */
    function jsonText(value) {
        if (typeof value === 'string') return value === '' ? undefined : value;
        if (typeof value === 'number' || typeof value === 'boolean') return String(value);
        return undefined;
    }

    const obj = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : undefined);
    const objects = (value) => (Array.isArray(value) ? value.filter(obj) : []);

    function decode(body) {
        try {
            return JSON.parse(body);
        } catch {
            return undefined;
        }
    }

    /** SYNQT error bodies, as a list or a single object. attrValue is dropped on purpose. */
    function parseErrors(body) {
        const json = decode(body);
        const items = Array.isArray(json) ? objects(json) : [obj(json)].filter(Boolean);
        return items.flatMap((item) => {
            const code = jsonText(item.code);
            return code ? [{code, field: jsonText(item.attrCode), description: jsonText(item.description)}] : [];
        });
    }

    /** After a 409, the payin `existing` must be the same payment being retried, not an earlier attempt with another method. */
    function requireSameMethod(existing, requested) {
        const used = jsonText(obj(obj(decode(existing))?.paymentMethodResponse)?.paymentMethodCode);
        if (used === undefined || used === requested) return;
        // The description is for developers; the sheet shows its own translatable message for this code.
        throw new SynqtAPIError(409, [
            {
                code: 'PAYIN_ALREADY_STARTED',
                description: `This payin was already started with ${used}. Start a new payin to pay another way.`
            },
        ]);
    }

    /**
     * What happened when a payin was created. Not proof of payment: check `payin.status()` (and your backend) for that.
     * - `{ type: 'redirect', httpMethod, url, formData }`: send the payer to `url`. GET: open it. POST: submit a form to it
     *   with one field per `formData` entry.
     * - `{ type: 'instructions', paymentMethod, nextStep }`: the payer finishes elsewhere. `paymentMethod` is SYNQT's
     *   `paymentMethodResponse` as sent; `nextStep` gathers what to show. The payment sheet already shows it.
     */
    function parseCreatePayin(body) {
        const response = obj(JSON.parse(body)) ?? {};
        const redirect = obj(response.redirectTo);
        const url = jsonText(redirect?.url);
        if (redirect && url) {
            const form = obj(decode(jsonText(redirect.data) ?? '')) ?? {};
            return {
                type: 'redirect',
                httpMethod: jsonText(redirect.method) ?? 'GET',
                url,
                formData: Object.fromEntries(Object.entries(form).map(([key, value]) => [key, jsonText(value) ?? ''])),
            };
        }
        const methodResponse = obj(response.paymentMethodResponse) ?? {};
        return {type: 'instructions', paymentMethod: methodResponse, nextStep: parseNextStep(methodResponse)};
    }

// Every deep link field in the spec; a method returns at most one.
    const APP_LINK_FIELDS = ['deepLink', 'zapperQrDeepLink', 'snapscanQrDeepLink', 'upiQrDeepLink', 'payMeDeepLink'];

    /**
     * What the payer does next, from whichever of these fields the method returned. On this device, open `appLink`; from
     * another phone, scan the image at `qrCodeImageURL` (a temporary link) or a QR code you draw from `qrCodeData`.
     * `amountToPay`, if set, is what the payer must pay exactly instead of the requested amount. `expiresAt` is ISO 8601.
     * `payInto` is, for OFFLINE, the account the payer transfers to from their own banking app, quoting `reference`.
     */
    function parseNextStep(response) {
        return {
            appLink: APP_LINK_FIELDS.map((fieldName) => jsonText(response[fieldName])).find(Boolean),
            qrCodeImageURL: jsonText(response.qrCode),
            qrCodeData: jsonText(response.qrRawData),
            amountToPay: parseMoney(response.moneyRequired),
            reference: jsonText(response.reference),
            expiresAt: jsonText(response.expireAt),
            // shortcut: OFFLINE only, as some methods' `account` is the payer's own; add others (such as VAPAY) once checked.
            payInto: jsonText(response.paymentMethodCode) === 'OFFLINE' ? obj(response.account) : undefined,
        };
    }

    const STATUSES = ['PROCESSING', 'SUCCESS', 'FAILED', 'REFUSED'];

    /**
     * A payin's state from GET /payins/{id}. `status` is PROCESSING, SUCCESS, FAILED, REFUSED, or UNKNOWN for one this SDK
     * version does not know (treat it like PROCESSING). `isFinal` is true for SUCCESS, FAILED and REFUSED.
     */
    function parsePayinStatus(response) {
        const process = obj(response.process) ?? {};
        const failure = obj(process.failureReasons);
        const code = jsonText(failure?.failureReasonCode);
        const status = STATUSES.includes(process.status) ? process.status : 'UNKNOWN';
        return {
            status,
            isFinal: status !== 'PROCESSING' && status !== 'UNKNOWN',
            requested: parseMoney(obj(response.paymentRequested)?.money),
            fee: parseMoney(response.fee),
            isTest: process.isTest === true || jsonText(process.isTest) === 'true',
            failureReason: code && {
                code,
                message: jsonText(failure.message),
                failedAt: jsonText(failure.failedAt),
                payerMessage: text(payerMessageKey(code) ?? 'synqt_failure_general'),
            },
            paymentMethod: obj(response.paymentMethodResponse),
            createdAt: jsonText(process.createdAt),
            processedAt: jsonText(process.processedAt),
        };
    }

    /** Payer-facing wording (a string key) for a SYNQT failure code, whose own description is meant for the merchant. */
    function payerMessageKey(code) {
        return Object.hasOwn(failureMessages, code) ? failureMessages[code] : undefined;
    }

    /**
     * A method SYNQT offers this merchant: `code`, `operators` (its banks or providers), `segmentCode`, and `name`, the
     * payer-facing name (undefined for methods the sheet does not support).
     */
    function parsePaymentOptions(response) {
        return objects(response.data).flatMap((method) => {
            const code = jsonText(method.paymentMethodCode);
            if (!code) return [];
            const key = methodName(code);
            return [{
                code,
                name: key && text(key),
                operators: parseOperators(method.paymentOperators),
                segmentCode: jsonText(method.segmentCode)
            }];
        });
    }

    /**
     * Banks and providers, `{ code, name, externalProviders: [{ code, name }] }`: send `code`, show `name`. Entries without
     * a code are skipped, a missing name shows the code.
     */
    function parseOperators(list) {
        return objects(list).flatMap((op) => {
            const code = jsonText(op.code);
            if (!code) return [];
            const externalProviders = objects(obj(op.externalProviders)?.providers).flatMap((provider) => {
                const pc = jsonText(provider.code);
                return pc ? [{code: pc, name: jsonText(provider.name) ?? pc}] : [];
            });
            return [{code, name: jsonText(op.name) ?? code, externalProviders}];
        });
    }

    function parseMoney(money) {
        const amount = jsonText(obj(money)?.amount);
        if (!amount || !DECIMAL.test(amount)) return undefined;
        return new Money(amount, jsonText(money.currencyCode) ?? '');
    }

    /**
     * Rand as R1,250.00 (the synqt-output-format convention); other currencies as "USD 1,250.00". Keeps extra decimals
     * the amount really has, so nothing is rounded away.
     */
    function formatMoney(amount, currencyCode) {
        const negative = amount.startsWith('-');
        const [whole, fraction = ''] = plain(negative ? amount.slice(1) : amount).split('.');
        const digits = `${negative ? '-' : ''}${whole.replace(/\B(?=(\d{3})+$)/g, ',')}.${fraction.padEnd(2, '0')}`;
        return currencyCode === 'ZAR' ? `R${digits}` : `${currencyCode} ${digits}`;
    }

// ---- method-form ----

// The payment forms' rules, apart from any screen. A form (generated into method-forms.js) is
// `{ code, name, fields, oneOfs }`. Each field is one payer-facing input for a text value of the payment method, keyed
// by its JSON path (such as `customerName.lastName`), with string keys for its label, hint, section and message:
// `{ path, label, kind, required, hint?, section?, minLength?, maxLength?, pattern?, invalid?, options? }`. `kind` is
// text, email, phone, number, choice, paymentOperator (the banks availablePaymentOptions returns for the method) or
// provider (the external providers of those banks). Each oneOf is a question, `{ question, choices }`, where the payer
// gives one of several details: a choice is `{ label, paths, required }`; once chosen its `required` paths must be
// filled in and its other paths are optional. The first choice is the default; other choices' fields are hidden and
// not sent.


    const isBlank = (value) => (value ?? '').trim() === '';

    /** Every provider of `operators`, once each, whichever bank the payer picks. */
    function providers(operators) {
        const seen = new Set();
        return operators.flatMap((operator) => operator.externalProviders).filter((provider) => !seen.has(provider.code) && seen.add(provider.code));
    }

    /** The first choice of each question, which the sheet starts with. */
    const defaultChoices = (form) => form.oneOfs.map((question) => question.choices[0]);

    /**
     * Whether the field at `path` is shown, checked and sent while `chosen` (one per question, in order) is picked. A
     * question with nothing chosen, as when `chosen` is empty, shows all its fields.
     */
    function shows(form, path, chosen) {
        return form.oneOfs.every((question, index) => index >= chosen.length || chosen[index].paths.includes(path) || !question.choices.some((choice) => choice.paths.includes(path)));
    }

    const mustFill = (path, chosen) => chosen.some((choice) => choice.required.includes(path));

    /** Payer-facing problems with `values`, as `{ attr, text }` by field path, found before anything is sent. */
    function problems(form, values, chosen = defaultChoices(form)) {
        return form.fields.filter((field) => shows(form, field.path, chosen)).map((field) => problem(field, values, mustFill(field.path, chosen))).filter(Boolean);
    }

    /**
     * Fields the sheet can leave out of view: those the page prefilled whose value is still in place and passes its
     * checks. Once the first and last name are filled in, the name's optional extras (title, middle name, suffix) are left
     * out too, so the whole name section goes. `values` are the form's current values.
     */
    function filledIn(form, values, prefill, chosen) {
        const filled = form.fields
            .filter((field) => !isBlank(values[field.path]) && values[field.path] === prefill[field.path] && !problem(field, values, mustFill(field.path, chosen)))
            .map((field) => field.path);
        const named = ['customerName.firstName', 'customerName.lastName'].every((path) => filled.includes(path));
        const extras = !named
            ? []
            : form.fields
                .filter((field) => field.path.startsWith('customerName.') && !filled.includes(field.path) && !field.required && isBlank(values[field.path]))
                .map((field) => field.path);
        return [...filled, ...extras];
    }

    /**
     * True when the payer has nothing left to give: the method has mandatory fields, every one shown for `chosen` is in
     * `filled`, and nothing fails its checks. Methods with only optional fields keep their form for the payer.
     */
    function readyToPay(form, values, filled, chosen) {
        const mandatory = form.fields.filter((field) => shows(form, field.path, chosen) && (field.required || mustFill(field.path, chosen)));
        return mandatory.length > 0 && mandatory.every((field) => filled.includes(field.path)) && problems(form, values, chosen).length === 0;
    }

    const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const patterns = new Map();

    /** A spec pattern, matched anywhere in the value as JSON Schema does; Unicode mode where it uses `\p`. */
    function regex(pattern) {
        if (!patterns.has(pattern)) patterns.set(pattern, new RegExp(pattern, pattern.includes('\\p') ? 'u' : ''));
        return patterns.get(pattern);
    }

    /**
     * The problem with one field, if any, as `{ attr, text }`. `mustFill` is for the required fields of the chosen choice,
     * which the spec itself marks optional.
     */
    function problem(field, values, mustFill = false) {
        const value = (values[field.path] ?? '').trim();
        const length = [...value].length;
        const malformed =
            value !== '' &&
            ((field.minLength != null && length < field.minLength) ||
                (field.maxLength != null && length > field.maxLength) ||
                (field.pattern != null && !regex(field.pattern).test(value)) ||
                (field.kind === 'email' && !EMAIL.test(value)));
        if (value === '' && (mustFill || field.required)) return {attr: field.path, text: text('synqt_sheet_required')};
        if (malformed) return {attr: field.path, text: text(field.invalid ?? 'synqt_sheet_check_field')};
        return undefined;
    }

    /**
     * The payment method object for `form` from `values` by path. Blank values are left out, so an optional section
     * nobody filled in is not sent. Throws `SynqtArgumentError` naming the path of a missing required value.
     */
    function buildPaymentMethod(form, values) {
        const method = {paymentMethodCode: form.code};
        for (const [path, value] of Object.entries(values)) {
            if (isBlank(value)) continue;
            const keys = path.split('.');
            const last = keys.pop();
            let at = method;
            for (const key of keys) at = at[key] ??= {};
            at[last] = value.trim();
        }
        validatePaymentMethod(method);
        return method;
    }

    const get = (object, path) => path.split('.').reduce((value, key) => (value == null ? undefined : value[key]), object);

    /**
     * Throws `SynqtArgumentError` when `method` is not a payment method SYNQT takes: an unknown `paymentMethodCode`, a
     * field the method does not have, or a missing field it needs. Unset (null or undefined) fields count as missing.
     */
    function validatePaymentMethod(method) {
        const code = method?.paymentMethodCode;
        const rules = paymentMethodRules[code];
        if (!rules) throw new SynqtArgumentError(`Unknown paymentMethodCode ${code}`);
        const walk = (object, prefix) => {
            for (const [key, value] of Object.entries(object)) {
                if (value == null || (!prefix && key === 'paymentMethodCode')) continue;
                const path = prefix + key;
                if (!rules.allowed.includes(path)) throw new SynqtArgumentError(`${code} does not take ${path}`, path);
                if (typeof value === 'object' && !Array.isArray(value)) walk(value, path + '.');
            }
        };
        walk(method, '');
        for (const path of rules.required) {
            const parent = path.includes('.') ? path.slice(0, path.lastIndexOf('.')) : '';
            if ((parent === '' || get(method, parent) != null) && get(method, path) == null) {
                throw new SynqtArgumentError(`${code} needs ${path}`, path);
            }
        }
    }

// ---- icons ----

// The sheet's line icons and the Synqt wordmark. Icon paths are Phosphor Icons, Regular weight (@phosphor-icons/core
// 2.1.1, MIT licence, see THIRD_PARTY_NOTICES.md), on Phosphor's 256 by 256 grid; the wordmark paths and offsets are
// the synqt-brand-design skill's synqt-logo-positive.svg. Copied from the other SDKs. Never redraw them.

    const iconPaths = {
        lock: 'M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Zm-68-56a12,12,0,1,1-12-12A12,12,0,0,1,140,152Z',
        close: 'M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z',
        warning: 'M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z',
        chevronDown: 'M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z',
        copy: 'M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z',
        timer: 'M128,40a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,40Zm0,176a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,216ZM173.66,90.34a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32-11.32l40-40A8,8,0,0,1,173.66,90.34ZM96,16a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,16Z',
    };

    /** The wordmark's letters, each [x, y, path] on the 154.854 by 51.266 artwork. */
    const logoLetters = [
        [0.0, 10.8311, 'M14.81 11.49 C10.65 10.99 8.19 10.76 8.19 8.58 C8.19 6.73 10.21 5.61 13.29 5.61 C16.38 5.61 18.68 7.01 18.90 9.31 L26.47 9.31 C26.08 3.42 20.75 0.00 13.01 0.00 C5.61 -0.06 0.62 3.70 0.62 9.42 C0.62 15.14 5.83 16.88 12.56 17.66 C17.22 18.28 19.18 18.45 19.18 20.81 C19.18 22.83 17.16 23.89 13.86 23.89 C9.99 23.89 7.80 22.15 7.52 19.63 L0.00 19.63 C0.34 25.80 5.78 29.56 13.80 29.56 C21.82 29.56 26.92 25.91 26.92 20.19 C26.92 13.68 21.43 12.17 14.81 11.49 Z'],
        [60.7460, 10.8827, 'M16.55 0.00 C12.12 0.00 9.48 1.68 7.63 3.93 L6.90 0.34 L0.00 0.34 L0.00 29.17 L7.91 29.17 L7.91 14.42 C7.91 9.43 10.26 6.51 14.36 6.51 C18.46 6.51 20.20 9.09 20.20 13.97 L20.20 29.17 L28.11 29.17 L28.11 13.18 C28.11 3.31 22.78 0.00 16.55 0.00 Z'],
        [92.6092, 10.8827, 'M23.05 0.34 L22.05 0.34 L22.05 3.93 C20.19 1.61 17.35 0.00 13.41 0.00 C5.67 -0.06 0.00 5.89 0.00 14.81 C0.00 23.73 5.66 29.50 13.35 29.50 C17.33 29.50 20.14 27.82 22.04 25.46 L22.04 34.46 L22.05 34.46 L22.05 35.99 C22.05 38.41 24.02 40.38 26.45 40.38 L29.95 40.38 L29.95 19.25 C29.95 16.83 27.99 14.86 25.56 14.86 L22.05 14.86 L22.05 16.33 C21.53 20.35 18.98 23.05 15.15 23.05 C10.83 23.05 8.08 19.62 8.08 14.69 C8.08 9.75 10.83 6.44 15.15 6.44 C18.83 6.44 21.32 8.89 21.98 12.67 L22.05 12.64 L22.05 12.69 L25.56 12.69 C27.96 12.69 29.90 10.77 29.95 8.39 L29.95 8.32 C29.95 8.32 29.95 8.31 29.95 8.30 L29.95 0.33 L23.05 0.33 L23.05 0.34 Z'],
        [126.7834, 0.0, 'M0.00 19.19 C0.00 21.61 1.97 23.58 4.40 23.58 L7.91 23.58 L7.91 21.66 L7.91 21.66 L7.91 17.89 L14.53 17.89 L14.53 11.22 L7.91 11.22 L7.91 0.00 L0.00 0.00 L0.00 17.90 L0.00 19.19 L0.00 19.19 Z'],
        [126.7928, 25.7395, 'M10.77 7.63 C8.69 7.63 7.91 6.79 7.91 4.77 L7.91 0.75 C7.91 0.75 7.91 0.75 7.90 0.75 L7.90 0.00 L4.39 0.00 C1.97 0.00 0.00 1.97 0.00 4.39 L0.00 4.51 L0.00 6.06 L0.00 6.81 L0.03 6.81 C0.27 11.80 3.01 14.30 8.25 14.30 L14.70 14.30 L14.70 7.62 L10.77 7.62 L10.77 7.63 Z'],
        [27.3574, 11.2183, 'M30.74 0.00 L22.27 0.00 L15.43 20.53 L8.41 0.00 L0.00 0.00 L11.09 28.96 L6.78 40.05 L11.37 40.05 C13.67 40.05 15.73 38.64 16.56 36.50 L18.65 31.11 L30.73 0.00 L30.74 0.00 Z'],
    ];

    /** The wordmark's dot, always brand magenta. */
    const logoDot = [145.7092, 31.0714, 'M4.57 9.14 C7.10 9.14 9.14 7.10 9.14 4.57 C9.14 2.05 7.10 0.00 4.57 0.00 C2.05 0.00 0.00 2.05 0.00 4.57 C0.00 7.10 2.05 9.14 4.57 9.14 Z'];

// ---- ui ----

// The sheet's look: Synqt colour tokens, Instrument Sans, icons, the wordmark and the Orbit loader. Colours are the
// synqt-brand-design skill's semantic tokens (design system artefact, 26 October 2026), the same values as the other
// SDKs. Mobile type scale in Instrument Sans, spacing in 4, 8, 16 and 24, 12 radius cards and inputs, 48 high pill buttons, a
// visible focus ring, light and dark. Text sizes are in rem, so they grow with the browser's text size.


    const MAGENTA = '#F318FF';
    /** Brand aqua, for the Orbit loader only. The brand keeps aqua for dark grounds; its use on light is an open point. */
    const AQUA = '#27FFE2';

    /** An inline SVG icon; decorative, as the control it sits on carries the label. */
    const icon = (name, size = 24) =>
        `<svg class="icon" aria-hidden="true" focusable="false" viewBox="0 0 256 256" style="width:${size / 16}rem;height:${size / 16}rem"><path fill="currentColor" d="${iconPaths[name]}"/></svg>`;

    /** The Synqt wordmark, 26 high: letters in the logo ink (positive on light, negative on dark), the dot always magenta. */
    const logo = (label) =>
        `<svg class="logo" role="img" aria-label="${label.replace(/[&"<]/g, (character) => `&#${character.charCodeAt(0)};`)}" viewBox="0 0 154.854 51.266"><g fill="var(--logo-ink)">` +
        logoLetters.map(([x, y, pathData]) => `<path transform="translate(${x} ${y})" d="${pathData}"/>`).join('') +
        `</g><path fill="${MAGENTA}" transform="translate(${logoDot[0]} ${logoDot[1]})" d="${logoDot[2]}"/></svg>`;

    let fontsAdded = false;

    /** Instrument Sans, from the SDK's own font files. @font-face does not work inside a shadow root, so it goes in the page once. */
    function addFonts() {
        if (fontsAdded) return;
        fontsAdded = true;
        const face = (file, weight) =>
            `@font-face{font-family:SynqtInstrumentSans;font-weight:${weight};font-display:swap;src:url(${new URL(`fonts/${file}`, SCRIPT_URL || location.href)}) format("truetype")}`;
        const style = document.createElement('style');
        style.textContent = face('synqt_instrument_sans_regular.ttf', 400) + face('synqt_instrument_sans_medium.ttf', 500) + face('synqt_instrument_sans_semibold.ttf', 600);
        document.head.append(style);
    }

    const css = `
:host { all: initial; }
dialog {
${colorTokens.light}
  color-scheme: light;
  font-family: SynqtInstrumentSans, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 1rem; line-height: 1.3; color: var(--text); background: var(--surface);
  border: 0; padding: 0; margin: auto auto 0; width: 100%; max-width: 100%; max-height: 92dvh;
  border-radius: 16px 16px 0 0; box-sizing: border-box; overflow: hidden;
}
@media (prefers-color-scheme: dark) {
  dialog {
${colorTokens.dark}
    color-scheme: dark;
  }
}
@media (min-width: 600px) { dialog { margin: auto; max-width: 500px; border-radius: 16px; max-height: 88dvh; } }
dialog[open] { display: flex; flex-direction: column; }
dialog::backdrop { background: rgba(26,28,41,.5); }
*, *::before, *::after { box-sizing: border-box; }
:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
h2, h3, p, fieldset, legend { margin: 0; padding: 0; border: 0; }
[hidden] { display: none !important; }
.icon { display: block; flex: none; }
header { display: flex; align-items: center; justify-content: space-between; padding: 8px 6px 8px 16px; border-bottom: 1px solid var(--border); }
.logo { height: 26px; width: auto; display: block; }
.icon-button { min-width: 44px; min-height: 44px; display: grid; place-items: center; background: none; border: 0; border-radius: 22px; color: var(--text); cursor: pointer; padding: 0; }
.icon-button:hover { background: var(--pressed-overlay); }
.icon-button.muted { color: var(--text-muted); }
.body { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 16px 16px 8px; }
footer { border-top: 1px solid var(--border); padding: 8px 16px 16px; display: flex; flex-direction: column; gap: 8px; }
.card { background: var(--surface-panel); border-radius: 12px; padding: 16px; }
.eyebrow { font-size: .8125rem; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; color: var(--eyebrow); }
.amount { font-size: 1.75rem; font-weight: 600; font-variant-numeric: tabular-nums; margin: 4px 0 16px; }
.rule { border: 0; border-top: 1px solid var(--border); margin: 0; }
.row { display: flex; align-items: center; gap: 16px; padding-top: 8px; min-height: 2rem; }
.row .label { color: var(--text-muted); }
.row .value { flex: 1; text-align: end; font-weight: 500; overflow-wrap: anywhere; }
.num { font-variant-numeric: tabular-nums; }
.row .copy-slot { width: 44px; flex: none; }
.title { font-size: 1.25rem; font-weight: 400; margin: 24px 0 8px; }
.muted { color: var(--text-muted); }
.intro { margin-bottom: 16px; }
.section { font-size: 1.0625rem; font-weight: 600; margin: 8px 0 16px; display: block; }
.field { margin-bottom: 16px; }
.field label { display: block; font-weight: 500; margin-bottom: 8px; }
.field input, .field select {
  width: 100%; min-height: 52px; padding: 0 16px; font: inherit; color: var(--text); background: var(--surface);
  border: 1px solid var(--border-control); border-radius: 12px; appearance: none;
}
.field select { padding-right: 48px; background-image: none; }
.select { position: relative; }
.select .icon { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); pointer-events: none; }
.field input::placeholder { color: var(--text-muted); opacity: 1; }
.field input:focus, .field select:focus { outline: none; border: 2px solid var(--focus-ring); padding-left: 15px; }
.field [aria-invalid="true"] { border-color: var(--danger); }
.help { font-size: .8125rem; color: var(--text-muted); margin-top: 4px; }
.help.error { color: var(--danger); }
.help:empty { display: none; }
.tiles { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.tile { display: flex; align-items: center; gap: 12px; min-height: 56px; padding: 8px 16px; border: 1px solid var(--border-control); border-radius: 12px; font-weight: 500; cursor: pointer; background: var(--surface); }
.tile:has(input:checked) { border: 2px solid var(--action); background: var(--action-tint); padding: 7px 15px; }
.tile input { appearance: none; margin: 0; width: 20px; height: 20px; border: 2px solid var(--text-muted); border-radius: 50%; flex: none; display: grid; place-items: center; }
.tile input:checked { border-color: var(--action); }
.tile input:checked::after { content: ""; width: 10px; height: 10px; border-radius: 50%; background: var(--action); }
.banner { display: flex; gap: 8px; align-items: flex-start; padding: 16px; margin-bottom: 16px; border-radius: 12px; background: var(--danger-tint); border: 1px solid var(--danger-line); color: var(--danger); white-space: pre-line; }
.button { min-height: 48px; width: 100%; padding: 12px 24px; border-radius: 999px; border: 0; font: inherit; font-weight: 500; font-variant-numeric: tabular-nums; cursor: pointer; background: var(--action); color: var(--on-action); }
.button:hover { box-shadow: inset 0 0 0 100px var(--pressed-overlay); }
.button.outline { background: var(--surface); color: var(--text); border: 1px solid var(--border-control); }
.secure { display: flex; justify-content: center; align-items: center; gap: 8px; font-size: .8125rem; color: var(--text-muted); }
.processing { position: absolute; inset: 0; background: var(--surface); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 32px; gap: 8px; z-index: 2; }
.processing canvas { width: 72px; height: 72px; margin-bottom: 16px; }
.processing h2 { font-size: 1.25rem; font-weight: 400; }
.reference-card { border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin: 24px 0 8px; display: flex; flex-direction: column; align-items: flex-end; text-align: end; }
.reference-line { display: flex; align-items: center; justify-content: flex-end; width: 100%; margin-right: -12px; }
.reference-value { font-size: 1.5rem; font-weight: 600; overflow-wrap: anywhere; user-select: all; }
.countdown { font-size: 1.75rem; font-weight: 600; font-variant-numeric: tabular-nums; display: flex; gap: 8px; align-items: center; }
.reference-card .rule { width: 100%; margin: 16px 0 8px; }
.expired { color: var(--danger); }
.strong { font-weight: 500; margin-bottom: 8px; }
.notice { margin: 16px 0 8px; }
.notice h3 { font-size: 1rem; font-weight: 500; }
.notice p { margin-top: 8px; }
.qr { display: flex; flex-direction: column; align-items: center; margin: 16px 0; }
.qr-box { width: 240px; height: 240px; padding: 12px; background: #FFFFFF; border: 1px solid var(--border); border-radius: 12px; }
.qr-box img { width: 100%; height: 100%; image-rendering: pixelated; display: block; }
.qr p { font-size: .8125rem; margin-top: 8px; text-align: center; }
.toast { position: absolute; left: 50%; bottom: 96px; transform: translateX(-50%); background: var(--text); color: var(--surface); padding: 8px 16px; border-radius: 999px; z-index: 3; white-space: nowrap; }
.toast:empty { display: none; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
`;

    /** Frames in one loop of the Lottie file (60fps), and how far aqua runs behind magenta. */
    const ORBIT_LOOP = 174;
    const ORBIT_DELAY = 7.2;

    /**
     * The Synqt Orbit loader on `canvas`, drawn from the designer's Lottie file (synqt-loaders/lottie/orbit-*.json): a hub
     * in the text colour, with a magenta and an aqua dot that each turn once, glide into the hub and back out. Decorative,
     * so the canvas is hidden from screen readers; with reduced motion on it holds still. Returns a function that stops it.
     */
    function orbitLoader(canvas) {
        canvas.setAttribute('aria-hidden', 'true');
        const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
        let frameId;
        const draw = (ms) => {
            const size = canvas.clientWidth || 72;
            const scale = devicePixelRatio || 1;
            if (canvas.width !== size * scale) canvas.width = canvas.height = size * scale;
            const context = canvas.getContext('2d');
            context.setTransform(scale, 0, 0, scale, 0, 0);
            context.clearRect(0, 0, size, size);
            const unit = size / 100; // the Lottie canvas is 100 by 100
            const dot = (x, y, color) => {
                context.fillStyle = color;
                context.beginPath();
                context.arc(x, y, 11 * unit, 0, 2 * Math.PI);
                context.fill();
            };
            const centre = size / 2;
            dot(centre, centre, getComputedStyle(canvas).color);
            const frame = still ? 0 : (ms / 1000) * 60;
            // Later dots are drawn on top, as in the Lottie file: hub, then aqua, then magenta.
            for (const [offset, color] of [[ORBIT_DELAY, AQUA], [0, MAGENTA]]) {
                const [angle, distance] = orbitDot(frame - offset);
                const rad = (angle * Math.PI) / 180;
                dot(centre + distance * unit * Math.sin(rad), centre - distance * unit * Math.cos(rad), color);
            }
            if (!still) frameId = requestAnimationFrame(draw);
        };
        frameId = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(frameId);
    }

    /**
     * Where an Orbit dot is at `frame` (60fps, looping every 174): degrees clockwise from the top, and distance from the
     * centre on the 100-unit canvas. Keyframes from the Lottie file: turn 0 to 96.05, glide in to 120.06, wait, glide out
     * from 149.99 to 174.
     */
    function orbitDot(frame) {
        const loopFrame = ((frame % ORBIT_LOOP) + ORBIT_LOOP) % ORBIT_LOOP;
        const angle = loopFrame < 96.05 ? 360 * ease(loopFrame / 96.05) : 360;
        if (loopFrame < 96.05) return [angle, 40];
        if (loopFrame < 120.06) return [angle, 40 * (1 - ease((loopFrame - 96.05) / 24.01))];
        if (loopFrame < 149.99) return [angle, 0];
        return [angle, 40 * ease((loopFrame - 149.99) / 24.01)];
    }

    /** The file's one easing curve, cubic-bezier(0.65, 0, 0.35, 1), solved for x by bisection. */
    function ease(progress) {
        const bezier = (curveTime, firstControl, secondControl) => 3 * (1 - curveTime) * (1 - curveTime) * curveTime * firstControl + 3 * (1 - curveTime) * curveTime * curveTime * secondControl + curveTime * curveTime * curveTime;
        let lo = 0;
        let hi = 1;
        for (let step = 0; step < 24; step++) {
            const mid = (lo + hi) / 2;
            if (bezier(mid, 0.65, 0.35) < progress) lo = mid;
            else hi = mid;
        }
        return bezier((lo + hi) / 2, 0, 1);
    }

// ---- sheet-model ----

    /**
     * The payment sheet's state and behaviour, apart from the DOM: Pay checks the values, builds the payment method and
     * hands it to `submit`; a processing state covers the form meanwhile, and every error comes back next to its field.
     * The view sets `onChange`, and how to open links, copy text, announce errors and close the sheet.
     */
    class PaymentSheetModel {
        /**
         * @param {{form: object, prefill: Record<string, string>, operators: object[], summary: {amount: string, merchant?: string, method: string, reference: string}, submit: (method: object) => Promise<object>}} p
         */
        constructor({form, prefill, operators, summary, submit}) {
            this.form = form;
            this.summary = summary;
            this.methodName = text(form.name);
            this._operators = operators;
            this._submit = submit;
            /** The fields the payer could fill in: an optional bank with no list from SYNQT has nothing to choose, so it goes. */
            this.inputs = form.fields.filter((field) => !(field.kind === 'paymentOperator' && operators.length === 0 && !field.required));
            /** @type {Record<string, string>} */
            this.values = {};
            // A dropdown keeps a prefill only if it is one of its options; one that is not is flagged below.
            const offList = new Set();
            for (const field of this.inputs) {
                const value = prefill[field.path] ?? '';
                const choices = choicesFor(field, operators);
                if (choices && !choices.some((option) => option.value === value)) {
                    this.values[field.path] = '';
                    if (!isBlank(value)) offList.add(field.path);
                } else this.values[field.path] = value;
            }
            /** The choice picked for each question: the one the page prefilled, else the first. */
            this.chosen = form.oneOfs.map((question) => question.choices.find((choice) => !isBlank(prefill[choice.paths[0]])) ?? question.choices[0]);
            /** Error text by field path. */
            this.marks = {};
            this.banner = undefined;
            this.processing = false;
            this.next = undefined;
            this.appProblem = undefined;
            this.toast = undefined;
            /** The field (or 'banner') to scroll to and focus, with a counter so asking for the same one twice still moves there. */
            this.focusRequest = undefined;
            /** The payin result once SYNQT accepted it, returned however the payer closes the sheet afterwards. */
            this.accepted = undefined;
            // Fields are checked as the payer goes, but a field they have not typed in only shows "Required" after Pay.
            this._edited = new Set();
            this._invalid = new Set(); // showing a problem found here, rechecked on every change
            this._refused = new Set(); // showing SYNQT's error, kept until the payer edits that field
            this._focused = undefined;
            this._finished = false;
            this.filledIn = new Set(); // _clearOthers keeps it in step, so it exists first
            this.chosen.forEach((choice, questionIndex) => this._clearOthers(questionIndex, choice));
            /** Fields the page prefilled with a value that passes its checks: hidden, but still sent. Shown again if SYNQT refuses it. */
            this.filledIn = new Set(filledIn(form, this.effectiveValues(), prefill, this.chosen));
            // A prefilled value left in view failed its checks, so its error shows from the start.
            for (const field of this.inputs) {
                if (isBlank(prefill[field.path]) || !this.visible(field.path)) continue;
                if (!offList.has(field.path)) this._check(field.path);
                else {
                    this.marks[field.path] = text('synqt_sheet_check_field'); // a field's own invalid text is about typing, not picking
                    this._invalid.add(field.path);
                }
            }

            // Set by the view.
            this.onChange = () => {
            };
            this.onFinish = (_result) => {
            };
            this.onPaymentStarted = () => {
            };
            /** Opens a link in a new tab, or the app that claims it; false if the browser refused. */
            this.openLink = (_link) => false;
            this.copy = (_value) => {
            };
            /** Reads text out to screen reader users without moving their focus. */
            this.announce = (_message) => {
            };
        }

        /** Everything mandatory came from the page, so pay straight away; any refusal brings the form back with the error. */
        start() {
            if (readyToPay(this.form, this.effectiveValues(), [...this.filledIn], this.chosen)) this.pay();
        }

        /** Values as they are checked and sent: fields of choices the payer did not pick read as blank. */
        effectiveValues() {
            return Object.fromEntries(this.inputs.map((field) => [field.path, shows(this.form, field.path, this.chosen) ? this.values[field.path] ?? '' : '']));
        }

        /** The choices for a dropdown field, with "Choose one" or "No preference" first, or undefined for a typed field. */
        options(field) {
            const choices = choicesFor(field, this._operators);
            if (!choices) return undefined;
            // A provider is only asked for when it is needed, so it never offers "No preference".
            const header = text(field.required || field.kind === 'provider' ? 'synqt_sheet_choose_one' : 'synqt_sheet_no_preference');
            return [{value: '', label: header}, ...choices];
        }

        /** The hint under a field. A bank or provider the payer types (SYNQT listed none) says what to type. */
        hint(field) {
            if (!this.options(field) && field.kind === 'paymentOperator') return text('synqt_sheet_hint_bank_code');
            if (!this.options(field) && field.kind === 'provider') return text('synqt_sheet_hint_provider_code');
            return field.hint ? text(field.hint) : '';
        }

        visible(path) {
            return shows(this.form, path, this.chosen) && !this.filledIn.has(path);
        }

        /** A question is hidden once the page filled in every field of the chosen answer. */
        questionVisible(questionIndex) {
            return !this.chosen[questionIndex].paths.filter((path) => this.inputs.some((field) => field.path === path)).every((path) => this.filledIn.has(path));
        }

        /** Everything filled in by the page: the whole details section goes, leaving the summary and Pay. */
        get allFilledIn() {
            return this.inputs.length > 0 && !this.inputs.some((field) => this.visible(field.path));
        }

        get intro() {
            return this.inputs.length === 0 ? text('synqt_sheet_intro_nothing_to_enter') : text('synqt_sheet_intro', this.methodName);
        }

        /** The payer typed in a field. As the Android sheet's length filter, longer input is cut off. */
        setValue(field, value) {
            const chars = [...value];
            this.values[field.path] = field.maxLength != null && chars.length > field.maxLength ? chars.slice(0, field.maxLength).join('') : value;
            this._edited.add(field.path);
            if (this._refused.delete(field.path)) delete this.marks[field.path];
            if (this._invalid.has(field.path)) this._check(field.path);
            this.onChange();
        }

        /** Focus moved; the field it left is checked if the payer typed in it. */
        focus(path, isFocused) {
            if (isFocused) {
                this._focused = path;
                return;
            }
            if (this._focused !== path) return;
            this._focused = undefined;
            if (this._edited.has(path) && !this._refused.has(path)) {
                const before = this.marks[path];
                this._check(path);
                this.onChange();
                const field = this.inputs.find((input) => input.path === path);
                if (this.marks[path] && this.marks[path] !== before) this.announce(text('synqt_sheet_field_error', text(field.label), this.marks[path]));
            }
        }

        _check(path) {
            const field = this.form.fields.find((candidate) => candidate.path === path);
            const message = problem(field, this.effectiveValues(), this.chosen.some((choice) => choice.required.includes(path)))?.text;
            if (message === undefined) {
                delete this.marks[path];
                this._invalid.delete(path);
            } else {
                this.marks[path] = message;
                this._invalid.add(path);
            }
        }

        /** Shows the picked choice's fields. The others are emptied, so a detail the payer switched away from is never sent. */
        choose(questionIndex, choice) {
            this.chosen = this.chosen.map((current, index) => (index === questionIndex ? choice : current));
            this._clearOthers(questionIndex, choice);
            this.onChange();
        }

        _clearOthers(questionIndex, choice) {
            for (const path of this.form.oneOfs[questionIndex].choices.flatMap((otherChoice) => otherChoice.paths)) {
                if (choice.paths.includes(path) || !(path in this.values)) continue;
                this.values[path] = '';
                delete this.marks[path];
                this._edited.delete(path);
                this._invalid.delete(path);
                this._refused.delete(path);
                this.filledIn.delete(path); // emptied, so the payer enters it if they come back to this choice
            }
        }

        pay() {
            if (this.processing) return;
            this.marks = {};
            this._invalid.clear();
            this._refused.clear();
            this.banner = undefined;
            const values = this.effectiveValues();
            const found = problems(this.form, values, this.chosen);
            if (found.length) return this._showErrors(found);
            let method;
            try {
                method = buildPaymentMethod(this.form, values);
            } catch (error) {
                if (!(error instanceof SynqtArgumentError)) throw error;
                return this._showErrors([{attr: error.path, text: text('synqt_sheet_required')}]);
            }
            // While the request runs the form, close button included, is covered so the sheet cannot be closed half way through.
            this.processing = true;
            this.onChange();
            this.announce(text('synqt_sheet_processing'));
            this.onPaymentStarted();
            return this._send(method);
        }

        async _send(method) {
            try {
                const result = await this._submit(method);
                const nextStep = result.type === 'instructions' ? result.nextStep : undefined;
                if (nextStep && (nextStep.appLink || nextStep.qrCodeImageURL || nextStep.payInto)) {
                    this.accepted = result;
                    this.next = nextStep;
                } else {
                    this.finish(result);
                }
            } catch (error) {
                if (error instanceof SynqtAPIError) this._showErrors(payinErrors(error), true);
                // fetch rejects with a TypeError when SYNQT cannot be reached, and a TimeoutError after 30 seconds.
                else if (error instanceof TypeError || error?.name === 'TimeoutError') this._showErrors([{text: text('synqt_error_unreachable')}]);
                else this._showErrors([{text: text('synqt_failure_general')}]);
            } finally {
                this.processing = false;
                this.onChange();
            }
        }

        /** Completes the sheet once, however it is closed. */
        finish(result) {
            if (this._finished) return;
            this._finished = true;
            this.onFinish(result);
        }

        /** Close or Done: the accepted result if SYNQT took the payment, else null. */
        close() {
            this.finish(this.accepted ?? null);
        }

        /** Opens the method's app (or its web page, where no app claims the link). */
        openApp() {
            const link = this.next?.appLink;
            if (!link) return;
            if (!this.openLink(link)) {
                this.appProblem = text('synqt_next_no_app', this.methodName);
                this.onChange();
                this.announce(this.appProblem);
            }
        }

        copyValue(label, value) {
            this.copy(value);
            const message = text('synqt_next_copied', label);
            this.toast = message;
            this.onChange();
            setTimeout(() => {
                if (this.toast !== message) return;
                this.toast = undefined;
                this.onChange();
            }, 2000);
        }

        /**
         * Errors for a shown field go under it; the rest go in the banner above the Pay button, named by label, not JSON
         * path. The first field with an error is scrolled to and focused, and screen readers read every error out.
         */
        _showErrors(errors, fromSynqt = false) {
            const general = [];
            const spoken = [];
            let first;
            for (const error of errors) {
                const path = error.attr && this.form.fields.find((field) => error.attr === field.path || error.attr.endsWith('.' + field.path))?.path;
                const input = this.inputs.find((field) => field.path === path);
                if (path && input && shows(this.form, path, this.chosen)) {
                    this.filledIn.delete(path); // a prefilled value was refused: let the payer correct it
                    this.marks[path] = error.text;
                    spoken.push(text('synqt_sheet_field_error', text(input.label), error.text));
                    (fromSynqt ? this._refused : this._invalid).add(path);
                    first ??= path;
                } else {
                    const field = path && this.form.fields.find((candidate) => candidate.path === path);
                    general.push(field ? text('synqt_sheet_field_error', text(field.label), error.text) : error.text);
                }
            }
            if (general.length) this.banner = general.join('\n');
            this.announce([...spoken, ...general].join('\n'));
            const target = first ?? (general.length ? 'banner' : undefined);
            if (target) this.focusRequest = {path: target, count: (this.focusRequest?.count ?? 0) + 1};
            this.onChange();
        }
    }

    function choicesFor(field, operators) {
        switch (field.kind) {
            case 'choice':
                return field.options.map((option) => ({value: option.value, label: text(option.label)}));
            case 'paymentOperator':
                return operators.length ? operators.map((operator) => ({value: operator.code, label: operator.name})) : undefined;
            case 'provider': {
                // Typed when SYNQT lists no providers.
                const ps = providers(operators);
                return ps.length ? ps.map((provider) => ({value: provider.code, label: provider.name})) : undefined;
            }
            default:
                return undefined;
        }
    }

    /** Payer-facing messages, `{ attr, text }`, for a refused POST /payins. */
    function payinErrors(apiError) {
        const messages = apiError.errors.map((err) => {
            if (err.code === 'SYSTEM') return {attr: err.field, text: text('synqt_error_system')};
            if (err.code === 'PAYIN_ALREADY_STARTED') return {
                attr: err.field,
                text: text('synqt_error_already_started')
            };
            // SYNQT's description is written for the merchant (and may echo payer data), so it is never shown.
            const key = payerMessageKey(err.code) ?? (err.field ? 'synqt_sheet_check_field' : 'synqt_failure_general');
            return {attr: err.field, text: text('synqt_error_with_code', text(key), err.code)};
        });
        if (messages.length) return messages;
        if (apiError.httpCode === 401) return [{text: text('synqt_error_session_expired')}];
        if (apiError.httpCode === 403) return [{text: text('synqt_error_not_allowed')}];
        return [{text: text('synqt_error_http', apiError.httpCode)}];
    }

    /** Time from `now` to `iso` as "01:59:17", or "" once it has passed. Undefined if `iso` is unreadable. */
    function timeLeft(iso, now = Date.now()) {
        const at = Date.parse(iso);
        if (Number.isNaN(at)) return undefined;
        const secs = Math.floor((at - now) / 1000);
        const two = (number) => String(number).padStart(2, '0');
        return secs <= 0 ? '' : `${two(Math.floor(secs / 3600))}:${two(Math.floor((secs % 3600) / 60))}:${two(secs % 60)}`;
    }

// ---- sheet ----

    /** Builds an element. `on*` attributes become listeners; false and undefined attributes are left out. */
    function el(tag, attrs = {}, ...children) {
        const element = document.createElement(tag);
        for (const [name, value] of Object.entries(attrs)) {
            if (name === 'class') element.className = value;
            else if (name === 'html') element.innerHTML = value; // only ever the SDK's own icons
            else if (name.startsWith('on')) element.addEventListener(name.slice(2), value);
            else if (value !== undefined && value !== false) element.setAttribute(name, value === true ? '' : value);
        }
        element.append(...children.filter((child) => child != null && child !== false));
        return element;
    }

// Links come from SYNQT's response; anything that would run in this page is never opened.
    const UNSAFE_LINK = /^\s*(javascript|data|vbscript|file):/i;
    const QR_IMAGE = /^(https:|data:image\/)/i;

    /** The value, unless it is blank or the "-" SYNQT sends for a detail it does not have. */
    const shown = (value) => (typeof value !== 'string' || value.trim() === '' || value === '-' ? undefined : value);

    const AUTOCOMPLETE = {
        emailAddress: 'email',
        phoneNumber: 'tel',
        'customerName.titleBefore': 'honorific-prefix',
        'customerName.firstName': 'given-name',
        'customerName.middleName': 'additional-name',
        'customerName.lastName': 'family-name',
        'customerName.titleAfter': 'honorific-suffix',
    };

    /**
     * Shows `model` as a modal dialog (a bottom sheet on narrow screens, a centred card on wider ones) and resolves with
     * its result once, however it closes. Only the close button, Done or Escape close it, never a click outside, and none
     * of them while a payment is being sent. It sits in a shadow root, so the page's styles do not reach it.
     */
    function showPaymentSheet(model, {onPresented, signal} = {}) {
        addFonts();
        const host = el('div', {'data-synqt-sheet': ''});
        const root = host.attachShadow({mode: 'closed'});
        const coarse = matchMedia('(pointer: coarse)').matches;
        const timers = [];
        let stopLoader;
        let nextBuilt = false;
        let focusCount = 0;

        const live = el('div', {class: 'sr', 'aria-live': 'assertive'});
        const toast = el('div', {class: 'toast', role: 'status'});
        const close = el('button', {
            type: 'button',
            class: 'icon-button',
            'aria-label': text('synqt_sheet_close'),
            html: icon('close'),
            onclick: () => model.close()
        });
        const header = el('header', {}, el('span', {html: logo(text('synqt_sheet_logo'))}), close);
        const formView = el('div');
        const nextView = el('div', {hidden: true});
        const body = el('div', {class: 'body'}, formView, nextView);
        const footer = el('footer');
        const loader = el('canvas');
        const processing = el('div', {class: 'processing', hidden: true},
            loader,
            el('h2', {}, text('synqt_sheet_processing')),
            el('p', {class: 'muted'}, text('synqt_sheet_processing_detail')));
        const dialog = el('dialog', {'aria-label': text('synqt_sheet_pay', model.summary.amount)}, header, body, footer, processing, toast, live);
        root.append(el('style', {}, css), dialog);

        // The form, built once; update() shows, hides and fills its parts.
        const fields = new Map();
        const headings = [];
        const questions = [];
        const details = [el('h2', {class: 'title'}, text('synqt_sheet_your_details')), el('p', {class: 'muted intro'}, model.intro)];
        const banner = el('div', {class: 'banner', tabindex: '-1', hidden: true});
        formView.append(summaryCard(model.summary.amount, true), ...details);

        const field = (formField) => {
            const id = `f${fields.size}`;
            const options = model.options(formField);
            const help = el('p', {class: 'help', id: id + 'h'});
            const common = {id, 'aria-describedby': id + 'h', required: formField.required};
            const input = options
                ? el('select', {
                    ...common,
                    onchange: () => model.setValue(formField, input.value)
                }, ...options.map((option) => el('option', {value: option.value}, option.label)))
                : el('input', {
                    ...common,
                    type: formField.kind === 'email' ? 'email' : formField.kind === 'phone' ? 'tel' : 'text',
                    inputmode: formField.kind === 'number' ? 'numeric' : formField.kind === 'email' ? 'email' : formField.kind === 'phone' ? 'tel' : undefined,
                    autocomplete: AUTOCOMPLETE[formField.path] ?? 'off',
                    placeholder: formField.placeholder ? text(formField.placeholder) : undefined,
                    autocapitalize: formField.path.endsWith('Name') ? 'words' : formField.kind === 'text' ? undefined : 'off',
                    spellcheck: formField.kind === 'text' && formField.path.endsWith('Name') ? undefined : 'false',
                    enterkeyhint: 'done',
                    oninput: () => model.setValue(formField, input.value),
                    // Enter closes the keyboard so the payer can review; it never pays.
                    onkeydown: (event) => {
                        if (event.key !== 'Enter' || event.isComposing) return;
                        event.preventDefault();
                        input.blur();
                    },
                    onfocus: () => model.focus(formField.path, true),
                    onblur: () => model.focus(formField.path, false),
                });
            const control = options ? el('div', {class: 'select'}, input, el('span', {html: icon('chevronDown')}).firstChild) : input;
            const wrap = el('div', {class: 'field'}, el('label', {for: id}, text(formField.label)), control, help);
            fields.set(formField.path, {formField, wrap, input, help});
            return wrap;
        };

        // The form in order: a question's tiles and all its fields go where the first of those fields would have been, and a
        // section heading goes before the first field of each section.
        let section;
        for (const formField of model.inputs) {
            const questionIndex = model.form.oneOfs.findIndex((question) => question.choices.some((choice) => choice.paths.includes(formField.path)));
            if (questionIndex >= 0) {
                const oneOf = model.form.oneOfs[questionIndex];
                const paths = oneOf.choices.flatMap((choice) => choice.paths);
                if (formField.path !== paths.find((path) => model.inputs.some((input) => input.path === path))) continue;
                const radios = oneOf.choices.map((choice) =>
                    el('input', {type: 'radio', name: `q${questionIndex}`, onchange: () => model.choose(questionIndex, choice)}));
                const box = el('fieldset', {},
                    el('legend', {class: 'section'}, text(oneOf.question)),
                    el('div', {class: 'tiles'}, ...oneOf.choices.map((choice, index) => el('label', {class: 'tile'}, radios[index], text(choice.label)))),
                    ...model.inputs.filter((input) => paths.includes(input.path)).map(field));
                questions.push({el: box, questionIndex, radios});
                formView.append(box);
                continue;
            }
            if (formField.section && formField.section !== section) {
                const heading = el('h3', {class: 'section'}, text(formField.section));
                headings.push({el: heading, section: formField.section});
                formView.append(heading);
            }
            section = formField.section;
            formView.append(field(formField));
        }
        formView.append(banner);

        const pay = el('button', {
            type: 'button',
            class: 'button',
            onclick: () => model.pay()
        }, text('synqt_sheet_pay', model.summary.amount));
        footer.append(pay, el('div', {class: 'secure'}, el('span', {html: icon('lock', 16)}).firstChild, text('synqt_sheet_secure_checkout')));

        function update() {
            if (model.next && !nextBuilt) buildNext(model.next);
            for (const detail of details) detail.hidden = model.allFilledIn;
            for (const heading of headings) heading.el.hidden = !model.inputs.some((formField) => formField.section === heading.section && model.visible(formField.path));
            for (const {el: box, questionIndex, radios} of questions) {
                box.hidden = !model.questionVisible(questionIndex);
                radios.forEach((radio, index) => (radio.checked = model.form.oneOfs[questionIndex].choices[index] === model.chosen[questionIndex]));
            }
            for (const {formField, wrap, input, help} of fields.values()) {
                wrap.hidden = !model.visible(formField.path);
                const value = model.values[formField.path] ?? '';
                if (input.value !== value) input.value = value;
                const error = model.marks[formField.path];
                help.textContent = error ?? model.hint(formField);
                help.classList.toggle('error', error !== undefined);
                input.setAttribute('aria-invalid', String(error !== undefined));
            }
            banner.hidden = !model.banner;
            banner.replaceChildren(el('span', {html: icon('warning')}).firstChild, el('span', {}, model.banner ?? ''));
            nextView.querySelector('.app-problem')?.replaceChildren(...(model.appProblem ? [errorBanner(model.appProblem)] : []));
            toast.textContent = model.toast ?? '';
            // While a payment is sent the processing view covers the sheet, and nothing under it can be reached by keyboard.
            processing.hidden = !model.processing;
            for (const part of [header, body, footer]) part.inert = model.processing;
            if (model.processing && !stopLoader) stopLoader = orbitLoader(loader);
            if (!model.processing && stopLoader) {
                stopLoader();
                stopLoader = undefined;
            }
            const request = model.focusRequest;
            if (request && request.count !== focusCount) {
                focusCount = request.count;
                const target = request.path === 'banner' ? banner : fields.get(request.path)?.input;
                queueMicrotask(() => {
                    target?.focus({preventScroll: true});
                    target?.scrollIntoView({block: 'center', behavior: 'smooth'});
                });
            }
        }

        function summaryCard(amount, showReference) {
            const summary = model.summary;
            return el('div', {class: 'card'},
                // Eyebrow, not brand magenta: magenta on the light panel is 2.89:1.
                el('div', {class: 'eyebrow'}, text('synqt_sheet_amount_due')),
                el('div', {class: 'amount'}, amount),
                el('hr', {class: 'rule'}),
                summary.merchant && row(text('synqt_sheet_paying'), summary.merchant),
                row(text('synqt_sheet_payment_method'), summary.method),
                showReference && row(text('synqt_sheet_reference'), summary.reference));
        }

        /** A label and value; with `copy`, a button that copies that text. With `copyColumn` every row keeps the button's column. */
        function row(label, value, copy, copyColumn = false) {
            const button = copy !== undefined
                ? el('button', {
                    type: 'button',
                    class: 'icon-button muted',
                    'aria-label': text('synqt_next_copy', label),
                    html: icon('copy', 20),
                    onclick: () => model.copyValue(label, copy)
                })
                : copyColumn && el('span', {class: 'copy-slot'});
            return el('div', {class: 'row'}, el('span', {class: 'label'}, label), el('span', {class: 'value'}, value), button);
        }

        const errorBanner = (message) => el('div', {class: 'banner'}, el('span', {html: icon('warning')}).firstChild, el('span', {}, message));

        /** What the payer does after SYNQT accepted the payment, for methods finished in another app or by bank transfer. */
        function buildNext(nextStep) {
            nextBuilt = true;
            const name = model.methodName;
            const transfer = nextStep.payInto;
            const amount = nextStep.amountToPay ? String(nextStep.amountToPay) : model.summary.amount;
            const qr = nextStep.qrCodeImageURL && QR_IMAGE.test(nextStep.qrCodeImageURL) ? nextStep.qrCodeImageURL : undefined;
            // On a computer the QR code is the way to pay; the app link is offered there only when there is no QR code.
            const offerApp = nextStep.appLink && !UNSAFE_LINK.test(nextStep.appLink) && (coarse || !qr);
            const how = transfer ? text('synqt_next_transfer')
                : offerApp && qr ? text('synqt_next_open_or_scan', name)
                    : offerApp ? text('synqt_next_open', name)
                        : text(coarse ? 'synqt_next_scan' : 'synqt_next_scan_desktop', name);
            // A transfer reference that contains the order ID would read as a second, near-identical "Reference", so the order ID goes.
            const orderIdInReference = transfer && nextStep.reference?.includes(model.summary.reference);
            const reference = transfer ? nextStep.reference : undefined;
            const title = el('h2', {
                class: 'title',
                tabindex: '-1'
            }, transfer ? text('synqt_next_transfer_title') : text('synqt_next_title', name));
            // append() would write false and undefined out as text, so the parts a method lacks are dropped first.
            nextView.append(...[
                summaryCard(amount, !orderIdInReference),
                (reference || nextStep.expiresAt) && referenceCard(reference, nextStep.expiresAt),
                title,
                el('p', {class: 'muted intro'}, how),
                nextStep.amountToPay && el('p', {class: 'strong num'}, text('synqt_next_pay_exactly', String(nextStep.amountToPay))),
                // A banking app wants the number alone, not "R100.00".
                transfer && transferCard(transfer, amount, nextStep.amountToPay?.plainAmount ?? model.summary.amount.replace(/[^0-9.]/g, '')),
                transfer && notice(),
                !transfer && nextStep.reference && el('p', {class: 'strong'}, text('synqt_next_reference', nextStep.reference)),
                qr && qrCode(qr),
                el('div', {class: 'app-problem'}),
            ].filter(Boolean));
            footer.replaceChildren(...[
                offerApp && el('button', {
                    type: 'button',
                    class: 'button',
                    onclick: () => model.openApp()
                }, text('synqt_next_open_app', name)),
                el('button', {
                    type: 'button',
                    class: offerApp ? 'button outline' : 'button',
                    onclick: () => model.close()
                }, text('synqt_next_done')),
            ].filter(Boolean));
            formView.hidden = true;
            nextView.hidden = false;
            body.scrollTop = 0;
            queueMicrotask(() => title.focus());
        }

        /** The countdown card at the top of every next step; for OFFLINE it leads with the reference the payer must quote. */
        function referenceCard(reference, expiresAt) {
            const card = el('div', {class: 'reference-card'});
            if (reference) {
                card.append(
                    el('div', {class: 'eyebrow'}, text('synqt_next_reference_title')),
                    el('div', {class: 'reference-line'},
                        el('span', {class: 'reference-value'}, reference),
                        el('button', {
                            type: 'button',
                            class: 'icon-button muted',
                            'aria-label': text('synqt_next_copy', text('synqt_sheet_reference')),
                            html: icon('copy', 20),
                            onclick: () => model.copyValue(text('synqt_sheet_reference'), reference)
                        })),
                    el('p', {class: 'muted', style: 'font-size:.875rem'}, text('synqt_next_reference_needed')));
            }
            if (expiresAt && timeLeft(expiresAt) !== undefined) {
                if (reference) card.append(el('hr', {class: 'rule'}));
                const clock = el('div', {style: 'padding:8px 0'});
                const tick = () => {
                    const left = timeLeft(expiresAt);
                    if (left === '') {
                        clock.replaceChildren(el('p', {class: 'expired'}, text('synqt_next_expired')));
                        return;
                    }
                    // Screen readers get the whole line once, not a new number every second.
                    clock.replaceChildren(el('div', {
                            class: 'eyebrow',
                            'aria-hidden': 'true'
                        }, text('synqt_next_time_left')),
                        el('div', {
                            class: 'countdown',
                            'aria-hidden': 'true'
                        }, el('span', {html: icon('timer', 28)}).firstChild, left),
                        el('span', {class: 'sr'}, `${text('synqt_next_time_left')} ${left.slice(0, 5)}`));
                };
                tick();
                timers.push(setInterval(tick, 1000));
                card.append(clock);
            }
            return card;
        }

        /** The bank details an OFFLINE payer types into their own banking app, each with a copy button. */
        function transferCard(account, amount, copyAmount) {
            // Branch is the primary detail and often repeats the bank code, so the bank code only stands in when there is no branch.
            const branch = shown(account.bankBranch) ? [text('synqt_next_branch'), account.bankBranch, account.bankBranch]
                : shown(account.bankCode) ? [text('synqt_next_bank_code'), account.bankCode, account.bankCode] : undefined;
            const rows = [
                shown(account.accountName) && [text('synqt_next_account_name'), account.accountName, account.accountName],
                shown(account.accountNumber) && [text('synqt_next_account_number'), account.accountNumber, account.accountNumber],
                shown(account.bankName) && [text('synqt_next_bank'), account.bankName],
                shown(account.accountType) && [text('synqt_next_account_type'), account.accountType],
                branch,
                [text('synqt_sheet_amount_due'), el('span', {class: 'num'}, amount), copyAmount],
            ].filter(Boolean);
            return el('div', {
                class: 'card',
                style: 'padding-top:0;margin:8px 0'
            }, ...rows.map(([label, value, copyValue]) => row(label, value, copyValue, true)));
        }

        /** What the payer must know before transferring. Draft wording, based on the Payment Web App's notice. */
        function notice() {
            const items = ['synqt_next_notice_exact', 'synqt_next_notice_once', 'synqt_next_notice_fees', 'synqt_next_notice_own_account'];
            return el('div', {class: 'notice'}, el('h3', {}, text('synqt_next_notice_title')),
                ...items.map((key, index) => el('p', {class: 'muted'}, text('synqt_next_notice_item', index + 1, text(key)))));
        }

        /** SYNQT's QR image, on white in both themes because scanners need a light ground. */
        function qrCode(url) {
            const caption = el('p', {class: 'muted'}, text('synqt_next_qr_loading', model.methodName));
            const box = el('div', {class: 'qr-box'});
            const img = el('img', {
                src: url, alt: text('synqt_next_qr_description', model.methodName), width: '216', height: '216',
                onload: () => (caption.textContent = text('synqt_next_qr_caption', model.methodName)),
                onerror: () => {
                    box.replaceWith(el('p', {class: 'muted'}, text('synqt_next_qr_failed')));
                    caption.remove();
                },
            });
            box.append(img);
            return el('div', {class: 'qr'}, box, caption);
        }

        const lock = document.documentElement.style.overflow;
        return new Promise((resolve) => {
            model.onChange = update;
            model.copy = (value) => navigator.clipboard?.writeText(value).catch(() => {
            });
            model.announce = (message) => {
                live.textContent = '';
                if (message) setTimeout(() => (live.textContent = message), 50);
            };
            model.openLink = (link) => {
                if (UNSAFE_LINK.test(link)) return false;
                const popup = window.open(link, '_blank');
                if (popup) popup.opener = null;
                return !!popup;
            };
            model.onFinish = (result) => {
                timers.forEach(clearInterval);
                stopLoader?.();
                model.onChange = () => {
                }; // a late reply from SYNQT changes nothing on screen
                dialog.close();
                host.remove();
                document.documentElement.style.overflow = lock;
                resolve(result);
            };
            // Escape closes the sheet as the close button does, except while a payment is being sent.
            dialog.addEventListener('cancel', (event) => {
                event.preventDefault();
                if (!model.processing) model.close();
            });
            // A repeated Escape without user activation fires a cancel that can't be prevented, and the dialog closes itself.
            dialog.addEventListener('close', () => {
                if (model._finished) return;
                if (model.processing) dialog.showModal();
                else model.close();
            });
            signal?.addEventListener('abort', () => model.finish(null), {once: true});
            document.body.append(host);
            document.documentElement.style.overflow = 'hidden';
            update();
            dialog.showModal();
            onPresented?.();
            model.start();
        });
    }

// ---- payment-app ----

    /** True when `url` is the return URL, whatever query the Payment Web App added; a longer path is not. */
    function isReturn(url, returnURL) {
        const current = new URL(url);
        const expected = new URL(returnURL);
        return current.origin === expected.origin && current.pathname === expected.pathname;
    }

    /**
     * Opens `url` in a popup and resolves `{ type: 'returned', url }` when the payer reaches `returnURL`, or
     * `{ type: 'closed' }` when they close the popup or `signal` aborts. The popup's address can be read only once it is
     * on this page's origin, so the return is seen only for a `returnURL` there.
     */
    function showPaymentApp(url, returnURL, {onPresented, signal} = {}) {
        const popup = window.open(url, 'synqt-payment', 'popup,width=480,height=760');
        if (!popup) throw new SynqtArgumentError('The browser blocked the Payment Web App window. Call presentPaymentApp from a click handler.');
        return new Promise((resolve) => {
            const finish = (result) => {
                clearInterval(timer);
                if (!popup.closed) popup.close();
                resolve(result);
            };
            // shortcut: polls, as a cross-origin popup sends no events; 300 ms is quick enough to feel instant.
            const timer = setInterval(() => {
                if (popup.closed) return finish({type: 'closed'});
                let href;
                try {
                    href = popup.location.href;
                } catch {
                    return; // still on SYNQT's or a bank's page
                }
                if (href && href !== 'about:blank' && isReturn(href, returnURL)) finish({type: 'returned', url: href});
            }, 300);
            signal?.addEventListener('abort', () => finish({type: 'closed'}), {once: true});
            onPresented?.();
        });
    }

// ---- payin ----

    /**
     * One order's payin, from `synqt.payin()`. Holds the token, ID, amount and URLs so each call needs only what is new.
     * Calls throw `SynqtAPIError` when SYNQT refuses them, and fetch's `TypeError` (or a `TimeoutError` after 30 seconds)
     * when it cannot be reached.
     */
    class Payin {
        constructor(synqt, {token, id, money, returnURL, callbackURL}) {
            this._synqt = synqt;
            this._token = token;
            /** The order's payin ID. */
            this.id = id;
            /** The order's amount, a `Money`. */
            this.money = money;
            this.returnURL = returnURL;
            this.callbackURL = callbackURL;
        }

        /**
         * Creates the payin with a payment method you built yourself, a plain object such as
         * `{ paymentMethodCode: 'CAPITEC_PAY', phoneNumber: '0821234567', customerName: { lastName: 'Doe' } }`. `customerIP`
         * is checked against the merchant's IP allow and deny lists, so pass the payer's real IP if you have it. A retry
         * after a network failure is safe: if SYNQT already accepted this payin ID, the existing payin is fetched instead.
         * If that payin was made with a different method, this throws `SynqtAPIError` (409, PAYIN_ALREADY_STARTED): start a
         * new payin to pay another way.
         *
         * Throws `SynqtArgumentError` before sending if the method code is unknown, or the object lacks a field the method
         * needs or has one it does not take.
         */
        async create(paymentMethod, {customerIP} = {}) {
            validatePaymentMethod(paymentMethod);
            const body = {
                paymentRequested: {money: this.money},
                paymentMethod,
                returnUrl: this.returnURL,
                callbackUrl: this.callbackURL,
                customerIp: customerIP,
            };
            let data;
            try {
                data = await this._call('POST', `/payins/${this.id}`, body);
            } catch (error) {
                if (!(error instanceof SynqtAPIError) || error.httpCode !== 409) throw error;
                data = await this._call('GET', `/payins/${this.id}`);
                requireSameMethod(data, paymentMethod.paymentMethodCode);
            }
            return parseCreatePayin(data);
        }

        /** Methods, banks and providers SYNQT offers this merchant for `money`. Send the same `segmentCode` when paying. */
        async availablePaymentOptions({segmentCode} = {}) {
            const data = await this._call('POST', '/payins/!availablePaymentOptions', {money: this.money, segmentCode});
            return parsePaymentOptions(JSON.parse(data) ?? {});
        }

        /**
         * For display only. Fulfil orders from your backend's own status check, never from this. Before a payment is sent,
         * SYNQT answers HTTP 410.
         */
        async status() {
            return parsePayinStatus(JSON.parse(await this._call('GET', `/payins/${this.id}`)) ?? {});
        }

        /** The payer's bank or UTR reference, for methods that need it. The token must allow `POST /payins/{id}/!setExternalReference`. */
        async setExternalReference(reference) {
            if (typeof reference !== 'string' || reference.length < 1 || reference.length > 512) {
                throw new SynqtArgumentError('reference must be 1 to 512 characters');
            }
            await this._call('POST', `/payins/${this.id}/!setExternalReference`, {reference});
        }

        /**
         * Link to SYNQT's hosted Payment Web App for this payin. `paymentMethodCode` opens it on that method (one
         * `availablePaymentOptions` returns) while still letting the payer pick another. `prefill` takes the Payment Web
         * App's own parameter names, such as `phoneNumber` or `emailAddress`, and the payer can still change them. `extra`
         * adds any other parameter as given, after these.
         * @param {{merchantCode: string, paymentMethodCode?: string, prefill?: Record<string, string>, extra?: Record<string, string>}} p
         */
        paymentAppURL({merchantCode, paymentMethodCode, prefill = {}, extra = {}}) {
            const params = [
                ['merchantCode', merchantCode],
                ['idPayin', this.id],
                ['token', this._token],
                ['amount', this.money.plainAmount],
                ['currencyCode', this.money.currencyCode],
                ['callbackUrl', this.callbackURL],
                ['returnUrl', this.returnURL],
                ...(paymentMethodCode ? [['paymentMethodCode', paymentMethodCode], ['optionsAvailable', 'true']] : []),
                ...Object.entries(prefill),
                ...(Object.keys(prefill).length ? [['allowCustomerDataChange', 'true']] : []),
                ...Object.entries(extra),
            ];
            return this._synqt.paymentAppBaseURL + '?' + params.map(([key, value]) => `${enc(key)}=${enc(value)}`).join('&');
        }

        /**
         * Collects the payer's details for `paymentMethodCode` (one of `Synqt.directPaymentMethods`) in a Synqt-branded
         * dialog, then creates the payin as `create` does. Errors, including SYNQT's field errors, stay in the dialog so the
         * payer can correct them. Resolves with the `create` result once the dialog has closed, or null if the payer closed
         * it without paying.
         *
         * The bank or provider field lists the banks `availablePaymentOptions` returns for this payin and method; an
         * optional one is hidden when SYNQT lists none. The summary names the merchant when the token also allows
         * `GET /merchant-info`. `prefill` is keyed by field path, such as `emailAddress` or `customerName.lastName`. CARD is
         * not offered: card details need PCI DSS compliant hosted fields.
         *
         * `onPresented` runs once the dialog is on screen, and `onPaymentStarted` each time a payment is sent to SYNQT (the
         * details passed the dialog's checks; SYNQT may still refuse them, and then there may be no payin). Aborting `signal`
         * closes the dialog and resolves with null, even if SYNQT already accepted the payment.
         *
         * Throws `SynqtArgumentError` only for a `paymentMethodCode` the sheet does not support.
         */
        async presentPaymentSheet({
                                      paymentMethodCode,
                                      prefill = {},
                                      customerIP,
                                      onPresented,
                                      onPaymentStarted,
                                      signal
                                  }) {
            const form = methodForms.find((methodForm) => methodForm.code === paymentMethodCode);
            if (!form) throw new SynqtArgumentError(`Unknown paymentMethodCode ${paymentMethodCode}`);
            const {operators, merchant} = await this._sheetContext(form);
            if (signal?.aborted) return null;
            const model = new PaymentSheetModel({
                form,
                prefill,
                operators,
                summary: {amount: String(this.money), merchant, method: text(form.name), reference: this.id},
                submit: (method) => this.create(method, {customerIP}),
            });
            if (onPaymentStarted) model.onPaymentStarted = onPaymentStarted;
            return showPaymentSheet(model, {onPresented, signal});
        }

        /**
         * Opens SYNQT's hosted Payment Web App in a popup window, and resolves once the payer reaches `returnURL` or closes
         * it: `{ type: 'returned', url }` with whatever the Payment Web App added to the URL, or `{ type: 'closed' }`. Either
         * way, ask `status()` where the payment stands. Call it straight from a click handler, or the browser blocks the
         * popup and this throws `SynqtArgumentError`. The return is seen only when `returnURL` is on this page's origin;
         * otherwise the popup stays open on it until the payer closes it.
         */
        presentPaymentApp({merchantCode, paymentMethodCode, prefill, extra, onPresented, signal}) {
            const url = this.paymentAppURL({merchantCode, paymentMethodCode, prefill, extra});
            return showPaymentApp(url, this.returnURL, {onPresented, signal});
        }

        /**
         * Sends this tab to the Payment Web App. The payer comes back through `returnURL`, so the page must pick up there.
         * To stay on this page instead, use `presentPaymentApp`.
         */
        openPaymentApp({merchantCode, paymentMethodCode, prefill, extra}) {
            window.location.assign(this.paymentAppURL({merchantCode, paymentMethodCode, prefill, extra}));
        }

        _call(method, path, body) {
            return this._synqt.call(method, path, this._token, body);
        }

        /**
         * Banks and providers for `form`'s bank or provider field, and the merchant's name for the summary. Both are
         * niceties: without the bank list the sheet hides an optional bank field or asks for the code, and without the
         * merchant name the summary leaves that row out.
         */
        async _sheetContext(form) {
            const needsOperators = form.fields.some((field) => field.kind === 'paymentOperator' || field.kind === 'provider');
            const [operators, merchant] = await Promise.all([
                needsOperators
                    ? this.availablePaymentOptions().then((options) => options.find((option) => option.code === form.code)?.operators, () => undefined)
                    : undefined,
                this._call('GET', '/merchant-info').then((body) => JSON.parse(body)?.channelInfo?.name || undefined, () => undefined),
            ]);
            return {operators: operators ?? [], merchant: typeof merchant === 'string' ? merchant : undefined};
        }
    }

    /** As Java's URLEncoder leaves them, so the link matches the other SDKs': letters, digits and `-._*`. */
    const enc = (value) => encodeURIComponent(value).replace(/[!'()~]/g, (character) => '%' + character.charCodeAt(0).toString(16).toUpperCase());

// ---- synqt ----

    /** Where each SYNQT environment lives. The base URLs are public for backend calls such as minting tokens. */
    const environments = Object.freeze({
        sandbox: {apiBaseURL: 'https://api.sandbox.synqt.io', paymentAppBaseURL: 'https://payment.sandbox.synqt.io/'},
        /** SYNQT internal development platform, as in the WordPress plugin. Not for merchants. */
        stable: {apiBaseURL: 'https://api.stable.aopay.io', paymentAppBaseURL: 'https://payment.stable.aopay.io/'},
        live: {apiBaseURL: 'https://api.synqt.io', paymentAppBaseURL: 'https://payment.synqt.io/'},
    });

    const PAYIN_ID = /^[A-Za-z0-9_-]+$/;

    /**
     * Entry point of the SYNQT payins SDK. Create one per environment, then one `Payin` per order:
     *
     * ```js
     * const payin = new Synqt('sandbox').payin({ token, payinID, money: new Money('100.00', 'ZAR'), returnURL, callbackURL });
     * const result = await payin.presentPaymentSheet({ paymentMethodCode: 'CAPITEC_PAY' });
     * ```
     *
     * The token is minted per order by YOUR backend (POST /auth-tokens-by-action, action PAYIN_CREATE, with `money` set).
     * The merchant private key and Secret key must never reach the browser. A payment is only paid when your backend's own
     * GET /payins/{id} says SUCCESS; nothing the page sees is proof.
     */
    class Synqt {
        /**
         * @param {'sandbox'|'live'|'stable'} environment
         * @param {{fetch?: typeof fetch}} [options] `fetch` replaces the browser's, for example to send calls through your
         *   own backend or to add timeouts and logging.
         */
        constructor(environment, {fetch = globalThis.fetch.bind(globalThis)} = {}) {
            if (!environments[environment]) throw new SynqtArgumentError(`environment must be sandbox, live or stable, not ${environment}`);
            this.environment = environment;
            this._fetch = fetch;
        }

        get apiBaseURL() {
            return environments[this.environment].apiBaseURL;
        }

        get paymentAppBaseURL() {
            return environments[this.environment].paymentAppBaseURL;
        }

        /**
         * One order's payin. `payinID` is your own ID for it (letters, digits, `_` and `-`, at most 250) and must match the
         * token. `returnURL` must be https: the Payment Web App rejects other schemes. Makes no network call. Throws
         * `SynqtArgumentError` for a malformed ID or a returnURL that is not https.
         * @param {{token: string, payinID: string, money: import('./results.js').Money, returnURL: string, callbackURL: string}} p
         */
        payin({token, payinID, money, returnURL, callbackURL}) {
            if (typeof payinID !== 'string' || payinID.length > 250 || !PAYIN_ID.test(payinID)) {
                throw new SynqtArgumentError('payinID must match ^[A-Za-z0-9_-]+$, max 250');
            }
            let https = false;
            try {
                https = new URL(returnURL).protocol === 'https:';
            } catch {
                // not a URL at all
            }
            if (!https) throw new SynqtArgumentError('returnURL must be an https URL');
            return new Payin(this, {token, id: payinID, money, returnURL, callbackURL});
        }

        /**
         * Every bank and provider SYNQT knows, with the providers behind each. SYNQT may add codes at any time, so treat
         * unknown ones as normal. For what this merchant can use on a payin, use `payin.availablePaymentOptions()` instead.
         *
         * `token` must allow `GET /payment-operators`. PAYIN_CREATE tokens do not, so mint one on your backend with
         * `POST /auth-tokens` and that operation.
         */
        async paymentOperators({token}) {
            return parseOperators(JSON.parse(await this.call('GET', '/payment-operators', token))?.data);
        }

        /**
         * Methods `payin.presentPaymentSheet` can collect details for, each `{ code, name }`. Offer only those
         * `payin.availablePaymentOptions()` also returns.
         */
        static get directPaymentMethods() {
            return methodForms.map((methodForm) => ({code: methodForm.code, name: text(methodForm.name)}));
        }

        /** One API call; the response body as text. Throws `SynqtAPIError` when SYNQT refuses it. */
        async call(method, path, token, body) {
            const response = await this._fetch(this.apiBaseURL + path, {
                method,
                headers: {
                    Accept: 'application/json',
                    'X-API-Version': '2', // a missing header gives 404, not 400
                    Authorization: `Bearer ${token}`,
                    ...(body === undefined ? {} : {'Content-Type': 'application/json'}),
                },
                body: body === undefined ? undefined : JSON.stringify(body),
                cache: 'no-store', // a payin's status changes, so a cached reply would be wrong
                signal: AbortSignal.timeout(30_000),
            });
            const data = await response.text();
            // The body is parsed into codes here and then dropped: 406 attrValue echoes what the payer typed.
            if (!response.ok) throw new SynqtAPIError(response.status, parseErrors(data));
            return data;
        }
    }

// ---- public API ----

    const SynqtSDK = {
        Synqt,
        Payin,
        Money,
        SynqtAPIError,
        SynqtArgumentError,
        environments,
        validatePaymentMethod,
        /** The SDK's inner workings, for its own tests. Not a stable API. */
        internals: {
            methodForms,
            paymentMethodRules,
            text,
            hasText,
            buildPaymentMethod,
            defaultChoices,
            filledIn,
            problem,
            problems,
            providers,
            readyToPay,
            regex,
            shows,
            parseCreatePayin,
            parseErrors,
            parseOperators,
            parsePaymentOptions,
            parsePayinStatus,
            formatMoney,
            PaymentSheetModel,
            payinErrors,
            timeLeft,
            isReturn,
            orbitDot,
            ease,
        },
    };

    if (typeof module === 'object' && module.exports) module.exports = SynqtSDK; // Node, for the tests
    else globalThis.SynqtSDK = SynqtSDK;
})();
