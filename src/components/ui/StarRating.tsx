import { formatRating } from "@/lib/format";

export function StarRating({
  rating,
  size = "md",
  showValue = false,
  className = "",
}: {
  rating: number;
  size?: "sm" | "md";
  showValue?: boolean;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(5, rating));
  const filled = Math.round(clamped);
  const starSize = size === "sm" ? "text-sm" : "text-base";

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-[var(--color-wood)] ${className}`}
      aria-label={`${formatRating(clamped)} von 5 Sternen`}
    >
      <span className={`inline-flex tracking-tight ${starSize}`} aria-hidden>
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            className={index < filled ? "" : "text-[var(--color-border)]"}
          >
            ★
          </span>
        ))}
      </span>
      {showValue ? (
        <span className="text-sm text-[var(--color-text-muted)]">
          {formatRating(clamped)}
        </span>
      ) : null}
    </div>
  );
}
