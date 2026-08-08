import type { Cart, CartItem } from "@/domain";

const STORAGE_KEY = "zirbelino.cart";

function emptyCart(): Cart {
  return { items: [], updatedAt: new Date().toISOString() };
}

/**
 * Client-side cart for demo.
 * TODO(PRODUCTION): Replace with CommerceCartService backed by session/API.
 * See: /docs/DEMO_TO_PRODUCTION.md
 */
export class CartService {
  getCart(): Cart {
    if (typeof window === "undefined") return emptyCart();
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyCart();
    try {
      return JSON.parse(raw) as Cart;
    } catch {
      return emptyCart();
    }
  }

  setCart(cart: Cart): Cart {
    const next = { ...cart, updatedAt: new Date().toISOString() };
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
    return next;
  }

  addItem(item: Omit<CartItem, "key"> & { key?: string }): Cart {
    const cart = this.getCart();
    const key =
      item.key ??
      [item.productId, item.variantId ?? "default", JSON.stringify(item.personalization ?? {})].join(
        ":",
      );

    const existing = cart.items.find((entry) => entry.key === key);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cart.items.push({ ...item, key });
    }
    return this.setCart(cart);
  }

  updateQuantity(key: string, quantity: number): Cart {
    const cart = this.getCart();
    cart.items = cart.items
      .map((item) => (item.key === key ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);
    return this.setCart(cart);
  }

  removeItem(key: string): Cart {
    const cart = this.getCart();
    cart.items = cart.items.filter((item) => item.key !== key);
    return this.setCart(cart);
  }

  clear(): Cart {
    return this.setCart(emptyCart());
  }

  itemCount(cart = this.getCart()): number {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}

export const cartService = new CartService();
