// src/features/cart/cartSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Defines all logic related to the cart
// Define structure for cart items
export interface CartItem {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  count: number;
}

// Array of Cart Items Objects
interface CartState {
  items: CartItem[];
}

// SessionStorage is integrated when redux store is initialized
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
        // Update session storage whenever item is added 
      sessionStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      // Update session storage whenever item is removed
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
      // Update session storage whenever item count is updated
      sessionStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart(state) {
      state.items = [];
        // Clear session storage when cart is cleared
      sessionStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateCartFromSession(state) {
        // Sync cart state with session storage
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
