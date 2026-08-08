/**
 * Payment abstraction.
 * Demo never charges. Production adapter plugs in here without UI changes.
 */

export interface PaymentIntentInput {
  orderId: string;
  amount: number;
  currency: string;
  methodId: string;
}

export interface PaymentIntentResult {
  status: "demo_skipped" | "requires_action" | "succeeded" | "failed";
  providerReference?: string;
  message?: string;
}

export interface PaymentService {
  createIntent(input: PaymentIntentInput): Promise<PaymentIntentResult>;
}

export class DemoPaymentService implements PaymentService {
  async createIntent(input: PaymentIntentInput): Promise<PaymentIntentResult> {
    // TODO(PRODUCTION): Replace DemoPaymentService with real payment provider.
    // See: /docs/DEMO_TO_PRODUCTION.md#payments
    return {
      status: "demo_skipped",
      providerReference: `demo-${input.orderId}`,
      message: "Demo mode: payment was simulated and not charged.",
    };
  }
}

export const paymentService: PaymentService = new DemoPaymentService();
