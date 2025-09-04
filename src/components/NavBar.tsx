import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

const Navbar: React.FC = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const totalCount = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <nav>
      <Link to="/">Home</Link> |{" "}
      <Link to="/cart">Cart{totalCount > 0 && ` (${totalCount})`}</Link>
    </nav>
  );
};

export default Navbar;
