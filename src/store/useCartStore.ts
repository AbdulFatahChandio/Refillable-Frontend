import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TranslationsType } from "../ts-types/generated";

export interface CartItem {
  id: number;
  translations: TranslationsType[];
  price: number;
  quantity: number;
  images?: string[];
  selectedVariants?: any;
  availableQty?: number | null;
}

interface CartState {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;

  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, selectedVariants?: any) => void;
  clearCart: () => void;
  updateQuantity: (id: number, quantity: number, selectedVariants?: any) => void;
  decreaseQuantity: (id: number, selectedVariants?: any) => void;
  syncPrices: (priceByProductId: Record<number, number>) => void;
}

const sortVariants = (variants: any[] = []) =>
  [...variants].sort((a, b) => a.variantId - b.variantId);

const variantsMatch = (a: any[] = [], b: any[] = []) =>
  JSON.stringify(sortVariants(a)) === JSON.stringify(sortVariants(b));

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      totalItems: 0,
      totalPrice: 0,

      addToCart: (item) => {
        const existing = get().cart.find(
          (p) =>
            p.id === item.id &&
            variantsMatch(p.selectedVariants || [], item.selectedVariants || []),
        );

        const safeRequestedQty = Math.max(1, item.quantity || 1);
        const safeAvailableQty =
          typeof item.availableQty === "number"
            ? Math.max(0, item.availableQty)
            : null;

        let newCart: CartItem[];

        if (existing) {
          newCart = get().cart.map((p) => {
            const isSameItem =
              p.id === item.id &&
              variantsMatch(p.selectedVariants || [], item.selectedVariants || []);

            if (!isSameItem) return p;

            const nextQty =
              safeAvailableQty === null
                ? p.quantity + safeRequestedQty
                : Math.min(p.quantity + safeRequestedQty, safeAvailableQty);

            return {
              ...p,
              quantity: nextQty,
              availableQty: item.availableQty ?? p.availableQty,
            };
          });
        } else {
          const quantityToAdd =
            safeAvailableQty === null
              ? safeRequestedQty
              : Math.min(safeRequestedQty, safeAvailableQty);

          if (quantityToAdd <= 0) return;
          newCart = [...get().cart, { ...item, quantity: quantityToAdd }];
        }

        set({
          cart: newCart,
          totalItems: newCart.length,
          totalPrice: newCart.reduce((sum, p) => sum + p.price * p.quantity, 0),
        });
      },

      removeFromCart: (id, selectedVariants) => {
        const newCart = get().cart.filter(
          (p) =>
            !(
              p.id === id &&
              variantsMatch(p.selectedVariants || [], selectedVariants || [])
            ),
        );

        set({
          cart: newCart,
          totalItems: newCart.length,
          totalPrice: newCart.reduce((sum, p) => sum + p.price * p.quantity, 0),
        });
      },

      decreaseQuantity: (id, selectedVariants) => {
        const existing = get().cart.find(
          (p) =>
            p.id === id &&
            variantsMatch(p.selectedVariants || [], selectedVariants || []),
        );

        if (!existing) return;

        let newCart: CartItem[];

        if (existing.quantity > 1) {
          newCart = get().cart.map((p) =>
            p.id === id &&
            variantsMatch(p.selectedVariants || [], selectedVariants || [])
              ? { ...p, quantity: p.quantity - 1 }
              : p,
          );
        } else {
          newCart = get().cart.filter(
            (p) =>
              !(
                p.id === id &&
                variantsMatch(p.selectedVariants || [], selectedVariants || [])
              ),
          );
        }

        set({
          cart: newCart,
          totalItems: newCart.length,
          totalPrice: newCart.reduce((sum, p) => sum + p.price * p.quantity, 0),
        });
      },

      updateQuantity: (id, quantity, selectedVariants) => {
        const newCart = get().cart.map((p) => {
          const isSameItem =
            p.id === id &&
            variantsMatch(p.selectedVariants || [], selectedVariants || []);

          if (!isSameItem) return p;

          const boundedQuantity =
            typeof p.availableQty === "number"
              ? Math.min(Math.max(1, quantity), Math.max(1, p.availableQty))
              : Math.max(1, quantity);

          return { ...p, quantity: boundedQuantity };
        });

        set({
          cart: newCart,
          totalItems: newCart.length,
          totalPrice: newCart.reduce((sum, p) => sum + p.price * p.quantity, 0),
        });
      },

      clearCart: () =>
        set({
          cart: [],
          totalItems: 0,
          totalPrice: 0,
        }),

      syncPrices: (priceByProductId) => {
        const newCart = get().cart.map((item) => {
          const nextPrice = priceByProductId[item.id];
          if (typeof nextPrice !== "number" || Number.isNaN(nextPrice)) {
            return item;
          }
          return { ...item, price: nextPrice };
        });

        set({
          cart: newCart,
          totalItems: newCart.length,
          totalPrice: newCart.reduce(
            (sum, p) => sum + p.price * p.quantity,
            0,
          ),
        });
      },
    }),
    { name: "cart-storage" },
  ),
);
