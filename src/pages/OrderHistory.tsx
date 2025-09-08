// src/pages/OrderHistory.tsx
import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Container, Row, Col, Button } from "react-bootstrap";

type OrderItem = {
  id: number;
  title: string;
  price: number;
  count: number;
  image: string;
  category: string;
  description: string;
};

type Order = {
  id: string;
  createdAt: string;
  totalPrice: number;
  items: OrderItem[];
};

const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoading(true);
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const fetchedOrders: Order[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetchedOrders.push({
          id: docSnap.id,
          createdAt: data.createdAt,
          totalPrice: data.totalPrice,
          items: data.items,
        });
      });
      setOrders(fetchedOrders);
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (!user) return <p>Please login to view your order history.</p>;

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="mb-4 text-center">Order History</h2>
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No previous orders found.</p>
          ) : (
            <ul className="list-unstyled">
              {orders.map((order) => (
                <li
                  key={order.id}
                  style={{
                    marginBottom: "2rem",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  <strong>Order ID:</strong> {order.id} <br />
                  <strong>Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()} <br />
                  <strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}{" "}
                  <br />
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </Button>
                </li>
              ))}
            </ul>
          )}
          {/* Show order details */}
          {selectedOrder && (
            <div className="mt-4 p-3 border rounded">
              <h4>Order Details</h4>
              <Button
                variant="outline-secondary"
                size="sm"
                className="mb-2"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </Button>
              <p>
                <strong>Order ID:</strong> {selectedOrder.id}
                <br />
                <strong>Date:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
                <br />
                <strong>Total Price:</strong> $
                {selectedOrder.totalPrice.toFixed(2)}
              </p>
              <h5>Products:</h5>
              <ul>
                {selectedOrder.items.map((item) => (
                  <li key={item.id}>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: 40, height: 40, marginRight: 8 }}
                    />
                    <strong>{item.title}</strong> ({item.category})<br />$
                    {item.price} × {item.count} = $
                    {(item.price * item.count).toFixed(2)}
                    <br />
                    <em>{item.description}</em>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default OrderHistory;
