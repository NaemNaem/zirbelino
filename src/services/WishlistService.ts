const STORAGE_KEY = "zirbelino.wishlist";

/**
 * Local wishlist for demo.
 * TODO(PRODUCTION): Persist against customer account via CustomerService.
 * See: /docs/DEMO_TO_PRODUCTION.md
 */
export class WishlistService {
  getIds(): string[] {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as string[];
    } catch {
      return [];
    }
  }

  setIds(ids: string[]): string[] {
    const unique = Array.from(new Set(ids));
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
    }
    return unique;
  }

  toggle(productId: string): string[] {
    const ids = this.getIds();
    if (ids.includes(productId)) {
      return this.setIds(ids.filter((id) => id !== productId));
    }
    return this.setIds([...ids, productId]);
  }

  has(productId: string): boolean {
    return this.getIds().includes(productId);
  }
}

export const wishlistService = new WishlistService();
