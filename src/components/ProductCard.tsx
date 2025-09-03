import React, { useState } from "react";
import type { Product } from "../api/products";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  const [imgSrc, setImgSrc] = useState(product.image);

  return (
    <div>
      <img
        src={imgSrc}
        alt={product.title}
        onError={() => setImgSrc("https://via.placeholder.com/150")}
        width={150}
        height={150}
      />
      <h3>{product.title}</h3>
      <p>Category: {product.category}</p>
      <p>${product.price}</p>
      <p>{product.description}</p>
      <p>Rating: {product.rating?.rate ?? "N/A"}</p>
      <button onClick={() => onAdd(product)}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
