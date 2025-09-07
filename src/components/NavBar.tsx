// src/components/NavBar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { Container, Button, Badge, ButtonGroup } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const totalCount = items.reduce((sum, item) => sum + item.count, 0);
  const { user, logout } = useAuth();

  return (
    <Container fluid className="py-3 mb-4 d-flex justify-content-center">
      <nav>
        <ButtonGroup>
          <Link to="/" className="me-2" style={{ textDecoration: "none" }}>
            <Button
              variant="outline-primary"
              style={{ fontWeight: 500, fontSize: "18px" }}
            >
              Home
            </Button>
          </Link>
          <Link to="/cart" style={{ textDecoration: "none" }}>
            <Button
              variant="primary"
              style={{ fontWeight: 500, fontSize: "18px" }}
            >
              Cart{" "}
              {totalCount > 0 && (
                <Badge bg="light" text="dark" className="ms-1">
                  {totalCount}
                </Badge>
              )}
            </Button>
          </Link>
          {/* Show these links only if user is logged in */}
          {user && (
            <>
              <Link to="/users" style={{ textDecoration: "none" }}>
                <Button
                  variant="outline-success"
                  style={{ fontWeight: 500, fontSize: "18px", marginLeft: 8 }}
                >
                  Users
                </Button>
              </Link>
              <Link to="/add-user" style={{ textDecoration: "none" }}>
                <Button
                  variant="outline-info"
                  style={{ fontWeight: 500, fontSize: "18px", marginLeft: 8 }}
                >
                  Add User
                </Button>
              </Link>
            </>
          )}
          {/* Show Register/Login if not logged in */}
          {!user && (
            <>
              <Link to="/register" style={{ textDecoration: "none" }}>
                <Button
                  variant="outline-secondary"
                  style={{ fontWeight: 500, fontSize: "18px", marginLeft: 8 }}
                >
                  Register
                </Button>
              </Link>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button
                  variant="outline-secondary"
                  style={{ fontWeight: 500, fontSize: "18px", marginLeft: 8 }}
                >
                  Login
                </Button>
              </Link>
            </>
          )}
        </ButtonGroup>
        {/* Show user email and logout button if logged in */}
        {user && (
          <span className="ms-3">
            <strong>{user.email}</strong>
            <Button
              variant="danger"
              size="sm"
              className="ms-3"
              onClick={logout}
            >
              Logout
            </Button>
          </span>
        )}
      </nav>
    </Container>
  );
};

export default Navbar;
