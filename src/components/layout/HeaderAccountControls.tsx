"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { Product } from "@/domain";
import { useCommerce } from "@/components/commerce/CommerceProvider";
import { formatMoney } from "@/lib/format";

type Country = {
  code: string;
  label: string;
};

type CustomerType = "b2c" | "b2b";

const COUNTRIES: Country[] = [
  { code: "AT", label: "Österreich" },
  { code: "DE", label: "Deutschland" },
  { code: "CH", label: "Schweiz" },
  { code: "IT", label: "Italien" },
];

const STORAGE_KEY = "zirbelino-demo-locale";

type LocaleState = {
  country: string;
  customerType: CustomerType;
};

const DEFAULT_STATE: LocaleState = {
  country: "AT",
  customerType: "b2c",
};

function readState(): LocaleState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<LocaleState>;
    return {
      country: COUNTRIES.some((c) => c.code === parsed.country)
        ? (parsed.country as string)
        : DEFAULT_STATE.country,
      customerType: parsed.customerType === "b2b" ? "b2b" : "b2c",
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function HeaderAccountControls({
  layout = "row",
}: {
  layout?: "row" | "stack";
}) {
  const { cart, setCartOpen } = useCommerce();
  const [state, setState] = useState<LocaleState>(DEFAULT_STATE);
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setState(readState());
  }, []);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: { products: Product[] }) => setProducts(data.products ?? []))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const country =
    COUNTRIES.find((entry) => entry.code === state.country) ?? COUNTRIES[0];
  const customerLabel =
    state.customerType === "b2b" ? "Unternehmer B2B" : "Privatkunde B2C";

  const subtotal = useMemo(() => {
    return cart.items.reduce((sum, item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) return sum;
      return sum + product.price.amount * item.quantity;
    }, 0);
  }, [cart.items, products]);

  const persist = (next: LocaleState) => {
    setState(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <div
      ref={rootRef}
      className={
        layout === "stack"
          ? "relative flex flex-col gap-3"
          : "relative flex items-stretch gap-4 xl:gap-5"
      }
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="min-w-[7.5rem] text-left transition hover:opacity-80"
      >
        <span className="flex items-center gap-1.5 text-sm font-bold leading-tight text-[var(--color-primary-dark)]">
          Lieferland: {country?.code}
        </span>
        <span className="mt-0.5 flex items-center gap-1.5 text-xs leading-tight text-[var(--color-text-muted)]">
          {customerLabel}
          <FlagBadge code={country?.code ?? "AT"} />
        </span>
      </button>

      <Link
        href="/konto"
        className="min-w-[4.5rem] text-left transition hover:opacity-80"
      >
        <span className="flex items-center gap-1.5 text-sm font-bold leading-tight text-[var(--color-primary-dark)]">
          Konto
          <UserIcon />
        </span>
        <span className="mt-0.5 block text-xs leading-tight text-[var(--color-text-muted)]">
          Login
        </span>
      </Link>

      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="min-w-[5.5rem] text-left transition hover:opacity-80"
        aria-label="Warenkorb öffnen"
      >
        <span className="flex items-center gap-1.5 text-sm font-bold leading-tight text-[var(--color-primary-dark)]">
          {formatMoney({ amount: subtotal, currency: "EUR" }).replace(/\s/g, "")}
          <CartIcon />
        </span>
        <span className="mt-0.5 block text-xs leading-tight text-[var(--color-text-muted)]">
          Warenkorb
        </span>
      </button>

      {open ? (
        <div
          id={panelId}
          className={`absolute z-50 w-[min(20rem,calc(100vw-2rem))] rounded-[var(--radius-craft)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_18px_40px_rgba(42,34,24,0.16)] ${
            layout === "stack"
              ? "left-0 top-[calc(100%+0.35rem)]"
              : "left-0 top-[calc(100%+0.55rem)]"
          }`}
        >
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--color-wood)]">
            Lieferland
          </p>
          <div className="mt-2 grid gap-1">
            {COUNTRIES.map((entry) => (
              <button
                key={entry.code}
                type="button"
                onClick={() => persist({ ...state, country: entry.code })}
                className={`flex items-center justify-between rounded-[var(--radius-craft)] px-3 py-2 text-sm transition ${
                  state.country === entry.code
                    ? "bg-[var(--color-wood)] text-[#fff8ef]"
                    : "hover:bg-[var(--color-wood)]/10"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <FlagBadge code={entry.code} />
                  {entry.label}
                </span>
                <span className="text-xs opacity-80">{entry.code}</span>
              </button>
            ))}
          </div>

          <p className="mt-4 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--color-wood)]">
            Kundentyp
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => persist({ ...state, customerType: "b2c" })}
              className={`rounded-[var(--radius-craft)] px-3 py-2 text-sm font-medium transition ${
                state.customerType === "b2c"
                  ? "bg-[var(--color-wood)] text-[#fff8ef]"
                  : "border border-[var(--color-border)] hover:border-[var(--color-wood)]"
              }`}
            >
              Privatkunde
              <span className="mt-0.5 block text-[11px] opacity-80">B2C</span>
            </button>
            <button
              type="button"
              onClick={() => persist({ ...state, customerType: "b2b" })}
              className={`rounded-[var(--radius-craft)] px-3 py-2 text-sm font-medium transition ${
                state.customerType === "b2b"
                  ? "bg-[var(--color-wood)] text-[#fff8ef]"
                  : "border border-[var(--color-border)] hover:border-[var(--color-wood)]"
              }`}
            >
              Unternehmer
              <span className="mt-0.5 block text-[11px] opacity-80">B2B</span>
            </button>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-[var(--color-text-muted)]">
            Demo-Auswahl – lokal gespeichert, noch ohne Backend-Anbindung.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function FlagBadge({ code }: { code: string }) {
  return (
    <span className="inline-flex h-3.5 min-w-[1.15rem] items-center justify-center rounded-[2px] bg-[var(--color-wood)] px-1 text-[8px] font-bold leading-none text-[#fff8ef]">
      {code}
    </span>
  );
}

function UserIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="text-[var(--color-wood)]"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19.5c1.8-3.4 4.2-5 7-5s5.2 1.6 7 5" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
      className="text-[var(--color-wood)]"
    >
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6 5 3H2" />
      <circle cx="9" cy="20" r="1.2" fill="currentColor" />
      <circle cx="18" cy="20" r="1.2" fill="currentColor" />
    </svg>
  );
}
