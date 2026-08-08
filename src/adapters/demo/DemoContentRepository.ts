import type { ContentPage, FAQ, NavigationItem } from "@/domain";
import type { ContentRepository } from "@/repositories/types";
import { loadDemoJsonOrEmpty } from "./loadDemoData";

export class DemoContentRepository implements ContentRepository {
  async getPages(): Promise<ContentPage[]> {
    return loadDemoJsonOrEmpty<ContentPage[]>("content/pages.json", []);
  }

  async getPageBySlug(slug: string): Promise<ContentPage | null> {
    const pages = await this.getPages();
    return pages.find((page) => page.slug === slug) ?? null;
  }

  async getFaqs(): Promise<FAQ[]> {
    return loadDemoJsonOrEmpty<FAQ[]>("content/faqs.json", []);
  }

  async getNavigation(): Promise<NavigationItem[]> {
    return loadDemoJsonOrEmpty<NavigationItem[]>(
      "navigation/main.json",
      defaultNavigation,
    );
  }
}

const defaultNavigation: NavigationItem[] = [
  { id: "shop", label: "Shop", href: "/shop" },
  { id: "wohnen", label: "Wohnen & Duft", href: "/kategorie/wohnen-duft" },
  { id: "kueche", label: "Küche & Genuss", href: "/kategorie/kueche-genuss" },
  { id: "geschenke", label: "Geschenke", href: "/kategorie/geschenke" },
  { id: "natur", label: "Natur & Garten", href: "/kategorie/natur-garten" },
  { id: "zirbe", label: "Die Zirbe", href: "/die-zirbe" },
  { id: "ueber", label: "Über Zirbelino", href: "/ueber-zirbelino" },
];
