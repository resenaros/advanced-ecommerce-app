import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  count: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: JSON.parse(sessionStorage.getItem("cart") || "[]"),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(
      state,
      action: PayloadAction<Omit<CartItem, "count"> & { count?: number }>
    ) {
      const {
        id,
        title,
        price,
        category,
        description,
        image,
        count = 1,
      } = action.payload;
      const existing = state.items.find((item) => item.id === id);
      if (existing) {
        existing.count += count;
      } else {
        state.items.push({
          id,
          title,
          price,
          category,
          description,
          image,
          count,
        });
      }
      sessionStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      sessionStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateCartItemCount(
      state,
      action: PayloadAction<{ id: number; count: number }>
    ) {
      const { id, count } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item && count > 0) {
        item.count = count;
      }
      sessionStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart(state) {
      state.items = [];
      sessionStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateCartFromSession(state) {
      state.items = JSON.parse(sessionStorage.getItem("cart") || "[]");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartItemCount,
  clearCart,
  updateCartFromSession,
} = cartSlice.actions;
export default cartSlice.reducer;
