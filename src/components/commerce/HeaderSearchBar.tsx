"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { Category, Product } from "@/domain";
import { formatMoney } from "@/lib/format";

const QUICK_LINKS = [
  { href: "/shop?sale=1", label: "Sale & Angebote" },
  { href: "/shop", label: "Alle Produkte" },
  { href: "/die-zirbe", label: "Die Zirbe" },
  { href: "/faq", label: "Hilfe & FAQ" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export function HeaderSearchBar({ categories }: { categories: Category[] }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    fetch("/api/search")
      .then((res) => res.json())
      .then((data: { products: Product[] }) => setProducts(data.products ?? []))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
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
  }, []);

  const q = query.trim().toLowerCase();

  const productResults = useMemo(() => {
    if (!q) return products.filter((p) => p.flags?.featured || p.flags?.bestseller).slice(0, 5);
    return products
      .filter((product) =>
        [product.name, product.shortDescription, ...(product.tags ?? [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
      .slice(0, 6);
  }, [products, q]);

  const categoryResults = useMemo(() => {
    if (!q) return categories;
    return categories.filter((category) =>
      [category.name, category.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [categories, q]);

  const quickResults = useMemo(() => {
    if (!q) return QUICK_LINKS;
    return QUICK_LINKS.filter((link) => link.label.toLowerCase().includes(q));
  }, [q]);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={rootRef} className="relative w-full">
      <label className="sr-only" htmlFor="site-search">
        Produkte, Kategorien, Seiten suchen
      </label>
      <div className="flex items-stretch overflow-hidden rounded-[var(--radius-craft)] border border-[var(--color-border)]/80 bg-white/70">
        <input
          id="site-search"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Produkte, Kategorien, Seiten suchen…"
          className="min-w-0 flex-1 bg-transparent px-3 py-1.5 text-xs text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] md:text-sm"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={panelId}
          aria-autocomplete="list"
        />
        <button
          type="button"
          aria-label="Suchen"
          className="inline-flex items-center justify-center border-l border-[var(--color-border)]/80 px-2.5 text-[var(--color-wood)] transition hover:bg-[var(--color-wood)]/8"
          onClick={() => setOpen(true)}
        >
          <SearchIcon />
        </button>
      </div>

      {open ? (
        <div
          id={panelId}
          className="absolute inset-x-0 top-[calc(100%+0.35rem)] z-50 overflow-hidden rounded-[var(--radius-craft)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_18px_40px_rgba(42,34,24,0.16)]"
        >
          <div className="max-h-[min(70vh,26rem)] overflow-auto p-3 md:p-4">
            {categoryResults.length ? (
              <section>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--color-wood)]">
                  Kategorien
                </p>
                <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                  {categoryResults.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/kategorie/${category.slug}`}
                        onClick={close}
                        className="flex items-center gap-2 rounded-[var(--radius-craft)] px-2.5 py-2 text-sm text-[var(--color-primary-dark)] transition hover:bg-[var(--color-wood)]/8"
                      >
                        <span className="text-[var(--color-resin)]" aria-hidden>
                          ›
                        </span>
                        <span>
                          <span className="font-medium">{category.name}</span>
                          {category.description ? (
                            <span className="mt-0.5 block text-[11px] text-[var(--color-text-muted)]">
                              {category.description}
                            </span>
                          ) : null}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {quickResults.length ? (
              <section className={categoryResults.length ? "mt-4 border-t border-[var(--color-border)] pt-3" : ""}>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--color-wood)]">
                  Schnellzugriff
                </p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {quickResults.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={close}
                        className="inline-flex rounded-[var(--radius-craft)] border border-[var(--color-border)] bg-white/70 px-2.5 py-1 text-xs font-medium text-[var(--color-text)] transition hover:border-[var(--color-wood)] hover:text-[var(--color-wood)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section
              className={
                categoryResults.length || quickResults.length
                  ? "mt-4 border-t border-[var(--color-border)] pt-3"
                  : ""
              }
            >
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--color-wood)]">
                {q ? "Produkte" : "Empfohlen"}
              </p>
              <ul className="mt-2 space-y-0.5">
                {productResults.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/produkt/${product.slug}`}
                      onClick={close}
                      className="flex items-center justify-between gap-3 rounded-[var(--radius-craft)] px-2.5 py-2 text-sm transition hover:bg-[var(--color-wood)]/8"
                    >
                      <span className="min-w-0 truncate font-medium text-[var(--color-primary-dark)]">
                        {product.name}
                      </span>
                      <span className="shrink-0 text-xs text-[var(--color-wood)]">
                        {formatMoney(product.price)}
                      </span>
                    </Link>
                  </li>
                ))}
                {productResults.length === 0 ? (
                  <li className="px-2.5 py-3 text-sm text-[var(--color-text-muted)]">
                    Keine Produkt-Treffer für „{query.trim()}“.
                  </li>
                ) : null}
              </ul>
            </section>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      aria-hidden
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" strokeLinecap="round" />
    </svg>
  );
}
