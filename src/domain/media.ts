import type { SourceMetadata } from "./common";

export interface MediaAsset {
  id: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  mimeType?: string;
  role?: "primary" | "gallery" | "swatch" | "content";
  source?: SourceMetadata;
}
