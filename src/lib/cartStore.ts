/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  userId?: string;
}

// interface CartState {
//   items: CartItem[];
//   isDrawerOpen: boolean;
//   openDrawer: () => void;
//   closeDrawer: () => void;
//   addItem: (item: Omit<CartItem, 'quantity'>, userId?: string) => void;
//   removeItem: (id: number, userId?: string) => void;
//   clearCart: () => void;
// }

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  setItems: (items: CartItem[]) => void;
  addItem: (item: any, userId?: string) => void;
  removeItem: (id: number, userId?: string) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  isDrawerOpen: false,
  setItems: (items) => set({ items }),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  addItem: (item, userId) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        items: [...state.items, { ...item, quantity: 1, userId }],
        isDrawerOpen: true,
      };
    }),

  removeItem: (id) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === id);
      if (existing && existing.quantity > 1) {
        return {
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity - 1 } : i
          ),
        };
      }
      return { items: state.items.filter((i) => i.id !== id) };
    }),
  clearCart: () => set({ items: [] }),
  // Total Price ক্যালকুলেশন
  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));

// export const useCart = create<CartState>((set, get) => ({
//   items: [],
//   isDrawerOpen: false,
//   setItems: (items) => set({ items }),
//   openDrawer: () => set({ isDrawerOpen: true }),
//   closeDrawer: () => set({ isDrawerOpen: false }),
//   addItem: (item, userId) => set((state) => {
//     const existing = state.items.find(i => i.id === item.id);
//     if (existing) {
//       return { items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) };
//     }
//     return { items: [...state.items, { ...item, quantity: 1, userId }], isDrawerOpen: true };
//   }),
//   removeItem: (id, userId) => set((state) => ({
//     items: state.items.filter(i => i.id !== id)
//   })),
//   clearCart: () => set({ items: [] }),
// }));

// export const useCart = create<CartState>()(
//   persist(
//     (set, get) => ({
//       items: [],
//       isDrawerOpen: false,
//       openDrawer: () => set({ isDrawerOpen: true }),
//       closeDrawer: () => set({ isDrawerOpen: false }),
//       addItem: (item, userId) => {
//         const currentItems = get().items;
//         const existingItem = currentItems.find(
//           (i) => i.id === item.id && i.userId === userId
//         );

//         if (existingItem) {
//           set({
//             items: currentItems.map((i) =>
//               i.id === item.id && i.userId === userId
//                 ? { ...i, quantity: i.quantity + 1 }
//                 : i
//             ),
//           });
//         } else {
//           set({ items: [...currentItems, { ...item, quantity: 1, userId }] });
//         }
//         set({ isDrawerOpen: true });
//       },
//       removeItem: (id, userId) =>
//         set({
//           items: get().items.filter((i) => !(i.id === id && i.userId === userId)),
//         }),
//       clearCart: () => set({ items: [] }),
//     }),
//     { name: 'e-baz-cart-storage' }
//   )
// );
