import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { Container } from "react-bootstrap";

const Navbar: React.FC = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const totalCount = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <Container fluid className="py-3 mb-4 d-flex justify-content-center">
      <nav>
        <Link
          to="/"
          style={{ marginRight: 20, fontWeight: 500, fontSize: "18px" }}
        >
          Home
        </Link>
        <Link to="/cart" style={{ fontWeight: 500, fontSize: "18px" }}>
          Cart{totalCount > 0 && ` (${totalCount})`}
        </Link>
      </nav>
    </Container>
  );
};

export default Navbar;
