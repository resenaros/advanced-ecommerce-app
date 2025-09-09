// src/pages/Cart.tsx
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
import { db } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const Cart: React.FC = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const [message, setMessage] = useState<string>("");
  const { user } = useAuth();

  const total = items.reduce((sum, item) => sum + item.price * item.count, 0);
  const totalItems = items.reduce((sum, item) => sum + item.count, 0);

  // Handle checkout process and save order to Firestore
  const handleCheckout = async () => {
    if (!user) {
      setMessage("You must be logged in to place an order.");
      setTimeout(() => setMessage(""), 1500);
      return;
    }
    const order = {
      userId: user.uid,
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        count: item.count,
        image: item.image,
        category: item.category,
        description: item.description,
      })),
      totalPrice: total,
      createdAt: new Date().toISOString(),
    };
    try {
      await addDoc(collection(db, "orders"), order);
      dispatch(clearCart());
      setMessage("Checkout successful! Your order has been placed.");
      setTimeout(() => setMessage(""), 1500);
    } catch (error) {
      console.log("Order placement error:", error);
      setMessage("Error placing order. Please try again.");
      setTimeout(() => setMessage(""), 1500);
    }
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
    setMessage("Items removed from cart.");
    setTimeout(() => setMessage(""), 1500);
  };

  const handleCountUpdate = (id: string, count: number) => {
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
            <table className="table table-bordered w-100">
              <thead>
                <tr>
                  <th style={{ minWidth: 100 }}>Image</th>
                  <th style={{ minWidth: 220 }}>Title</th>
                  <th style={{ minWidth: 120 }}>Quantity</th>
                  <th style={{ minWidth: 100 }}>Price</th>
                  <th style={{ minWidth: 100 }}>Subtotal</th>
                  <th style={{ minWidth: 100 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={handleRemove}
                    onCountUpdate={handleCountUpdate}
                  />
                ))}
              </tbody>
            </table>
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
