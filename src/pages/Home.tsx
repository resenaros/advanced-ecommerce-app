// src/pages/Home.tsx
import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home: React.FC = () => (
  <Container
    className="d-flex flex-column align-items-center justify-content-center"
    style={{ minHeight: "60vh" }}
  >
    <h1 className="my-4 text-center">Welcome to MyShop!</h1>
    <p className="text-center" style={{ fontSize: "1.2rem" }}>
      Discover great products, manage your cart, and review your orders.
      <br />
      Register or login to start shopping!
    </p>
    <div className="mt-4">
      <Link to="/products">
        <Button variant="primary" size="lg">
          Browse Products
        </Button>
      </Link>
    </div>
  </Container>
);

export default Home;
