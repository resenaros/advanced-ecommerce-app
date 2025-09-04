import React, { useState } from "react";
import type { Product } from "../api/products";
import { Card, Button, Form, Alert } from "react-bootstrap";

// Fallback image for missing or broken image URLs
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/100?text=No+Image";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [success, setSuccess] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState(product.image || PLACEHOLDER_IMAGE);

  const handleAddClick = () => {
    onAdd(product, quantity);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1500);
  };

  return (
    <Card
      style={{
        width: "100%",
        maxWidth: 330,
        minHeight: 420,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Card.Body className="d-flex flex-column justify-content-between h-100 p-3">
        <div
          style={{
            display: "grid",
            gridTemplateRows: "120px 1fr",
            gridTemplateColumns: "1fr",
            alignItems: "center",
            justifyItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "120px",
            }}
          >
            <img
              src={imgSrc}
              alt={product.title}
              style={{ maxWidth: 100, maxHeight: "100%", objectFit: "contain" }}
              onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
            />
          </div>
          <div style={{ width: "100%" }}>
            <Card.Title className="mb-1 text-center">
              {product.title}
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted text-center">
              Category: {product.category}
            </Card.Subtitle>
            <Card.Text className="mb-1 text-center">${product.price}</Card.Text>
            <Card.Text className="mb-1 text-center" style={{ minHeight: 42 }}>
              {product.description}
            </Card.Text>
            <Card.Text className="mb-3 text-center">
              Rating: {product.rating?.rate}
            </Card.Text>
          </div>
        </div>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddClick();
          }}
          className="w-100"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "8px",
            }}
          >
            <Form.Label htmlFor={`qty-${product.id}`} className="mb-0">
              Qty:
            </Form.Label>
            <Form.Control
              id={`qty-${product.id}`}
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ width: 60, display: "inline-block" }}
            />
            <Button variant="primary" type="submit">
              Add to Cart
            </Button>
          </div>
        </Form>
        {success && (
          <Alert variant="success" className="mt-2 mb-0 py-1 w-100 text-center">
            Added to cart!
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
