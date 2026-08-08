import type {
  Money,
  PersonalizationOption,
  ProductAttribute,
  ProductAvailability,
  SEOData,
  SourceMetadata,
} from "./common";
import type { MediaAsset } from "./media";

export interface ProductVariant {
  id: string;
  externalId?: string;
  sku?: string;
  name: string;
  options: Record<string, string>;
  price?: Money;
  compareAtPrice?: Money;
  availability?: ProductAvailability;
  imageIds?: string[];
}

export interface Product {
  id: string;
  externalId?: string;

  slug: string;
  sku?: string;
  ean?: string;

  name: string;
  shortDescription?: string;
  description?: string;

  price: Money;
  compareAtPrice?: Money;

  images: MediaAsset[];

  categoryIds: string[];
  collectionIds?: string[];

  tags?: string[];

  rating?: number;
  reviewCount?: number;

  availability: ProductAvailability;

  variants?: ProductVariant[];
  personalization?: PersonalizationOption[];
  attributes?: ProductAttribute[];

  materials?: string[];
  dimensions?: string;
  careInstructions?: string;
  deliveryTime?: string;
  shippingInformation?: string;

  relatedProductIds?: string[];

  flags?: {
    bestseller?: boolean;
    new?: boolean;
    sale?: boolean;
    featured?: boolean;
    personalized?: boolean;
  };

  seo?: SEOData;
  source?: SourceMetadata;
}
