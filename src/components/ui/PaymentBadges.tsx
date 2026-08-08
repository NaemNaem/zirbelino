const PAYMENT_METHODS = [
  { id: "paypal", label: "PayPal", Icon: PayPalIcon },
  { id: "invoice", label: "Kauf auf Rechnung", Icon: InvoiceIcon },
  { id: "stripe", label: "Stripe", Icon: StripeIcon },
  { id: "mastercard", label: "Mastercard", Icon: MastercardIcon },
  { id: "visa", label: "Visa", Icon: VisaIcon },
  { id: "apple", label: "Apple Pay", Icon: ApplePayIcon },
  { id: "amazon", label: "Amazon Pay", Icon: AmazonPayIcon },
  { id: "vorkasse", label: "Vorkasse", Icon: VorkasseIcon },
] as const;

export function PaymentBadges({
  className = "",
  tone = "light",
  wrap = true,
}: {
  className?: string;
  tone?: "light" | "dark";
  wrap?: boolean;
}) {
  const shell =
    tone === "dark"
      ? "border-white/25 bg-white"
      : "border-[var(--color-border)] bg-white shadow-sm";

  return (
    <div
      className={`${
        wrap ? "flex flex-wrap justify-center" : "inline-flex flex-nowrap"
      } items-center gap-2 ${className}`}
    >
      {PAYMENT_METHODS.map(({ id, label, Icon }) => (
        <span
          key={id}
          title={label}
          className={`inline-flex h-10 shrink-0 items-center justify-center rounded-[var(--radius-craft)] border px-2.5 ${shell}`}
        >
          <Icon />
          <span className="sr-only">{label}</span>
        </span>
      ))}
    </div>
  );
}

function PayPalIcon() {
  return (
    <svg width="72" height="20" viewBox="0 0 72 20" aria-hidden>
      <text x="0" y="15" fill="#003087" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="700">
        Pay
      </text>
      <text x="30" y="15" fill="#009CDE" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="700">
        Pal
      </text>
    </svg>
  );
}

function VisaIcon() {
  return (
    <svg width="48" height="16" viewBox="0 0 48 16" aria-hidden>
      <text
        x="0"
        y="13"
        fill="#1A1F71"
        fontFamily="Arial, sans-serif"
        fontSize="14"
        fontWeight="800"
        letterSpacing="1"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardIcon() {
  return (
    <svg width="40" height="24" viewBox="0 0 40 24" aria-hidden>
      <circle cx="15" cy="12" r="8" fill="#EB001B" />
      <circle cx="25" cy="12" r="8" fill="#F79E1B" />
      <path d="M20 6.2a8 8 0 0 1 0 11.6 8 8 0 0 1 0-11.6z" fill="#FF5F00" />
    </svg>
  );
}

function StripeIcon() {
  return (
    <svg width="52" height="18" viewBox="0 0 52 18" aria-hidden>
      <text x="0" y="14" fill="#635BFF" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700">
        stripe
      </text>
    </svg>
  );
}

function ApplePayIcon() {
  return (
    <svg width="70" height="20" viewBox="0 0 70 20" aria-hidden>
      <text x="0" y="14" fill="#111111" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="700">
        Apple Pay
      </text>
    </svg>
  );
}

function AmazonPayIcon() {
  return (
    <svg width="78" height="20" viewBox="0 0 78 20" aria-hidden>
      <text x="0" y="12" fill="#232F3E" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700">
        amazon
      </text>
      <path
        d="M8 15c8 3 20 3 28-1"
        fill="none"
        stroke="#FF9900"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <text x="48" y="12" fill="#232F3E" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="600">
        pay
      </text>
    </svg>
  );
}

function InvoiceIcon() {
  return (
    <svg width="86" height="20" viewBox="0 0 86 20" aria-hidden>
      <rect x="0.5" y="2.5" width="85" height="15" rx="2" fill="#F7F3EC" stroke="#8B5A2B" />
      <text
        x="43"
        y="13.5"
        textAnchor="middle"
        fill="#8B5A2B"
        fontFamily="Arial, sans-serif"
        fontSize="8"
        fontWeight="700"
      >
        KAUF AUF RECHNUNG
      </text>
    </svg>
  );
}

function VorkasseIcon() {
  return (
    <svg width="78" height="20" viewBox="0 0 78 20" aria-hidden>
      <rect x="0.5" y="2.5" width="77" height="15" rx="2" fill="#F7F3EC" stroke="#6B5A48" />
      <text
        x="39"
        y="13.5"
        textAnchor="middle"
        fill="#6B5A48"
        fontFamily="Arial, sans-serif"
        fontSize="8"
        fontWeight="700"
      >
        MIT VORKASSE
      </text>
    </svg>
  );
}
