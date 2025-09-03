import React from "react";

export interface CartItemType {
  id: number;
  title: string;
  price: number;
  count: number;
}

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove }) => (
  <li style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
    <div style={{ flex: 1 }}>
      <strong>{item.title}</strong>
      <div>
        Quantity: <span>{item.count}</span>
        &nbsp;|&nbsp;Price: <span>${item.price.toFixed(2)}</span>
        &nbsp;|&nbsp;Subtotal:{" "}
        <span>${(item.price * item.count).toFixed(2)}</span>
      </div>
    </div>
    <button
      onClick={() => onRemove(item.id)}
      style={{
        marginLeft: "1rem",
        padding: "0.25rem 0.75rem",
        borderRadius: "4px",
        background: "#e74c3c",
        color: "#fff",
        border: "none",
      }}
    >
      Remove
    </button>
  </li>
);

export default CartItem;
