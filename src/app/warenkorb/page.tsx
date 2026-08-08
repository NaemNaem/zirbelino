"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/domain";
import { useCommerce } from "@/components/commerce/CommerceProvider";
import { ButtonLink } from "@/components/ui/Button";
import { formatMoney } from "@/lib/format";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCommerce();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: { products: Product[] }) => setProducts(data.products ?? []));
  }, []);

  const lines = cart.items
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) return null;
      return { item, product, total: product.price.amount * item.quantity };
    })
    .filter(Boolean) as Array<{
    item: (typeof cart.items)[number];
    product: Product;
    total: number;
  }>;

  const subtotal = lines.reduce((sum, line) => sum + line.total, 0);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-primary-dark)]">
        Warenkorb
      </h1>
      <div className="mt-8 space-y-4">
        {lines.map(({ item, product, total }) => (
          <div key={item.key} className="flex gap-4 border-b border-[var(--color-border)] pb-4">
            <div className="relative h-24 w-20 overflow-hidden bg-[var(--color-surface)]">
              {product.images[0] ? (
                <Image src={product.images[0].url} alt={product.name} fill className="object-cover" sizes="80px" />
              ) : null}
            </div>
            <div className="flex-1">
              <Link href={`/produkt/${product.slug}`} className="font-medium">
                {product.name}
              </Link>
              <p className="mt-1 text-sm">{formatMoney({ amount: total, currency: "EUR" })}</p>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.key, Number(e.target.value) || 1)}
                  className="w-20 rounded border border-[var(--color-border)] px-2 py-1"
                />
                <button type="button" className="text-sm underline" onClick={() => removeFromCart(item.key)}>
                  Entfernen
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {lines.length === 0 ? (
        <p className="mt-8 text-[var(--color-text-muted)]">Dein Warenkorb ist leer.</p>
      ) : (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-lg font-semibold">
            Zwischensumme {formatMoney({ amount: subtotal, currency: "EUR" })}
          </p>
          <ButtonLink href="/kasse">Zur Kasse</ButtonLink>
        </div>
      )}
    </main>
  );
}
