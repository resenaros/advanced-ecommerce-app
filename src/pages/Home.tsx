import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { useProducts } from "../api/products";
import type { Product } from "../api/products";
import ProductCard from "../components/ProductCard";
import CategorySelect from "../components/CategorySelect";

const Home: React.FC = () => {
  const [category, setCategory] = useState<string>("");
  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useProducts(category);
  const dispatch = useDispatch();

  const handleAdd = (product: Product) => {
    const { id, title, price, category, description, image } = product;
    dispatch(addToCart({ id, title, price, category, description, image }));
  };

  return (
    <div>
      <h2>Product Catalog</h2>
      <CategorySelect selected={category} onChange={setCategory} />
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error loading products: {String(error)}</p>
      ) : (
        <div>
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={handleAdd}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
