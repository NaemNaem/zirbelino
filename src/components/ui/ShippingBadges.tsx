const SHIPPING_METHODS = [
  { id: "dpd", label: "DPD", Icon: DpdIcon },
  { id: "post", label: "Österreichische Post", Icon: PostAtIcon },
] as const;

export function ShippingBadges({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const shell =
    tone === "dark"
      ? "border-white/25 bg-white"
      : "border-[var(--color-border)] bg-white shadow-sm";

  return (
    <div className={`flex flex-wrap items-center justify-center gap-2 ${className}`}>
      {SHIPPING_METHODS.map(({ id, label, Icon }) => (
        <span
          key={id}
          title={label}
          className={`inline-flex h-10 min-w-[4.5rem] items-center justify-center rounded-[var(--radius-craft)] border px-3 ${shell}`}
        >
          <Icon />
          <span className="sr-only">{label}</span>
        </span>
      ))}
    </div>
  );
}

function DpdIcon() {
  return (
    <svg width="52" height="18" viewBox="0 0 52 18" aria-hidden>
      <rect width="52" height="18" rx="2" fill="#DC0032" />
      <text
        x="26"
        y="13"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="Arial, sans-serif"
        fontSize="11"
        fontWeight="800"
        letterSpacing="1"
      >
        DPD
      </text>
    </svg>
  );
}

function PostAtIcon() {
  return (
    <svg width="78" height="18" viewBox="0 0 78 18" aria-hidden>
      <rect width="78" height="18" rx="2" fill="#FFCC00" />
      <text
        x="39"
        y="13"
        textAnchor="middle"
        fill="#000000"
        fontFamily="Arial, sans-serif"
        fontSize="10"
        fontWeight="800"
        letterSpacing="0.5"
      >
        POST AT
      </text>
    </svg>
  );
}
