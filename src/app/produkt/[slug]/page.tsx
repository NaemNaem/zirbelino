import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import {
  getCategoryRepository,
  getProductRepository,
  getReviewRepository,
} from "@/repositories";

export async function generateStaticParams() {
  const products = await getProductRepository().getAll();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductRepository().getBySlug(slug);
  if (!product) return { title: "Produkt" };
  return {
    title: product.seo?.title || product.name,
    description: product.seo?.description || product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images[0] ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const productRepo = getProductRepository();
  const product = await productRepo.getBySlug(slug);
  if (!product) notFound();

  const [allProducts, reviews, categories] = await Promise.all([
    productRepo.getAll(),
    getReviewRepository().getByProduct(product.id),
    getCategoryRepository().getAll(),
  ]);

  const related = allProducts.filter((entry) =>
    product.relatedProductIds?.includes(entry.id),
  );

  const saleProducts = allProducts
    .filter(
      (entry) =>
        entry.id !== product.id &&
        (entry.flags?.sale || Boolean(entry.compareAtPrice)),
    )
    .slice(0, 8);

  const categoryImages = Object.fromEntries(
    categories.map((category) => [
      category.id,
      allProducts.find((entry) => entry.categoryIds.includes(category.id))
        ?.images[0]?.url,
    ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.shortDescription || product.description,
            sku: product.sku,
            gtin13: product.ean,
            image: product.images.map((image) => image.url),
            offers: {
              "@type": "Offer",
              priceCurrency: product.price.currency,
              price: product.price.amount,
              availability:
                product.availability === "in_stock"
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
            aggregateRating: product.rating
              ? {
                  "@type": "AggregateRating",
                  ratingValue: product.rating,
                  reviewCount: product.reviewCount ?? 0,
                }
              : undefined,
          }),
        }}
      />
      <ProductDetail
        product={product}
        related={related}
        reviews={reviews}
        saleProducts={saleProducts}
        categories={categories}
        categoryImages={categoryImages}
      />
    </>
  );
}
