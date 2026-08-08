import type { MetadataRoute } from "next";
import { env } from "@/config/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/kasse", "/api/", "/warenkorb"],
    },
    sitemap: `${env.siteUrl}/sitemap.xml`,
  };
}
