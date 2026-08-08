import type { Product } from "@/domain";
import type { ProductRepository } from "@/repositories/types";
import { loadDemoJsonOrEmpty } from "./loadDemoData";

export class DemoProductRepository implements ProductRepository {
  private async products(): Promise<Product[]> {
    return loadDemoJsonOrEmpty<Product[]>("products/products.json", []);
  }

  async getAll(): Promise<Product[]> {
    return this.products();
  }

  async getById(id: string): Promise<Product | null> {
    const products = await this.products();
    return products.find((product) => product.id === id) ?? null;
  }

  async getBySlug(slug: string): Promise<Product | null> {
    const products = await this.products();
    return products.find((product) => product.slug === slug) ?? null;
  }

  async getFeatured(): Promise<Product[]> {
    const products = await this.products();
    return products.filter(
      (product) =>
        product.flags?.featured ||
        product.flags?.bestseller ||
        product.flags?.sale,
    );
  }

  async getByCategory(categoryId: string): Promise<Product[]> {
    const products = await this.products();
    return products.filter((product) =>
      product.categoryIds.includes(categoryId),
    );
  }

  async search(query: string): Promise<Product[]> {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    const products = await this.products();
    return products.filter((product) => {
      const haystack = [
        product.name,
        product.shortDescription,
        product.description,
        ...(product.tags ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }
}
