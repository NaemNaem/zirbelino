"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Category, NavigationItem } from "@/domain";
import { useCommerce } from "@/components/commerce/CommerceProvider";
import { HeaderSearchBar } from "@/components/commerce/HeaderSearchBar";
import { HeaderAccountControls } from "@/components/layout/HeaderAccountControls";
import {
  formatTrustedShopsCount,
  formatTrustedShopsRating,
} from "@/lib/trust";

export function SiteHeader({
  navigation,
  categories,
}: {
  navigation: NavigationItem[];
  categories: Category[];
}) {
  const { cartCount, setCartOpen } = useCommerce();
  const [mobileOpen, setMobileOpen] = useState(false);
  const ratingLabel = `${formatTrustedShopsRating()} / 5`;
  const countLabel = `${formatTrustedShopsCount()} Bewertungen`;

  return (
    <>
      <div className="wood-band px-4 py-2 text-center text-xs tracking-[0.04em] text-[#fff6ea] md:text-sm">
        <span className="inline-flex items-center gap-1.5 font-bold text-[#ffe2a8]">
          <span className="text-[#ffd06a]" aria-hidden>
            {"\u2605"}
          </span>
          <span>{ratingLabel}</span>
          <span className="font-semibold text-[#ffe2a8]">{`\u00B7 ${countLabel}`}</span>
        </span>
        <span className="mx-2 text-white/40" aria-hidden>
          {"\u00B7"}
        </span>
        <span className="hidden sm:inline">
          Kostenloser Versand ab 70 €
          <span className="mx-2 text-white/40" aria-hidden>
            {"\u00B7"}
          </span>
        </span>
        <span className="hidden md:inline">
          100 Tage Geld-zurück-Garantie
          <span className="mx-2 text-white/40" aria-hidden>
            {"\u00B7"}
          </span>
        </span>
        <span>Handwerk aus Österreich</span>
      </div>
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)]/80 bg-[rgba(247,238,226,0.92)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:gap-4 md:px-6">
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-craft)] border border-[var(--color-border)] text-[var(--color-wood)] lg:hidden"
            aria-label="Menü öffnen"
            onClick={() => setMobileOpen(true)}
          >
            {"\u2630"}
          </button>

          <Link
            href="/"
            className="relative block h-9 w-[120px] shrink-0 sm:h-10 sm:w-[148px] md:h-11 md:w-[168px]"
          >
            <Image
              src="/brand/zirbelino-logo-dark.svg"
              alt="Zirbelino"
              fill
              priority
              className="object-contain object-left"
              sizes="168px"
            />
          </Link>

          <nav
            className="ml-4 hidden items-center gap-3 lg:flex xl:gap-4"
            aria-label="Hauptnavigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="whitespace-nowrap text-sm font-medium text-[var(--color-text)] transition hover:text-[var(--color-wood)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden md:block">
              <HeaderAccountControls />
            </div>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="inline-flex h-10 shrink-0 items-center whitespace-nowrap rounded-[var(--radius-craft)] bg-[var(--color-wood)] px-3 text-[13px] font-semibold leading-none text-[#fff8ef] shadow-[0_8px_20px_rgba(139,90,43,0.25)] md:hidden"
              aria-label="Warenkorb öffnen"
            >
              Warenkorb ({cartCount})
            </button>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)]/50">
          <div className="mx-auto max-w-7xl px-4 py-1.5 md:px-6">
            <div className="mx-auto max-w-xl md:max-w-2xl">
              <HeaderSearchBar categories={categories} />
            </div>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-50 bg-[rgba(42,34,24,0.45)] lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="h-full w-[86%] max-w-sm bg-[var(--color-surface)] p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="relative h-9 w-[140px]">
                <Image
                  src="/brand/zirbelino-logo-dark.svg"
                  alt="Zirbelino"
                  fill
                  className="object-contain object-left"
                  sizes="140px"
                />
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Menü schließen"
              >
                {"\u2715"}
              </button>
            </div>
            <div className="mb-6 border-b border-[var(--color-border)] pb-5">
              <HeaderAccountControls layout="stack" />
            </div>
            <nav className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-[var(--color-border)] pb-3 text-lg font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
