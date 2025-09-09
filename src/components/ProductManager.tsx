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

  return (
    <div>
      <h2>Product Manager</h2>
      {/* Product Form */}
      <form onSubmit={editId ? handleUpdate : handleCreate}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          required
        />
        <button type="submit">{editId ? "Update" : "Add"} Product</button>
        {editId && (
          <button type="button" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>

      {/* Product List */}
      <h3>All Products</h3>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <ul>
          {products.map((prod) => (
            <li key={prod.id}>
              <img
                src={prod.image}
                alt={prod.title}
                style={{ width: 80, height: 80 }}
              />
              <strong>{prod.title}</strong> (${prod.price})<br />
              <em>{prod.category}</em>
              <br />
              <em>{prod.description}</em>
              <br />
              <button onClick={() => startEdit(prod)}>Edit</button>
              <button onClick={() => handleDelete(prod.id!)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductManager;
