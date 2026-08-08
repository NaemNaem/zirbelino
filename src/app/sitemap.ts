import type { MetadataRoute } from "next";
import { env } from "@/config/env";
import {
  getCategoryRepository,
  getContentRepository,
  getProductRepository,
} from "@/repositories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, pages] = await Promise.all([
    getProductRepository().getAll(),
    getCategoryRepository().getAll(),
    getContentRepository().getPages(),
  ]);

  return [
    { url: `${env.siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${env.siteUrl}/shop`, changeFrequency: "weekly", priority: 0.9 },
    ...categories.map((category) => ({
      url: `${env.siteUrl}/kategorie/${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: `${env.siteUrl}/produkt/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...pages.map((page) => ({
      url: `${env.siteUrl}/${page.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
