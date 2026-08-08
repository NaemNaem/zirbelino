import type { SEOData, SourceMetadata } from "./common";
import type { MediaAsset } from "./media";

export interface ContentPage {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  body: string;
  type:
    | "about"
    | "story"
    | "craft"
    | "faq"
    | "shipping"
    | "payment"
    | "contact"
    | "legal"
    | "knowledge"
    | "other";
  heroImage?: MediaAsset;
  seo?: SEOData;
  source?: SourceMetadata;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  body: string;
  publishedAt?: string;
  coverImage?: MediaAsset;
  seo?: SEOData;
  source?: SourceMetadata;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  source?: SourceMetadata;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  children?: NavigationItem[];
  featured?: boolean;
}
