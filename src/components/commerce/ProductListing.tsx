"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Category, Product } from "@/domain";
import { ProductCard } from "@/components/product/ProductCard";
import type { CategoryPageContent } from "@/lib/category-content";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function ProductListing({
  title,
  intro,
  products,
  categories,
  initialParams,
  activeCategoryId,
  content,
  heroImage,
}: {
  title: string;
  intro?: string;
  products: Product[];
  categories: Category[];
  initialParams: Record<string, string | string[] | undefined>;
  activeCategoryId?: string;
  content?: CategoryPageContent;
  heroImage?: string;
}) {
  const [sort, setSort] = useState<SortKey>(
    (first(initialParams.sort) as SortKey) || "featured",
  );
  const [saleOnly, setSaleOnly] = useState(first(initialParams.sale) === "1");
  const [inStockOnly, setInStockOnly] = useState(
    first(initialParams.stock) === "1",
  );
  const [minRating, setMinRating] = useState(
    Number(first(initialParams.rating) || 0),
  );
  const [filtersOpen, setFiltersOpen] = useState(false);

  const isCategory = Boolean(content || activeCategoryId);
  const headline = content?.headline ?? title;
  const lead = content?.intro ?? intro;
  const highlights = content?.highlights ?? [];
  const productHeading = content?.productHeading ?? title;

  const filtered = useMemo(() => {
    let list = [...products];
    if (saleOnly) list = list.filter((p) => p.flags?.sale);
    if (inStockOnly) list = list.filter((p) => p.availability === "in_stock");
    if (minRating > 0) list = list.filter((p) => (p.rating ?? 0) >= minRating);

    list.sort((a, b) => {
      if (sort === "price-asc") return a.price.amount - b.price.amount;
      if (sort === "price-desc") return b.price.amount - a.price.amount;
      if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      return (
        Number(Boolean(b.flags?.featured)) - Number(Boolean(a.flags?.featured))
      );
    });
    return list;
  }, [products, saleOnly, inStockOnly, minRating, sort]);

  const activeFilters =
    Number(saleOnly) + Number(inStockOnly) + (minRating > 0 ? 1 : 0);

  const Filters = (
    <div className="space-y-5">
      <fieldset>
        <legend className="text-sm font-semibold text-[var(--color-primary-dark)]">
          Filter
        </legend>
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={saleOnly}
            onChange={(e) => setSaleOnly(e.target.checked)}
          />
          Nur Sale
        </label>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          Nur verfügbar
        </label>
      </fieldset>
      <label className="block text-sm">
        Mindestbewertung
        <select
          className="mt-2 w-full rounded-[var(--radius-craft)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2"
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
        >
          <option value={0}>Alle</option>
          <option value={4}>ab 4,0</option>
          <option value={4.5}>ab 4,5</option>
        </select>
      </label>
    </div>
  );

  return (
    <main>
      {isCategory ? (
        <section className="relative overflow-hidden border-b border-[var(--color-border)]">
          <div className="absolute inset-0">
            {heroImage ? (
              <Image
                src={heroImage}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0 wood-panel" />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(42,31,22,0.88)_0%,rgba(42,31,22,0.72)_48%,rgba(42,31,22,0.45)_100%)]" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
            <nav className="text-sm text-[#f3e6d4]/80">
              <Link href="/" className="hover:text-[#fff7eb]">
                Start
              </Link>
              {" / "}
              <Link href="/shop" className="hover:text-[#fff7eb]">
                Shop
              </Link>
              {" / "}
              <span className="text-[#fff7eb]">{title}</span>
            </nav>
            <p className="mt-5 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#f3e6d4]">
              {title}
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-[#fff7eb] md:text-5xl">
              {headline}
            </h1>
            {lead ? (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#f3e6d4] md:text-lg">
                {lead}
              </p>
            ) : null}
            {highlights.length ? (
              <ul className="mt-7 grid max-w-3xl gap-2 sm:grid-cols-2">
                {highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-[#fff7eb]"
                  >
                    <span className="mt-0.5 text-[var(--color-resin)]" aria-hidden>
                      {"\u2605"}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ) : (
        <div className="mx-auto max-w-7xl px-4 pt-10 md:px-6 md:pt-14">
          <nav className="text-sm text-[var(--color-text-muted)]">
            <Link href="/">Start</Link> / <span>{title}</span>
          </nav>
          <h1 className="mt-4 font-display text-4xl text-[var(--color-primary-dark)] md:text-5xl">
            {headline}
          </h1>
          {lead ? (
            <p className="mt-4 max-w-3xl text-[var(--color-text-muted)]">{lead}</p>
          ) : null}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="mb-5 flex flex-wrap gap-2">
          <Link
            href="/shop"
            className={`rounded-[var(--radius-craft)] border px-3 py-1.5 text-sm transition ${
              !activeCategoryId
                ? "border-[var(--color-wood)] bg-[var(--color-wood)] text-[#fff8ef]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-wood)]"
            }`}
          >
            Alle
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/kategorie/${category.slug}`}
              className={`rounded-[var(--radius-craft)] border px-3 py-1.5 text-sm transition ${
                category.id === activeCategoryId
                  ? "border-[var(--color-wood)] bg-[var(--color-wood)] text-[#fff8ef]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-wood)]"
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--color-border)] pb-5">
          <div>
            <h2 className="font-display text-3xl text-[var(--color-wood)] md:text-4xl">
              {productHeading}
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              {filtered.length}{" "}
              {filtered.length === 1 ? "Produkt" : "Produkte"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 rounded-[var(--radius-craft)] border border-[var(--color-border)] bg-[var(--color-surface)]/90 px-3 py-2">
            <button
              type="button"
              className="rounded-[var(--radius-craft)] border border-[var(--color-border)] px-3 py-2 text-sm font-medium text-[var(--color-wood)] hover:bg-[var(--color-wood)]/8"
              onClick={() => setFiltersOpen(true)}
            >
              Filter{activeFilters ? ` (${activeFilters})` : ""}
            </button>
            <label className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              Sortierung
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-[var(--radius-craft)] border border-[var(--color-border)] bg-white/70 px-3 py-2 text-[var(--color-text)]"
              >
                <option value="featured">Empfehlungen</option>
                <option value="price-asc">Preis aufsteigend</option>
                <option value="price-desc">Preis absteigend</option>
                <option value="rating">Bewertung</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {!filtered.length ? (
          <p className="mt-10 text-sm text-[var(--color-text-muted)]">
            Keine Produkte für die aktuelle Filterung.
          </p>
        ) : null}

        {isCategory && lead ? (
          <section className="mt-16 max-w-3xl border-t border-[var(--color-border)] pt-10">
            <h3 className="font-display text-2xl text-[var(--color-primary-dark)]">
              Mehr zu {title}
            </h3>
            <p className="mt-4 leading-relaxed text-[var(--color-text-muted)]">
              {lead}
            </p>
            {highlights.length ? (
              <ul className="mt-5 space-y-2 text-sm text-[var(--color-text-muted)]">
                {highlights.map((item) => (
                  <li key={`bottom-${item}`} className="flex gap-2">
                    <span className="text-[var(--color-wood)]" aria-hidden>
                      –
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ) : null}
      </div>

      {filtersOpen ? (
        <div
          className="fixed inset-0 z-50 bg-[rgba(42,34,24,0.45)]"
          onClick={() => setFiltersOpen(false)}
        >
          <div
            className="ml-auto h-full w-[86%] max-w-sm bg-[var(--color-surface)] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold text-[var(--color-primary-dark)]">
                Filter
              </p>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Filter schließen"
              >
                {"\u2715"}
              </button>
            </div>
            {Filters}
            <button
              type="button"
              className="mt-8 w-full rounded-[var(--radius-craft)] bg-[var(--color-wood)] px-4 py-3 text-sm font-semibold text-[#fff8ef]"
              onClick={() => setFiltersOpen(false)}
            >
              Ergebnisse anzeigen ({filtered.length})
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
