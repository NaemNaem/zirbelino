import type { CanonicalBundle, RawSourceBundle } from "./types";
import type { Category, ContentPage, FAQ, Product, Review } from "@/domain";

/**
 * Converts importer-specific raw payloads into the Canonical Commerce Model.
 * Source-specific fields may only survive inside `source` metadata.
 */
export function normalizeBundle(raw: RawSourceBundle): CanonicalBundle {
  return {
    products: raw.products.map(normalizeProduct).filter(Boolean) as Product[],
    categories: raw.categories
      .map(normalizeCategory)
      .filter(Boolean) as Category[],
    reviews: raw.reviews.map(normalizeReview).filter(Boolean) as Review[],
    pages: raw.pages.map(normalizePage).filter(Boolean) as ContentPage[],
    faqs: raw.faqs.map(normalizeFaq).filter(Boolean) as FAQ[],
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function normalizeProduct(value: unknown): Product | null {
  const row = asRecord(value);
  const id = asString(row.id);
  const slug = asString(row.slug);
  const name = asString(row.name);
  const amount = asNumber(row.priceAmount) ?? asNumber(asRecord(row.price).amount);

  if (!id || !slug || !name || amount === undefined) return null;

  return {
    ...(row as unknown as Product),
    id,
    slug,
    name,
    price: {
      amount,
      currency: asString(asRecord(row.price).currency) ?? "EUR",
    },
    images: Array.isArray(row.images) ? (row.images as Product["images"]) : [],
    categoryIds: Array.isArray(row.categoryIds)
      ? (row.categoryIds as string[])
      : [],
    availability:
      (asString(row.availability) as Product["availability"]) ?? "unknown",
    source: {
      system: asString(asRecord(row.source).system),
      externalId: asString(asRecord(row.source).externalId) ?? asString(row.externalId),
      originalUrl: asString(asRecord(row.source).originalUrl) ?? asString(row.originalUrl),
      importedAt: asString(asRecord(row.source).importedAt) ?? new Date().toISOString(),
      checksum: asString(asRecord(row.source).checksum),
    },
  };
}

function normalizeCategory(value: unknown): Category | null {
  const row = asRecord(value);
  const id = asString(row.id);
  const slug = asString(row.slug);
  const name = asString(row.name);
  if (!id || !slug || !name) return null;
  return row as unknown as Category;
}

function normalizeReview(value: unknown): Review | null {
  const row = asRecord(value);
  const id = asString(row.id);
  const authorName = asString(row.authorName);
  const body = asString(row.body);
  const rating = asNumber(row.rating);
  if (!id || !authorName || !body || rating === undefined) return null;
  return row as unknown as Review;
}

function normalizePage(value: unknown): ContentPage | null {
  const row = asRecord(value);
  const id = asString(row.id);
  const slug = asString(row.slug);
  const title = asString(row.title);
  const body = asString(row.body);
  if (!id || !slug || !title || !body) return null;
  return row as unknown as ContentPage;
}

function normalizeFaq(value: unknown): FAQ | null {
  const row = asRecord(value);
  const id = asString(row.id);
  const question = asString(row.question);
  const answer = asString(row.answer);
  if (!id || !question || !answer) return null;
  return row as unknown as FAQ;
}
