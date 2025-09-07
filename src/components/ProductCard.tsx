// src/components/ProductCard.tsx
import React, { useState } from "react";
import type { Product } from "../api/products";
import { Card, Button, Form, Alert } from "react-bootstrap";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/100?text=No+Image";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [success, setSuccess] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState(product.image || PLACEHOLDER_IMAGE);
  const [imgError, setImgError] = useState(false);

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
          {/* IMAGE OR ALT TEXT */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "120px",
              width: "100%",
              overflow: "hidden",
              position: "relative",
              marginBottom: "10px",
              background: "#fafafa",
              borderRadius: "6px",
            }}
          >
            {!imgError ? (
              <img
                src={imgSrc}
                alt={product.title}
                style={{
                  maxWidth: 100,
                  maxHeight: "100%",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto",
                }}
                onError={() => {
                  setImgSrc(PLACEHOLDER_IMAGE);
                  setImgError(true);
                }}
              />
            ) : (
              <div
                style={{
                  width: 100,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  overflow: "hidden",
                  padding: "0 6px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "#888",
                    wordBreak: "break-word",
                    lineHeight: "1.12",
                    maxHeight: "120px",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                  }}
                  title={product.title}
                >
                  {product.title}
                </span>
              </div>
            )}
          </div>
          {/* CARD CONTENT */}
          <div style={{ width: "100%" }}>
            <Card.Title
              className="mb-2 text-center"
              style={{ fontSize: "1.12rem", fontWeight: 600 }}
            >
              {product.title}
            </Card.Title>
            <Card.Subtitle
              className="mb-2 text-muted text-center"
              style={{ fontSize: "0.95rem" }}
            >
              Category: {product.category}
            </Card.Subtitle>
            <Card.Text
              className="mb-1 text-center"
              style={{ fontSize: "1.05rem", fontWeight: 500 }}
            >
              ${product.price}
            </Card.Text>
            <Card.Text
              className="mb-1 text-center"
              style={{ minHeight: 42, fontSize: "0.92rem" }}
            >
              {product.description}
            </Card.Text>
            <Card.Text
              className="mb-3 text-center"
              style={{ fontSize: "0.95rem" }}
            >
              Rating: {product.rating?.rate}
            </Card.Text>
          </div>
        </div>
        {/* ADD TO CART FORM */}
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
            <Form.Label
              htmlFor={`qty-${product.id}`}
              className="mb-0"
              style={{ fontSize: "0.98rem" }}
            >
              Qty:
            </Form.Label>
            <Form.Control
              id={`qty-${product.id}`}
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{
                width: 60,
                display: "inline-block",
                fontSize: "0.98rem",
              }}
            />
            <Button
              variant="primary"
              type="submit"
              style={{ fontSize: "1rem", padding: "6px 18px" }}
            >
              Add to Cart
            </Button>
          </div>
        </Form>
        {success && (
          <Alert
            variant="success"
            className="mt-2 mb-0 py-1 w-100 text-center"
            style={{ fontSize: "0.98rem" }}
          >
            Added to cart!
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
