/**
 * Central configuration.
 * UI and services read DEMO_MODE from here — never hardcode provider behavior in components.
 */

function readBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value === "true" || value === "1";
}

export const env = {
  demoMode: readBoolean(process.env.NEXT_PUBLIC_DEMO_MODE, true),
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  siteName: "Zirbelino",
  currency: "EUR" as const,

  // Production placeholders — filled after contract / customer access
  commerceApiUrl: process.env.COMMERCE_API_URL,
  commerceApiKey: process.env.COMMERCE_API_KEY,
  paymentProvider: process.env.PAYMENT_PROVIDER,
  paymentApiKey: process.env.PAYMENT_API_KEY,
  emailProvider: process.env.EMAIL_PROVIDER,
  emailApiKey: process.env.EMAIL_API_KEY,
  databaseUrl: process.env.DATABASE_URL,
} as const;

export const DEMO_MODE = env.demoMode;
