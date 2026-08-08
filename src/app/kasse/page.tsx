"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Order, Product } from "@/domain";
import { checkoutService } from "@/services/CheckoutService";
import { paymentService } from "@/services/PaymentService";
import { cartService } from "@/services/CartService";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/Button";

const fieldClass =
  "w-full rounded-full border border-[var(--color-border)] bg-white px-4 py-3";

export default function CheckoutPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cartTick, setCartTick] = useState(0);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: { products: Product[] }) => setProducts(data.products ?? []));
  }, []);

  const cart = useMemo(() => {
    void cartTick;
    return cartService.getCart();
  }, [cartTick]);

  const lines = cart.items
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) return null;
      return {
        item,
        product,
        total: product.price.amount * item.quantity,
      };
    })
    .filter(Boolean) as Array<{
    item: (typeof cart.items)[number];
    product: Product;
    total: number;
  }>;

  const subtotal = lines.reduce((sum, line) => sum + line.total, 0);
  const shipping = subtotal >= 70 ? 0 : 4.9;
  const total = subtotal + shipping;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const form = new FormData(event.currentTarget);

    const draftItems = lines.map((line) => ({
      id: line.item.key,
      productId: line.product.id,
      name: line.product.name,
      quantity: line.item.quantity,
      unitPrice: line.product.price,
      totalPrice: { amount: line.total, currency: "EUR" as const },
      imageUrl: line.product.images[0]?.url,
    }));

    const placed = await checkoutService.placeOrder({
      email: String(form.get("email") || ""),
      shippingAddress: {
        firstName: String(form.get("firstName") || ""),
        lastName: String(form.get("lastName") || ""),
        line1: String(form.get("line1") || ""),
        postalCode: String(form.get("postalCode") || ""),
        city: String(form.get("city") || ""),
        country: String(form.get("country") || "AT"),
        phone: String(form.get("phone") || ""),
      },
      shippingMethodId: String(form.get("shippingMethod") || "standard"),
      paymentMethodId: String(form.get("paymentMethod") || "invoice"),
      voucherCode: String(form.get("voucher") || "") || undefined,
      items: draftItems,
      subtotal: { amount: subtotal, currency: "EUR" },
      shippingTotal: { amount: shipping, currency: "EUR" },
      total: { amount: total, currency: "EUR" },
    });

    await paymentService.createIntent({
      orderId: placed.id,
      amount: total,
      currency: "EUR",
      methodId: placed.paymentMethodId || "invoice",
    });

    cartService.clear();
    setCartTick((value) => value + 1);
    setOrder(placed);
    setSubmitting(false);
  }

  if (order) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 md:px-6">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Demo-Bestätigung
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--color-primary-dark)]">
          Danke – Bestellung simuliert
        </h1>
        <p className="mt-4 text-[var(--color-text-muted)]">
          Bestellnummer {order.number}. Es wurde keine echte Zahlung ausgeführt
          und keine E-Mail versendet.
        </p>
        <dl className="mt-8 space-y-2 text-sm">
          <div className="flex justify-between"><dt>E-Mail</dt><dd>{order.email}</dd></div>
          <div className="flex justify-between"><dt>Summe</dt><dd>{formatMoney(order.total)}</dd></div>
          <div className="flex justify-between"><dt>Status</dt><dd>{order.status}</dd></div>
        </dl>
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-[1.2fr_0.8fr] md:px-6 md:py-14">
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-primary-dark)]">
            Kasse
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Demo-Checkout · keine echten Zahlungen
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Kontakt</h2>
          <input name="email" type="email" required placeholder="E-Mail" className={fieldClass} />
        </section>

        <section className="grid gap-3 md:grid-cols-2">
          <h2 className="text-lg font-semibold md:col-span-2">Lieferadresse</h2>
          <input name="firstName" required placeholder="Vorname" className={fieldClass} />
          <input name="lastName" required placeholder="Nachname" className={fieldClass} />
          <input name="line1" required placeholder="Straße und Hausnummer" className={`${fieldClass} md:col-span-2`} />
          <input name="postalCode" required placeholder="PLZ" className={fieldClass} />
          <input name="city" required placeholder="Ort" className={fieldClass} />
          <input name="country" defaultValue="AT" required placeholder="Land" className={fieldClass} />
          <input name="phone" placeholder="Telefon" className={fieldClass} />
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Versand</h2>
          {checkoutService.getShippingMethods().map((method) => (
            <label key={method.id} className="flex items-center gap-3 text-sm">
              <input
                type="radio"
                name="shippingMethod"
                value={method.id}
                defaultChecked={method.id === (subtotal >= 70 ? "free" : "standard")}
              />
              {method.name} · {formatMoney(method.price)}
            </label>
          ))}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Zahlung</h2>
          {checkoutService.getPaymentMethods().map((method) => (
            <label key={method.id} className="flex items-center gap-3 text-sm">
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                defaultChecked={method.id === "invoice"}
              />
              {method.name}
            </label>
          ))}
        </section>

        <section>
          <label className="text-sm font-semibold" htmlFor="voucher">
            Gutschein
          </label>
          <input id="voucher" name="voucher" placeholder="Code (Demo)" className={`${fieldClass} mt-2`} />
        </section>

        <Button type="submit" disabled={submitting || lines.length === 0} className="w-full md:w-auto">
          {submitting ? "Wird erstellt…" : "Demo-Bestellung abschließen"}
        </Button>
      </form>

      <aside className="h-fit border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h2 className="text-lg font-semibold">Übersicht</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {lines.map((line) => (
            <li key={line.item.key} className="flex justify-between gap-3">
              <span className="line-clamp-2">
                {line.item.quantity}× {line.product.name}
              </span>
              <span>{formatMoney({ amount: line.total, currency: "EUR" })}</span>
            </li>
          ))}
          {lines.length === 0 ? (
            <li className="text-[var(--color-text-muted)]">Warenkorb ist leer.</li>
          ) : null}
        </ul>
        <dl className="mt-6 space-y-2 border-t border-[var(--color-border)] pt-4 text-sm">
          <div className="flex justify-between"><dt>Zwischensumme</dt><dd>{formatMoney({ amount: subtotal, currency: "EUR" })}</dd></div>
          <div className="flex justify-between"><dt>Versand</dt><dd>{formatMoney({ amount: shipping, currency: "EUR" })}</dd></div>
          <div className="flex justify-between font-semibold"><dt>Gesamt</dt><dd>{formatMoney({ amount: total, currency: "EUR" })}</dd></div>
        </dl>
      </aside>
    </main>
  );
}
