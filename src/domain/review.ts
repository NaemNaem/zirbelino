import type { SourceMetadata } from "./common";

export interface Review {
  id: string;
  productId?: string;
  authorName: string;
  authorLocation?: string;
  rating: number;
  title?: string;
  body: string;
  createdAt?: string;
  verified?: boolean;
  source?: SourceMetadata;
}
