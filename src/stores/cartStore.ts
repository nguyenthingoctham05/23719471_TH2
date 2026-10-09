import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STUDENT, PRICE_MULTIPLIER } from '@constants/student';

export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  shippingFee: number | null;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  changeQty: (id: string, quantity: number) => void;
  clear: () => void;
  totalQuantity: () => number;
  totalAmount: () => number;
  setShippingFee: (fee: number | null) => void;
  // Aliases for compatibility
  add: (product: Product) => void;
  remove: (id: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => {
      const addItem = (product: Product) => {
        set((state) => {
          const exists = state.items.some(
            item => item.product.id === product.id,
          );

          return {
            items: exists
              ? state.items.map(item =>
                  item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item,
                )
              : [...state.items, { product, quantity: 1 }],
          };
        });
      };

      const removeItem = (id: string) => {
        set((state) => ({
          items: state.items.filter(item => item.product.id !== id),
        }));
      };

      return {
        items: [],
        shippingFee: null,

        addItem,
        removeItem,
        add: addItem,
        remove: removeItem,

        changeQty: (id, quantity) => {
          if (!Number.isFinite(quantity)) return;

          set((state) => ({
            items: state.items.map(item =>
              item.product.id === id
                ? { ...item, quantity: Math.max(1, Math.floor(quantity)) }
                : item,
            ),
          }));
        },

        clear: () => set({ items: [] }),

        totalQuantity: () =>
          get().items.reduce((sum, item) => sum + item.quantity, 0),

        totalAmount: () =>
          get().items.reduce(
            (sum, item) =>
              sum +
              Math.round(item.product.price * PRICE_MULTIPLIER) *
                item.quantity,
            0,
          ),

        setShippingFee: (fee) => set({ shippingFee: fee }),
      };
    },
    {
      name: `ktxgo-cart-${STUDENT.mssv}`,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
