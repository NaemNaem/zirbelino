"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/domain";
import { useCommerce } from "@/components/commerce/CommerceProvider";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, hasWishlist } = useCommerce();
  const [quantity, setQuantity] = useState(1);
  const image = product.images[0];

  const buyNow = () => {
    addToCart({ productId: product.id, quantity, openCart: false });
    router.push("/kasse");
  };

  return (
    <article className="group flex h-full flex-col">
      <div className="relative overflow-hidden bg-[linear-gradient(160deg,#e8d7c0,#f4ebdf)] shadow-[inset_0_0_0_1px_rgba(139,90,43,0.12)]">
        <Link href={`/produkt/${product.slug}`} className="block aspect-[4/5]">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt || product.name}
              fill
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
              sizes="(max-width:768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[var(--color-text-muted)]">
              Kein Bild
            </div>
          )}
        </Link>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[rgba(42,34,24,0.28)] to-transparent opacity-70" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.flags?.sale ? (
            <span className="bg-[var(--color-sale)] px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
              Sale
            </span>
          ) : null}
          {product.flags?.new ? (
            <span className="bg-[var(--color-needle)] px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
              Neu
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-3 top-3 rounded-[var(--radius-craft)] bg-[rgba(247,238,226,0.92)] px-2.5 py-1 text-xs font-medium text-[var(--color-wood)] shadow-sm"
          aria-label="Merkliste"
        >
          {hasWishlist(product.id) ? "♥" : "♡"}
        </button>
      </div>

      <div className="flex flex-1 flex-col border-t border-[var(--color-wood)]/20 pt-4">
        <Link
          href={`/produkt/${product.slug}`}
          className="min-h-[2.75rem] line-clamp-2 text-base font-medium leading-snug text-[var(--color-primary-dark)] transition group-hover:text-[var(--color-wood)]"
        >
          {product.name}
        </Link>
        {product.rating ? (
          <div className="mt-2 flex items-center gap-2">
            <StarRating rating={product.rating} size="sm" showValue />
            <span className="text-xs text-[var(--color-text-muted)]">
              ({product.reviewCount ?? 0})
            </span>
          </div>
        ) : (
          <div className="mt-2 min-h-[1.5rem]" />
        )}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-[var(--color-wood)]">
            {formatMoney(product.price)}
          </span>
          {product.compareAtPrice ? (
            <span className="text-sm text-[var(--color-text-muted)] line-through">
              {formatMoney(product.compareAtPrice)}
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-4">
          <div className="inline-flex w-fit items-center rounded-[var(--radius-craft)] border border-[var(--color-border)] bg-[var(--color-surface)]">
            <button
              type="button"
              aria-label="Menge verringern"
              className="h-10 w-10 text-lg font-semibold text-[var(--color-wood)]"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className="min-w-8 text-center text-sm font-semibold tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Menge erhöhen"
              className="h-10 w-10 text-lg font-semibold text-[var(--color-wood)]"
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            >
              +
            </button>
          </div>
          <Button
            className="w-full"
            onClick={() => addToCart({ productId: product.id, quantity })}
          >
            In den Warenkorb
          </Button>
          <Button variant="secondary" className="w-full" onClick={buyNow}>
            Jetzt kaufen
          </Button>
        </div>
      </div>
    </article>
  );
}
