import type { SEOData, SourceMetadata } from "./common";
import type { MediaAsset } from "./media";

export interface Category {
  id: string;
  externalId?: string;
  slug: string;
  name: string;
  description?: string;
  parentId?: string | null;
  image?: MediaAsset;
  productIds?: string[];
  seo?: SEOData;
  source?: SourceMetadata;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description?: string;
  productIds: string[];
  image?: MediaAsset;
  seo?: SEOData;
  source?: SourceMetadata;
}
