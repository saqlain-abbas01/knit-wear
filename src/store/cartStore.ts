import { CartItem } from "@/lib/types";
import { create } from "zustand";

interface CartState {
  storeCarts: CartItem[];
  totalItems: number;
  subtotal: number;
  cartSeen: boolean;

  setStoreCarts: (items: CartItem[]) => void;
  setTotalItems: (count: number) => void;
  setSubtotal: (amount: number) => void;
  clearCart: () => void;
  markCartSeen: () => void;
  markCartUnseen: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  storeCarts: [],
  totalItems: 0,
  subtotal: 0,
  cartSeen: true,
  setStoreCarts: (items) => set({ storeCarts: items }),
  setTotalItems: (count) => set({ totalItems: count }),
  setSubtotal: (amount) => set({ subtotal: amount }),

  markCartSeen: () => set({ cartSeen: true }),
  markCartUnseen: () => set({ cartSeen: false }),
  clearCart: () =>
    set({
      storeCarts: [],
      totalItems: 0,
      subtotal: 0,
      cartSeen: true,
    }),
}));
