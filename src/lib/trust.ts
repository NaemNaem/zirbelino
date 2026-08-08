/** Public Trusted Shops figures from zirbenprodukte.at — keep Header & Homepage in sync. */
export const TRUSTED_SHOPS_RATING = 4.83;
export const TRUSTED_SHOPS_COUNT = 23438;

export function formatTrustedShopsRating(rating = TRUSTED_SHOPS_RATING): string {
  return rating.toFixed(2).replace(".", ",");
}

export function formatTrustedShopsCount(count = TRUSTED_SHOPS_COUNT): string {
  return `${count.toLocaleString("de-AT")}+`;
}
