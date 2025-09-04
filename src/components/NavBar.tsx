import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { Container, Button, Badge, ButtonGroup } from "react-bootstrap";

const Navbar: React.FC = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const totalCount = items.reduce((sum, item) => sum + item.count, 0);

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
        </ButtonGroup>
      </nav>
    </Container>
  );
};

export default Navbar;
