// src/pages/OrderHistory.tsx
import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

type OrderItem = {
  id: string;
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
  // Track image error per item
  const [imageErrorIds, setImageErrorIds] = useState<Record<string, boolean>>(
    {}
  );

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
        const items: OrderItem[] = (data.items || []).map(
          (item: Partial<OrderItem>) => ({
            ...item,
            id: String(item.id),
          })
        );
        fetchedOrders.push({
          id: docSnap.id,
          createdAt: data.createdAt,
          totalPrice: data.totalPrice,
          items,
        });
      });
      setOrders(fetchedOrders);
      setLoading(false);
      setImageErrorIds({});
    };
    fetchOrders();
  }, [user]);

  const handleImgError = (id: string) => {
    setImageErrorIds((prev) => ({ ...prev, [id]: true }));
  };

  if (!user)
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "70vh" }}
      >
        <Row className="w-100 justify-content-center">
          <Col md={8} lg={6} className="text-center">
            <p>Please login to view your order history.</p>
          </Col>
        </Row>
      </Container>
    );

  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={6} className="d-flex flex-column align-items-center">
          <h2 className="mb-4 text-center">Order History</h2>
          {loading ? (
            <div className="text-center">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center">No previous orders found.</div>
          ) : (
            <ul className="list-unstyled w-100 d-flex flex-column align-items-center">
              {orders.map((order) => (
                <Card
                  key={order.id}
                  className="mb-4 w-100"
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                  }}
                >
                  <Card.Body className="d-flex flex-column align-items-center">
                    <div className="mb-2 text-center w-100">
                      <div>
                        <strong>Order ID:</strong> {order.id}
                      </div>
                      <div>
                        <strong>Date:</strong>{" "}
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                      <div>
                        <strong>Total Price:</strong> $
                        {order.totalPrice.toFixed(2)}
                      </div>
                    </div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="mt-1"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </ul>
          )}

          {/* Show order details */}
          {selectedOrder && (
            <Card className="mt-4 w-100">
              <Card.Body className="d-flex flex-column align-items-center">
                <h4 className="mb-3 text-center">Order Details</h4>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="mb-2"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </Button>
                <div className="mb-2 text-center w-100">
                  <div>
                    <strong>Order ID:</strong> {selectedOrder.id}
                  </div>
                  <div>
                    <strong>Date:</strong>{" "}
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <strong>Total Price:</strong> $
                    {selectedOrder.totalPrice.toFixed(2)}
                  </div>
                </div>
                <h5 className="text-center">Products:</h5>
                <ul className="list-unstyled w-100 d-flex flex-column align-items-center">
                  {selectedOrder.items.map((item) => (
                    <Card
                      key={item.id}
                      className="mb-3 w-100"
                      style={{
                        border: "1px solid #e3e3e3",
                        borderRadius: "12px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                      }}
                    >
                      <Card.Body className="d-flex flex-column align-items-center w-100">
                        <div
                          style={{
                            width: 70,
                            height: 70,
                            borderRadius: "8px",
                            border: "1px solid #eee",
                            marginBottom: "0.5rem",
                            background: "#fafafa",
                            overflow: "hidden",
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {!imageErrorIds[item.id] && item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                display: "block",
                              }}
                              onError={() => handleImgError(item.id)}
                            />
                          ) : (
                            <span
                              style={{
                                color: "#888",
                                fontSize: "0.92rem",
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                background: "#fafafa",
                                textAlign: "center",
                              }}
                            >
                              {item.title}
                            </span>
                          )}
                        </div>
                        <div className="text-center">
                          <strong>{item.title}</strong> ({item.category})
                          <br />${item.price} × {item.count} = $
                          {(item.price * item.count).toFixed(2)}
                          <br />
                          <em>{item.description}</em>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default OrderHistory;
