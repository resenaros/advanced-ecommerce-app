import React, { useState } from "react";
import type { Product } from "../api/products";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [success, setSuccess] = useState<boolean>(false);

  const handleAddClick = () => {
    onAdd(product, quantity);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1500); // Hide after 1.5s
  };

  return (
    <div style={{ border: "1px solid #ccc", margin: "1rem", padding: "1rem" }}>
      <h3>{product.title}</h3>
      <p>Category: {product.category}</p>
      <p>${product.price}</p>
      <p>{product.description}</p>
      <p>Rating: {product.rating?.rate}</p>
      <img src={product.image} alt={product.title} width={100} />
      <div>
        <label>
          Qty:{" "}
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            style={{ width: 60 }}
          />
        </label>
        <button onClick={handleAddClick}>Add to Cart</button>
      </div>
      {success && <div style={{ color: "green" }}>Added to cart!</div>}
    </div>
  );
};

export default ProductCard;
