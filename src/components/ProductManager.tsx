// src/components/ProductManager.tsx
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Spinner,
} from "react-bootstrap";

// Product type for TypeScript
type Product = {
  id?: string; // Firestore doc id
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
};

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Track which products' images errored
  const [imageErrorIds, setImageErrorIds] = useState<Record<string, boolean>>(
    {}
  );

  // Form state for create/update
  const [form, setForm] = useState<Product>({
    title: "",
    price: 0,
    category: "",
    description: "",
    image: "",
  });
  const [editId, setEditId] = useState<string | null>(null);

  // Fetch products from Firestore
  const fetchProducts = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "products"));
    const productsData: Product[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      productsData.push({
        id: docSnap.id,
        title: data.title,
        price: data.price,
        category: data.category,
        description: data.description,
        image: data.image,
      });
    });
    setProducts(productsData);
    setLoading(false);
    setImageErrorIds({}); // reset error states when products reload
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Create new product
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "products"), form);
    setForm({ title: "", price: 0, category: "", description: "", image: "" });
    fetchProducts();
  };

  // Start editing a product
  const startEdit = (product: Product) => {
    setEditId(product.id!);
    setForm(product);
  };

  // Update product
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    const productRef = doc(db, "products", editId);
    await updateDoc(productRef, form);
    setEditId(null);
    setForm({ title: "", price: 0, category: "", description: "", image: "" });
    fetchProducts();
  };

  // Delete product
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditId(null);
    setForm({ title: "", price: 0, category: "", description: "", image: "" });
  };

  // When image fails, mark its product id as errored
  const handleImgError = (id: string) => {
    setImageErrorIds((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={6}>
          <Card className="mb-4 text-center">
            <Card.Body>
              <Card.Title>Product Manager</Card.Title>
              <Form onSubmit={editId ? handleUpdate : handleCreate}>
                <Form.Group className="mb-2">
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Control
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Control
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Control
                    as="textarea"
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={2}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Control
                    type="text"
                    name="image"
                    placeholder="Image URL"
                    value={form.image}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <div className="d-flex justify-content-center gap-2">
                  <Button type="submit" variant="primary">
                    {editId ? "Update" : "Add"} Product
                  </Button>
                  {editId && (
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center">All Products</Card.Title>
              {loading ? (
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                  <div>Loading products...</div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center">No products found.</div>
              ) : (
                <div>
                  {products.map((prod) => (
                    <Card
                      key={prod.id}
                      className="mb-3"
                      style={{
                        border: "1px solid #e3e3e3",
                        borderRadius: "12px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                      }}
                    >
                      <Card.Body className="d-flex flex-column align-items-center">
                        <div
                          style={{
                            width: 80,
                            height: 80,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "8px",
                            border: "1px solid #eee",
                            marginBottom: "0.5rem",
                            background: "#fafafa",
                            overflow: "hidden",
                            position: "relative",
                            textAlign: "center",
                          }}
                        >
                          {!imageErrorIds[prod.id!] && prod.image ? (
                            <img
                              src={prod.image}
                              alt={prod.title}
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                display: "block",
                              }}
                              onError={() => handleImgError(prod.id!)}
                            />
                          ) : (
                            <span
                              style={{
                                color: "#888",
                                fontSize: "0.92rem",
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                background: "#fafafa",
                              }}
                            >
                              {prod.title}
                            </span>
                          )}
                        </div>
                        <strong>{prod.title}</strong>
                        <div>(${prod.price})</div>
                        <div className="text-muted">{prod.category}</div>
                        <em>{prod.description}</em>
                        <div className="d-flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => startEdit(prod)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(prod.id!)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductManager;
