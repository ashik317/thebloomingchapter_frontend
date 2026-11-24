"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api, errorMessage } from "@/lib/api";
import type { Cart, ItemType } from "@/lib/types";
import { useAuth } from "./AuthContext";

type CartState = {
  cart: Cart | null;
  count: number;
  add: (itemType: ItemType, productId: number, quantity?: number) => Promise<void>;
  update: (itemId: number, quantity: number) => Promise<void>;
  remove: (itemId: number) => Promise<void>;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return setCart(null);
    try {
      const { data } = await api.get<Cart>("/cart/");
      setCart(data);
    } catch {
      setCart(null);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = async (item_type: ItemType, product_id: number, quantity = 1) => {
    if (!user) {
      toast("Please log in to add items to your cart.");
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    try {
      const { data } = await api.post<Cart>("/cart/items/", { item_type, product_id, quantity });
      setCart(data);
      toast.success("Added to cart");
    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  const update = async (id: number, quantity: number) => {
    try {
      const { data } = await api.patch<Cart>(`/cart/items/${id}/`, { quantity });
      setCart(data);
    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  const remove = async (id: number) => {
    try {
      const { data } = await api.delete<Cart>(`/cart/items/${id}/`);
      setCart(data);
    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  return (
    <CartContext.Provider value={{ cart, count: cart?.item_count ?? 0, add, update, remove, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
