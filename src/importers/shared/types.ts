import type { Category, ContentPage, FAQ, Product, Review } from "@/domain";

/**
 * Every source importer (crawler, Shopify, OpenCart DB, CSV, …)
 * must emit this shape before normalization/validation persists data.
 */
export interface RawSourceBundle {
  sourceSystem: string;
  fetchedAt: string;
  products: unknown[];
  categories: unknown[];
  reviews: unknown[];
  pages: unknown[];
  faqs: unknown[];
  mediaUrls: string[];
  urls: string[];
  warnings: string[];
  errors: string[];
}

export interface CanonicalBundle {
  products: Product[];
  categories: Category[];
  reviews: Review[];
  pages: ContentPage[];
  faqs: FAQ[];
}

export interface UrlMapEntry {
  oldUrl: string;
  contentType: "product" | "category" | "content" | "other";
  entityId?: string;
  futureUrl?: string;
}

export interface MigrationReport {
  generatedAt: string;
  sourceSystem?: string;
  urlsFound: number;
  productPages: number;
  categoryPages: number;
  contentPages: number;
  products: number;
  categories: number;
  images: number;
  reviews: number;
  productsWithoutPrice: string[];
  productsWithoutImages: string[];
  productsWithoutDescription: string[];
  unrecognizedPages: string[];
  crawlErrors: string[];
  redirectCandidates: number;
  possibleDuplicates: string[];
  notes: string[];
}

export interface SourceImporter {
  readonly name: string;
  import(): Promise<RawSourceBundle>;
}
