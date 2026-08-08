import type {
  Category,
  ContentPage,
  FAQ,
  NavigationItem,
  Product,
  Review,
} from "@/domain";

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  getBySlug(slug: string): Promise<Product | null>;
  getFeatured(): Promise<Product[]>;
  getByCategory(categoryId: string): Promise<Product[]>;
  search(query: string): Promise<Product[]>;
}

export interface CategoryRepository {
  getAll(): Promise<Category[]>;
  getBySlug(slug: string): Promise<Category | null>;
  getById(id: string): Promise<Category | null>;
}

export interface ContentRepository {
  getPages(): Promise<ContentPage[]>;
  getPageBySlug(slug: string): Promise<ContentPage | null>;
  getFaqs(): Promise<FAQ[]>;
  getNavigation(): Promise<NavigationItem[]>;
}

export interface ReviewRepository {
  getAll(): Promise<Review[]>;
  getByProduct(productId: string): Promise<Review[]>;
  getFeatured(limit?: number): Promise<Review[]>;
}

export interface SearchRepository {
  search(query: string): Promise<{
    products: Product[];
    categories: Category[];
    pages: ContentPage[];
  }>;
}
