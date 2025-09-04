import React, { useState } from "react";

export interface CartItemType {
  id: number;
  title: string;
  price: number;
  count: number;
}

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: number) => void;
  onCountUpdate: (id: number, count: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onRemove,
  onCountUpdate,
}) => {
  const [localCount, setLocalCount] = useState(item.count);

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Number(e.target.value));
    setLocalCount(value);
    onCountUpdate(item.id, value);
  };

  return (
    <li style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
      <div style={{ flex: 1 }}>
        <strong>{item.title}</strong>
        <div>
          Quantity:&nbsp;
          <input
            type="number"
            min={1}
            value={localCount}
            onChange={handleCountChange}
            style={{ width: 50 }}
          />
          &nbsp;|&nbsp;Price: <span>${item.price.toFixed(2)}</span>
          &nbsp;|&nbsp;Subtotal:{" "}
          <span>${(item.price * localCount).toFixed(2)}</span>
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
};

export default CartItem;
