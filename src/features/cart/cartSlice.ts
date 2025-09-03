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
    addToCart(state, action: PayloadAction<Omit<CartItem, "count">>) {
      const product = action.payload;
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        existing.count += 1;
      } else {
        state.items.push({ ...product, count: 1 });
      }
      sessionStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
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

export const { addToCart, removeFromCart, clearCart, updateCartFromSession } =
  cartSlice.actions;
export default cartSlice.reducer;
