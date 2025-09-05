import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cartSlice";

// MARK: Configure Store
// Create a Redux store with the cart reducer
const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
