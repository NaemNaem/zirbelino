import { DEMO_MODE } from "@/config/env";
import { DemoCategoryRepository } from "@/adapters/demo/DemoCategoryRepository";
import { DemoContentRepository } from "@/adapters/demo/DemoContentRepository";
import { DemoProductRepository } from "@/adapters/demo/DemoProductRepository";
import { DemoReviewRepository } from "@/adapters/demo/DemoReviewRepository";
import type {
  CategoryRepository,
  ContentRepository,
  ProductRepository,
  ReviewRepository,
  SearchRepository,
} from "./types";

/**
 * Composition root.
 * Swap Demo* implementations for production adapters here after go-live data access.
 * UI must only depend on these getters — never on concrete adapters.
 */
export function getProductRepository(): ProductRepository {
  // TODO(PRODUCTION): Replace DemoProductRepository with commerce backend adapter.
  // See: /docs/DEMO_TO_PRODUCTION.md
  if (!DEMO_MODE) {
    // Production path reserved — keep demo until a real adapter is wired.
  }
  return new DemoProductRepository();
}

export function getCategoryRepository(): CategoryRepository {
  return new DemoCategoryRepository();
}

export function getContentRepository(): ContentRepository {
  return new DemoContentRepository();
}

export function getReviewRepository(): ReviewRepository {
  return new DemoReviewRepository();
}

export function getSearchRepository(): SearchRepository {
  const products = getProductRepository();
  const categories = getCategoryRepository();
  const content = getContentRepository();

  return {
    async search(query: string) {
      const [productResults, categoryResults, pages] = await Promise.all([
        products.search(query),
        categories.getAll(),
        content.getPages(),
      ]);

      const normalized = query.trim().toLowerCase();
      return {
        products: productResults,
        categories: categoryResults.filter((category) =>
          `${category.name} ${category.description ?? ""}`
            .toLowerCase()
            .includes(normalized),
        ),
        pages: pages.filter((page) =>
          `${page.title} ${page.excerpt ?? ""} ${page.body}`
            .toLowerCase()
            .includes(normalized),
        ),
      };
    },
  };
}

export type {
  CategoryRepository,
  ContentRepository,
  ProductRepository,
  ReviewRepository,
  SearchRepository,
} from "./types";
