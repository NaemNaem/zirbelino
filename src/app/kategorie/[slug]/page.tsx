import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/commerce/ProductListing";
import { getCategoryContent } from "@/lib/category-content";
import {
  getCategoryRepository,
  getProductRepository,
} from "@/repositories";

export async function generateStaticParams() {
  const categories = await getCategoryRepository().getAll();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryRepository().getBySlug(slug);
  if (!category) return { title: "Kategorie" };
  const content = getCategoryContent(
    category.slug,
    category.name,
    category.description,
  );
  return {
    title: content.headline,
    description: content.intro,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const categoryRepo = getCategoryRepository();
  const category = await categoryRepo.getBySlug(slug);
  if (!category) notFound();

  const [products, categories] = await Promise.all([
    getProductRepository().getByCategory(category.id),
    categoryRepo.getAll(),
  ]);

  const content = getCategoryContent(
    category.slug,
    category.name,
    category.description,
  );
  const heroImage = products.find((p) => p.images[0])?.images[0]?.url;

  return (
    <ProductListing
      title={category.name}
      intro={category.description}
      products={products}
      categories={categories}
      initialParams={query}
      activeCategoryId={category.id}
      content={content}
      heroImage={heroImage}
    />
  );
}
