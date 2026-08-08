"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Cart } from "@/domain";
import { cartService } from "@/services/CartService";
import { wishlistService } from "@/services/WishlistService";

type CommerceContextValue = {
  cart: Cart;
  wishlistIds: string[];
  cartCount: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (input: {
    productId: string;
    variantId?: string;
    quantity?: number;
    openCart?: boolean;
  }) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  toggleWishlist: (productId: string) => void;
  hasWishlist: (productId: string) => boolean;
};

const CommerceContext = createContext<CommerceContextValue | null>(null);

const EMPTY_CART: Cart = { items: [], updatedAt: "" };
const EMPTY_WISHLIST: string[] = [];

let cartSnapshot: Cart = EMPTY_CART;
let cartSnapshotRaw = "";
let wishlistSnapshot: string[] = EMPTY_WISHLIST;
let wishlistSnapshotRaw = "";

function subscribeCart(callback: () => void) {
  window.addEventListener("zirbelino-cart", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("zirbelino-cart", callback);
    window.removeEventListener("storage", callback);
  };
}

function subscribeWishlist(callback: () => void) {
  window.addEventListener("zirbelino-wishlist", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("zirbelino-wishlist", callback);
    window.removeEventListener("storage", callback);
  };
}

function getCartSnapshot(): Cart {
  const raw =
    typeof window === "undefined"
      ? ""
      : window.localStorage.getItem("zirbelino.cart") ?? "";
  if (raw === cartSnapshotRaw) return cartSnapshot;
  cartSnapshotRaw = raw;
  cartSnapshot = raw ? (JSON.parse(raw) as Cart) : EMPTY_CART;
  return cartSnapshot;
}

function getWishlistSnapshot(): string[] {
  const raw =
    typeof window === "undefined"
      ? ""
      : window.localStorage.getItem("zirbelino.wishlist") ?? "";
  if (raw === wishlistSnapshotRaw) return wishlistSnapshot;
  wishlistSnapshotRaw = raw;
  wishlistSnapshot = raw ? (JSON.parse(raw) as string[]) : EMPTY_WISHLIST;
  return wishlistSnapshot;
}

function getServerCartSnapshot() {
  return EMPTY_CART;
}

function getServerWishlistSnapshot() {
  return EMPTY_WISHLIST;
}

function emit(name: string) {
  window.dispatchEvent(new Event(name));
}

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const cart = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );
  const wishlistIds = useSyncExternalStore(
    subscribeWishlist,
    getWishlistSnapshot,
    getServerWishlistSnapshot,
  );

  const value = useMemo<CommerceContextValue>(
    () => ({
      cart,
      wishlistIds,
      cartCount: cartService.itemCount(cart),
      cartOpen,
      setCartOpen,
      addToCart: ({
        productId,
        variantId,
        quantity = 1,
        openCart = true,
      }) => {
        cartService.addItem({ productId, variantId, quantity });
        emit("zirbelino-cart");
        if (openCart) setCartOpen(true);
      },
      updateQuantity: (key, quantity) => {
        cartService.updateQuantity(key, quantity);
        emit("zirbelino-cart");
      },
      removeFromCart: (key) => {
        cartService.removeItem(key);
        emit("zirbelino-cart");
      },
      toggleWishlist: (productId) => {
        wishlistService.toggle(productId);
        emit("zirbelino-wishlist");
      },
      hasWishlist: (productId) => wishlistIds.includes(productId),
    }),
    [cart, wishlistIds, cartOpen],
  );

  return (
    <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>
  );
}

export function useCommerce() {
  const ctx = useContext(CommerceContext);
  if (!ctx) throw new Error("useCommerce must be used within CommerceProvider");
  return ctx;
}
