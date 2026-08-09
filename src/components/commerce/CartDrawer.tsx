"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/domain";
import { useCommerce } from "@/components/commerce/CommerceProvider";
import { formatMoney } from "@/lib/format";
import { Button, ButtonLink } from "@/components/ui/Button";

const FREE_SHIPPING_THRESHOLD = 70;

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQuantity, removeFromCart } = useCommerce();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: { products: Product[] }) => setProducts(data.products ?? []))
      .catch(() => setProducts([]));
  }, []);

  if (!cartOpen) return null;

  const lines = cart.items
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) return null;
      return { item, product, lineTotal: product.price.amount * item.quantity };
    })
    .filter(Boolean) as Array<{
    item: (typeof cart.items)[number];
    product: Product;
    lineTotal: number;
  }>;

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const isEmpty = cart.items.length === 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setCartOpen(false)}>
      <aside
        className="ml-auto flex h-full w-full max-w-md flex-col bg-[var(--color-surface)] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        aria-label="Warenkorb"
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">Warenkorb</h2>
          <button type="button" onClick={() => setCartOpen(false)} aria-label="Schließen">
            ✕
          </button>
        </div>

        <div className="border-b border-[var(--color-border)] px-5 py-4">
          <div className="h-2 overflow-hidden rounded-full bg-[var(--color-border)]">
            <div
              className="h-full bg-[var(--color-primary)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            {remaining > 0
              ? `Noch ${formatMoney({ amount: remaining, currency: "EUR" })} bis zum kostenlosen Versand.`
              : "Kostenloser Versand freigeschaltet."}
          </p>
        </div>

        <div className="flex-1 space-y-4 overflow-auto px-5 py-4">
          {lines.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">Dein Warenkorb ist leer.</p>
          ) : (
            lines.map(({ item, product, lineTotal }) => (
              <div key={item.key} className="flex gap-3 border-b border-[var(--color-border)] pb-4">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-[var(--color-background)]">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium">{product.name}</p>
                  <p className="mt-1 text-sm">{formatMoney({ amount: lineTotal, currency: "EUR" })}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <label className="sr-only" htmlFor={`qty-${item.key}`}>
                      Menge
                    </label>
                    <input
                      id={`qty-${item.key}`}
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) =>
                        updateQuantity(item.key, Number(event.target.value) || 1)
                      }
                      className="w-16 rounded border border-[var(--color-border)] px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      className="text-xs text-[var(--color-text-muted)] underline"
                      onClick={() => removeFromCart(item.key)}
                    >
                      Entfernen
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-3 border-t border-[var(--color-border)] px-5 py-4">
          <div className="flex items-center justify-between text-sm">
            <span>Zwischensumme</span>
            <strong>{formatMoney({ amount: subtotal, currency: "EUR" })}</strong>
          </div>
          {isEmpty ? (
            <Button className="w-full" disabled aria-disabled="true">
              Zur Kasse
            </Button>
          ) : (
            <div onClick={() => setCartOpen(false)}>
              <ButtonLink href="/kasse" className="w-full">
                Zur Kasse
              </ButtonLink>
            </div>
          )}
          <Button variant="secondary" className="w-full" onClick={() => setCartOpen(false)}>
            Weiter einkaufen
          </Button>
          <Link href="/warenkorb" onClick={() => setCartOpen(false)} className="block text-center text-sm underline">
            Warenkorb ansehen
          </Link>
        </div>
      </aside>
    </div>
  );
}
