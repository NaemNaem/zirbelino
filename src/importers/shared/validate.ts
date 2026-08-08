import type { CanonicalBundle, MigrationReport, UrlMapEntry } from "./types";

export function buildMigrationReport(input: {
  sourceSystem?: string;
  urlsFound: number;
  productPages: number;
  categoryPages: number;
  contentPages: number;
  images: number;
  bundle: CanonicalBundle;
  urlMap: UrlMapEntry[];
  crawlErrors?: string[];
  unrecognizedPages?: string[];
  notes?: string[];
}): MigrationReport {
  const { bundle } = input;

  return {
    generatedAt: new Date().toISOString(),
    sourceSystem: input.sourceSystem,
    urlsFound: input.urlsFound,
    productPages: input.productPages,
    categoryPages: input.categoryPages,
    contentPages: input.contentPages,
    products: bundle.products.length,
    categories: bundle.categories.length,
    images: input.images,
    reviews: bundle.reviews.length,
    productsWithoutPrice: bundle.products
      .filter((product) => !Number.isFinite(product.price?.amount))
      .map((product) => product.id),
    productsWithoutImages: bundle.products
      .filter((product) => product.images.length === 0)
      .map((product) => product.id),
    productsWithoutDescription: bundle.products
      .filter((product) => !product.description && !product.shortDescription)
      .map((product) => product.id),
    unrecognizedPages: input.unrecognizedPages ?? [],
    crawlErrors: input.crawlErrors ?? [],
    redirectCandidates: input.urlMap.length,
    possibleDuplicates: findDuplicateSlugs(bundle),
    notes: input.notes ?? [],
  };
}

function findDuplicateSlugs(bundle: CanonicalBundle): string[] {
  const seen = new Map<string, number>();
  for (const product of bundle.products) {
    seen.set(product.slug, (seen.get(product.slug) ?? 0) + 1);
  }
  return [...seen.entries()]
    .filter(([, count]) => count > 1)
    .map(([slug]) => slug);
}

/**
 * Go-live helper: compare source counts vs imported counts.
 * Use after real backend import — not only crawler demo import.
 */
export function validateMigrationCounts(expected: {
  products?: number;
  variants?: number;
  customers?: number;
  orders?: number;
  images?: number;
}, actual: typeof expected): { ok: boolean; mismatches: string[] } {
  const mismatches: string[] = [];
  for (const key of Object.keys(expected) as (keyof typeof expected)[]) {
    if (expected[key] === undefined || actual[key] === undefined) continue;
    if (expected[key] !== actual[key]) {
      mismatches.push(`${key}: expected ${expected[key]}, imported ${actual[key]}`);
    }
  }
  return { ok: mismatches.length === 0, mismatches };
}
