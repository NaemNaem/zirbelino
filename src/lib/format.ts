import type { Money } from "@/domain";

export function formatMoney(money?: Money | null): string {
  if (!money) return "—";
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: money.currency || "EUR",
  }).format(money.amount);
}

export function formatRating(rating?: number): string {
  if (rating === undefined) return "–";
  return rating.toFixed(1).replace(".", ",");
}
