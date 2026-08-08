import { DEMO_MODE } from "@/config/env";
import type {
  Address,
  Money,
  Order,
  OrderItem,
  PaymentMethod,
  ShippingMethod,
} from "@/domain";

export interface CheckoutDraft {
  email: string;
  shippingAddress: Address;
  billingAddress?: Address;
  shippingMethodId: string;
  paymentMethodId: string;
  voucherCode?: string;
  items: OrderItem[];
  subtotal: Money;
  shippingTotal: Money;
  discountTotal?: Money;
  total: Money;
}

/**
 * Demo checkout — creates a local confirmation only.
 * TODO(PRODUCTION): Replace with CommerceCheckoutService + PaymentService webhooks.
 * See: /docs/DEMO_TO_PRODUCTION.md#payments
 */
export class CheckoutService {
  getShippingMethods(): ShippingMethod[] {
    return [
      {
        id: "standard",
        name: "Standardversand",
        description: "AT/DE Standard",
        price: { amount: 4.9, currency: "EUR" },
        estimatedDelivery: "1–3 Werktage",
      },
      {
        id: "free",
        name: "Kostenloser Versand",
        description: "Ab 70 € Bestellwert",
        price: { amount: 0, currency: "EUR" },
        estimatedDelivery: "1–3 Werktage",
      },
    ];
  }

  getPaymentMethods(): PaymentMethod[] {
    return [
      { id: "invoice", name: "Kauf auf Rechnung", provider: "demo" },
      { id: "paypal", name: "PayPal", provider: "demo" },
      { id: "card", name: "Kreditkarte", provider: "demo" },
    ];
  }

  async placeOrder(draft: CheckoutDraft): Promise<Order> {
    if (!DEMO_MODE) {
      throw new Error(
        "Production checkout is not wired yet. Keep DEMO_MODE=true until PaymentService is connected.",
      );
    }

    // No emails, no payment capture, no remote writes in demo mode.
    return {
      id: `demo-${Date.now()}`,
      number: `ZIR-DEMO-${Date.now().toString().slice(-6)}`,
      email: draft.email,
      status: "demo",
      items: draft.items,
      subtotal: draft.subtotal,
      shippingTotal: draft.shippingTotal,
      discountTotal: draft.discountTotal,
      total: draft.total,
      shippingAddress: draft.shippingAddress,
      billingAddress: draft.billingAddress ?? draft.shippingAddress,
      shippingMethodId: draft.shippingMethodId,
      paymentMethodId: draft.paymentMethodId,
      voucherCode: draft.voucherCode,
      createdAt: new Date().toISOString(),
      source: { system: "demo", importedAt: new Date().toISOString() },
    };
  }
}

export const checkoutService = new CheckoutService();
