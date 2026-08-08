"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/domain";
import { ProductCard } from "@/components/product/ProductCard";
import { useCommerce } from "@/components/commerce/CommerceProvider";

export default function WishlistPage() {
  const { wishlistIds } = useCommerce();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: { products: Product[] }) => setProducts(data.products ?? []));
  }, []);

  const items = products.filter((product) => wishlistIds.includes(product.id));

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-primary-dark)]">
        Merkliste
      </h1>
      <p className="mt-3 text-sm text-[var(--color-text-muted)]">
        Lokal gespeichert in der Demo – später an Kundenkonto anbindbar.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {items.length === 0 ? (
        <p className="mt-8 text-[var(--color-text-muted)]">Noch keine Produkte gemerkt.</p>
      ) : null}
    </main>
  );
}
