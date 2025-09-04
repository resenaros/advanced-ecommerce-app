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
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const [message, setMessage] = useState<string>("");

  const total = items.reduce((sum, item) => sum + item.price * item.count, 0);
  const totalItems = items.reduce((sum, item) => sum + item.count, 0);

  const handleCheckout = () => {
    dispatch(clearCart());
    setMessage("Checkout successful! Your cart has been cleared.");
    setTimeout(() => setMessage(""), 1500);
  };

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
    setMessage("Items removed from cart.");
    setTimeout(() => setMessage(""), 1500);
  };

  const handleCountUpdate = (id: number, count: number) => {
    dispatch(updateCartItemCount({ id, count }));
    setTimeout(() => setMessage(""), 1200);
  };

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
