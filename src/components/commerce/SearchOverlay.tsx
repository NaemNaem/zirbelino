"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/domain";
import { formatMoney } from "@/lib/format";

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!open) return;
    fetch("/api/search")
      .then((res) => res.json())
      .then((data: { products: Product[] }) => setProducts(data.products ?? []))
      .catch(() => setProducts([]));
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 8);
    return products
      .filter((product) =>
        [product.name, product.shortDescription, ...(product.tags ?? [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
      .slice(0, 8);
  }, [products, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 p-4" onClick={onClose}>
      <div
        className="mx-auto mt-10 max-w-2xl rounded-2xl bg-[var(--color-surface)] p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Produkte suchen…"
            className="w-full rounded-full border border-[var(--color-border)] bg-white px-4 py-3 text-base outline-none focus:border-[var(--color-primary)]"
          />
          <button type="button" onClick={onClose} aria-label="Suche schließen">
            ✕
          </button>
        </div>
        <ul className="mt-4 max-h-[60vh] space-y-2 overflow-auto">
          {results.map((product) => (
            <li key={product.id}>
              <Link
                href={`/produkt/${product.slug}`}
                onClick={onClose}
                className="flex items-center justify-between rounded-xl px-3 py-3 hover:bg-[var(--color-background)]"
              >
                <span className="pr-4 text-sm font-medium">{product.name}</span>
                <span className="shrink-0 text-sm">{formatMoney(product.price)}</span>
              </Link>
            </li>
          ))}
          {results.length === 0 ? (
            <li className="px-3 py-6 text-sm text-[var(--color-text-muted)]">
              Keine Treffer.
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
