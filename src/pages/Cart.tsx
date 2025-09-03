import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { removeFromCart, clearCart } from "../features/cart/cartSlice";
import CartItem from "../components/CartItem"; 

const Cart: React.FC = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const total = items.reduce((sum, item) => sum + item.price * item.count, 0);
  const totalItems = items.reduce((sum, item) => sum + item.count, 0);

  const handleCheckout = () => {
    dispatch(clearCart());
    alert("Checkout successful! Your cart has been cleared.");
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={(id) => dispatch(removeFromCart(id))}
            />
          ))}
        </ul>
      )}
      <p>Total Items: {totalItems}</p>
      <p>Total Price: ${total.toFixed(2)}</p>
      <button onClick={handleCheckout} disabled={items.length === 0}>
        Checkout
      </button>
    </div>
  );
};

export default Cart;
