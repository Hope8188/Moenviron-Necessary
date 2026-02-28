// Shared currency configuration used across frontend and referenced by edge functions.
// Edge functions maintain their own copy (Deno runtime) but logic must stay in sync.

export interface CurrencyConfig {
  symbol: string;
  code: string;
  rate: number; // Exchange rate relative to GBP
  minAmount: number; // Stripe minimum in smallest unit
  zeroDecimal: boolean; // true = no cents (e.g. KES 1000 = 1000, not 10.00)
}

export const CURRENCY_CONFIG: Record<string, CurrencyConfig> = {
  gbp: { symbol: "£", code: "GBP", rate: 1, minAmount: 30, zeroDecimal: false },
  eur: { symbol: "€", code: "EUR", rate: 1.17, minAmount: 50, zeroDecimal: false },
  usd: { symbol: "$", code: "USD", rate: 1.27, minAmount: 50, zeroDecimal: false },
  kes: { symbol: "KSh ", code: "KES", rate: 165, minAmount: 100, zeroDecimal: false },
  ugx: { symbol: "UGX ", code: "UGX", rate: 4700, minAmount: 1000, zeroDecimal: true },
  tzs: { symbol: "TZS ", code: "TZS", rate: 3200, minAmount: 1000, zeroDecimal: true },
  rwf: { symbol: "RWF ", code: "RWF", rate: 1350, minAmount: 100, zeroDecimal: true },
  ngn: { symbol: "₦", code: "NGN", rate: 1950, minAmount: 100, zeroDecimal: false },
  zar: { symbol: "R", code: "ZAR", rate: 23, minAmount: 100, zeroDecimal: false },
  ghs: { symbol: "GH₵", code: "GHS", rate: 16, minAmount: 100, zeroDecimal: false },
  etb: { symbol: "ETB", code: "ETB", rate: 145, minAmount: 100, zeroDecimal: false },
} as const;

export const COUNTRY_CURRENCY: Record<string, string> = {
  "United Kingdom": "gbp",
  Kenya: "kes",
  Uganda: "ugx",
  Tanzania: "tzs",
  Rwanda: "rwf",
  "United States": "usd",
  Nigeria: "ngn",
  "South Africa": "zar",
  Ghana: "ghs",
  Ethiopia: "etb",
  Other: "gbp",
} as const;

export const COUNTRIES = Object.keys(COUNTRY_CURRENCY);

/** Convert a human-readable amount to Stripe's smallest-unit format. */
export function toStripeAmount(amount: number, currency: string): number {
  const config = CURRENCY_CONFIG[currency.toLowerCase()];
  if (config?.zeroDecimal) {
    return Math.round(amount);
  }
  return Math.round(amount * 100);
}

/** Get the currency key for a given country, defaulting to GBP. */
export function getCurrencyForCountry(country: string): string {
  return COUNTRY_CURRENCY[country] || "gbp";
}

/** Format a price for display based on currency code. */
export function formatPrice(amount: number, currencyCode: string = "GBP"): string {
  const code = currencyCode.toLowerCase();
  const config = CURRENCY_CONFIG[code] || CURRENCY_CONFIG.gbp;

  const formattedAmount = config.zeroDecimal
    ? Math.round(amount).toLocaleString()
    : amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return `${config.symbol}${formattedAmount}`;
}
