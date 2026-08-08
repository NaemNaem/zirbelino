import type { Money, SourceMetadata } from "./common";

export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  company?: string;
  line1: string;
  line2?: string;
  postalCode: string;
  city: string;
  country: string;
  phone?: string;
}

export interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  addresses?: Address[];
  source?: SourceMetadata;
}

export interface Discount {
  id: string;
  code?: string;
  label: string;
  type: "percentage" | "fixed" | "shipping";
  value: number;
}

export interface Voucher {
  id: string;
  code: string;
  label?: string;
  type: "percentage" | "fixed" | "shipping";
  value: number;
  active: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  sku?: string;
  quantity: number;
  unitPrice: Money;
  totalPrice: Money;
  imageUrl?: string;
  personalization?: Record<string, string>;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description?: string;
  price: Money;
  estimatedDelivery?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  provider?: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  variantId?: string;
  sku?: string;
  quantityAvailable?: number;
  availabilityNote?: string;
  source?: SourceMetadata;
}

export type OrderStatus =
  | "draft"
  | "pending_payment"
  | "paid"
  | "fulfilled"
  | "cancelled"
  | "demo";

export interface Order {
  id: string;
  number?: string;
  email: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: Money;
  shippingTotal: Money;
  discountTotal?: Money;
  total: Money;
  shippingAddress?: Address;
  billingAddress?: Address;
  shippingMethodId?: string;
  paymentMethodId?: string;
  voucherCode?: string;
  createdAt: string;
  source?: SourceMetadata;
}

export interface CartItem {
  key: string;
  productId: string;
  variantId?: string;
  quantity: number;
  personalization?: Record<string, string>;
}

export interface Cart {
  items: CartItem[];
  updatedAt: string;
}
