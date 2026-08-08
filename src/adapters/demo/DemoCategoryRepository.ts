import type { Category } from "@/domain";
import type { CategoryRepository } from "@/repositories/types";
import { loadDemoJsonOrEmpty } from "./loadDemoData";

export class DemoCategoryRepository implements CategoryRepository {
  private async categories(): Promise<Category[]> {
    return loadDemoJsonOrEmpty<Category[]>("categories/categories.json", []);
  }

  async getAll(): Promise<Category[]> {
    return this.categories();
  }

  async getBySlug(slug: string): Promise<Category | null> {
    const categories = await this.categories();
    return categories.find((category) => category.slug === slug) ?? null;
  }

  async getById(id: string): Promise<Category | null> {
    const categories = await this.categories();
    return categories.find((category) => category.id === id) ?? null;
  }
}
