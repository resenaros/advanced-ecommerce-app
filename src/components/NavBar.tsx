// src/components/NavBar.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import {
  Container,
  Button,
  Badge,
  Navbar,
  Nav,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const NavBar: React.FC = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const totalCount = items.reduce((sum, item) => sum + item.count, 0);
  const { user, logout } = useAuth();
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar
      bg="light"
      expand="md"
      expanded={expanded}
      className="mb-4"
      sticky="top"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          style={{ fontWeight: 700, fontSize: 22 }}
        >
          MyShop
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="main-navbar"
          onClick={() => setExpanded((prev) => !prev)}
        />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/products"
              onClick={() => setExpanded(false)}
            >
              Products
            </Nav.Link>
            <Nav.Link as={Link} to="/cart" onClick={() => setExpanded(false)}>
              Cart{" "}
              {totalCount > 0 && (
                <Badge bg="light" text="dark" className="ms-1">
                  {totalCount}
                </Badge>
              )}
            </Nav.Link>
            {user && (
              <>
                <Nav.Link
                  as={Link}
                  to="/profile"
                  onClick={() => setExpanded(false)}
                >
                  Profile
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/orders"
                  onClick={() => setExpanded(false)}
                >
                  Orders
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/product-manager"
                  onClick={() => setExpanded(false)}
                >
                  Product Manager
                </Nav.Link>
              </>
            )}
            {!user && (
              <>
                <Nav.Link
                  as={Link}
                  to="/register"
                  onClick={() => setExpanded(false)}
                >
                  Register
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/login"
                  onClick={() => setExpanded(false)}
                >
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
          {user && (
            <Nav className="align-items-center">
              <Navbar.Text className="me-3 fw-bold">{user.email}</Navbar.Text>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  logout();
                  setExpanded(false);
                }}
              >
                Logout
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
