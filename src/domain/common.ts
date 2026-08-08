/**
 * Shared canonical primitives.
 * No shop-system-specific fields belong here.
 */

export interface Money {
  amount: number;
  currency: "EUR" | "CHF" | "USD" | string;
}

export interface SEOData {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export interface SourceMetadata {
  system?: string;
  externalId?: string;
  originalUrl?: string;
  importedAt?: string;
  checksum?: string;
}

export type ProductAvailability =
  | "in_stock"
  | "low_stock"
  | "out_of_stock"
  | "preorder"
  | "request_only"
  | "unknown";

export interface ProductAttribute {
  key: string;
  label: string;
  value: string;
}

export interface PersonalizationOption {
  id: string;
  label: string;
  type: "text" | "select" | "boolean";
  required?: boolean;
  maxLength?: number;
  options?: string[];
}
