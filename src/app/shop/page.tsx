import { ProductListing } from "@/components/commerce/ProductListing";
import {
  getCategoryRepository,
  getProductRepository,
} from "@/repositories";

export const metadata = {
  title: "Shop",
  description: "Alle Zirbelino Demo-Produkte entdecken.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProductRepository().getAll(),
    getCategoryRepository().getAll(),
  ]);

  return (
    <ProductListing
      title="Shop"
      intro="Echte Zirbenprodukte aus Österreich – kuratierte Demo-Auswahl aus dem öffentlichen Sortiment."
      products={products}
      categories={categories}
      initialParams={params}
    />
  );
}
