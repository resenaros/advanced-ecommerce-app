import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import {
  removeFromCart,
  clearCart,
  updateCartItemCount,
} from "../features/cart/cartSlice";
import CartItem from "../components/CartItem";
import { Container, Row, Col } from "react-bootstrap";

const Cart: React.FC = () => {
    // Get cart items from Redux store
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  //   Message to show user feedback
  const [message, setMessage] = useState<string>("");

  //   Total price and item count
  const total = items.reduce((sum, item) => sum + item.price * item.count, 0);
  const totalItems = items.reduce((sum, item) => sum + item.count, 0);

  // Handle checkout process
  const handleCheckout = () => {
    dispatch(clearCart());
    setMessage("Checkout successful! Your cart has been cleared.");
    setTimeout(() => setMessage(""), 1500);
  };

//   Removes an item from the cart
  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
    setMessage("Items removed from cart.");
    setTimeout(() => setMessage(""), 1500);
  };

  // Updates the quantity of an item in the cart
  const handleCountUpdate = (id: number, count: number) => {
    dispatch(updateCartItemCount({ id, count }));
    setTimeout(() => setMessage(""), 1200);
  };

  // Renders the cart items
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} className="mx-auto">
          <h2 className="mb-4 text-center">Shopping Cart</h2>
          {message && (
            <div style={{ color: "green", marginBottom: "1rem" }}>
              {message}
            </div>
          )}
          {items.length === 0 ? (
            <p className="text-center">Your cart is empty.</p>
          ) : (
            <ul className="list-unstyled w-100">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                  onCountUpdate={handleCountUpdate}
                />
              ))}
            </ul>
          )}
          <div className="text-center mt-4">
            <p>Total Items: {totalItems}</p>
            <p>Total Price: ${total.toFixed(2)}</p>
            <button
              className="btn btn-primary"
              onClick={handleCheckout}
              disabled={items.length === 0}
            >
              Checkout
            </button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
