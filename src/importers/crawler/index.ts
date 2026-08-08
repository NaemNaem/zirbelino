import type { RawSourceBundle, SourceImporter } from "../shared/types";

/**
 * Public-site crawler for zirbenprodukte.at demo data.
 * Implements SourceImporter so a later OpenCart/API/DB importer can replace it
 * without touching the frontend.
 *
 * Rules:
 * - public pages only
 * - respect robots.txt
 * - low request rate
 * - never reconstruct customers/orders/vouchers/passwords
 */
export class CrawlerImporter implements SourceImporter {
  readonly name = "zirbenprodukte-crawler";

  constructor(
    private readonly options: {
      baseUrl?: string;
      productLimit?: number;
      delayMs?: number;
    } = {},
  ) {}

  async import(): Promise<RawSourceBundle> {
    // Implementation filled in Phase 2 (scripts/crawl.ts).
    // Keeping the class here locks the adapter contract early for go-live swaps.
    return {
      sourceSystem: "zirbenprodukte.at-public",
      fetchedAt: new Date().toISOString(),
      products: [],
      categories: [],
      reviews: [],
      pages: [],
      faqs: [],
      mediaUrls: [],
      urls: [],
      warnings: [
        "CrawlerImporter.import() placeholder — run scripts/crawl.ts once implemented.",
      ],
      errors: [],
    };
  }
}
