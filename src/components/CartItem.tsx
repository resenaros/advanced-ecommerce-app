// src/components/CartItem.tsx
import React, { useState } from "react";

export interface CartItemType {
  id: string;
  title: string;
  price: number;
  count: number;
  image?: string;
}

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onCountUpdate: (id: string, count: number) => void;
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
    <tr>
      <td className="align-middle text-center" style={{ minWidth: 100 }}>
        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            style={{
              maxWidth: "80px",
              maxHeight: "80px",
              objectFit: "contain",
              display: "block",
              margin: "1rem auto",
            }}
          />
        )}
      </td>
      <td className="align-middle" style={{ minWidth: 220 }}>
        <strong>{item.title}</strong>
      </td>
      <td className="align-middle text-center" style={{ minWidth: 120 }}>
        <input
          type="number"
          min={1}
          value={localCount}
          onChange={handleCountChange}
          style={{ width: 60 }}
          className="mx-1"
        />
      </td>
      <td className="align-middle text-center" style={{ minWidth: 100 }}>
        ${item.price.toFixed(2)}
      </td>
      <td className="align-middle text-center" style={{ minWidth: 100 }}>
        ${(item.price * localCount).toFixed(2)}
      </td>
      <td className="align-middle text-center" style={{ minWidth: 100 }}>
        <button
          className="m-2"
          onClick={() => onRemove(item.id)}
          style={{
            padding: "0.25rem 0.75rem",
            borderRadius: "4px",
            background: "#e74c3c",
            color: "#fff",
            border: "none",
            minWidth: "80px",
          }}
        >
          Remove
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
