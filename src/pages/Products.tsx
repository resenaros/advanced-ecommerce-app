// src/pages/Products.tsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import ProductCard from "../components/ProductCard";
import { Container, Row, Col, Pagination, Spinner } from "react-bootstrap";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

// Max number of items to show per page. Grid is responsive based on screen size
const ITEMS_PER_PAGE = 6;

export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

const Products: React.FC = () => {
  const [category, setCategory] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        let q;
        if (category) {
          q = query(
            collection(db, "products"),
            where("category", "==", category)
          );
        } else {
          q = collection(db, "products");
        }
        const querySnapshot = await getDocs(q);
        const productArray: Product[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          productArray.push({
            id: docSnap.id,
            title: data.title,
            price:
              typeof data.price === "number" ? data.price : Number(data.price),
            category: data.category,
            description: data.description,
            image: data.image,
          });
        });
        setProducts(productArray);
      } catch (err: unknown) {
        setIsError(true);
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
      }
      setIsLoading(false);
    };

    fetchProducts();
    setPage(1); // reset to page 1 when category changes
  }, [category]);

  // Calculate total pages based on filtered products
  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));

  // Whenever the products or category change, make sure page is within bounds
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [products, totalPages, page]);

  // Pagination logic
  const paginatedProducts = products.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleAdd = (product: Product, quantity: number) => {
    const { id, title, price, category, description, image } = product;
    dispatch(
      addToCart({
        id,
        title,
        price,
        category,
        description,
        image,
        count: quantity,
      })
    );
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fetch available categories based on Firestore products
  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      const q = collection(db, "products");
      const querySnapshot = await getDocs(q);
      const catSet = new Set<string>();
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.category) catSet.add(data.category);
      });
      setCategories(Array.from(catSet));
    };
    fetchCategories();
  }, []);

  // Category select dropdown
  const renderCategorySelect = () => (
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      style={{ minWidth: 150, marginBottom: 16 }}
    >
      <option value="">All</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );

  // Pagination JSX, reused for top and bottom
  const renderPagination = () => (
    <div className="my-3 d-flex justify-content-center align-items-center w-100">
      <Pagination>
        <Pagination.Prev
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        />
        {[...Array(totalPages)].map((_, idx) => (
          <Pagination.Item
            key={idx + 1}
            active={page === idx + 1}
            onClick={() => handlePageChange(idx + 1)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        />
      </Pagination>
    </div>
  );

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center">
      <h2 className="my-4 text-center">Product Catalog</h2>
      <div className="mb-4">{renderCategorySelect()}</div>

      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" /> Loading...
        </div>
      ) : isError ? (
        <p className="text-center">Error loading products: {error}</p>
      ) : products.length === 0 ? (
        <p className="text-center">No products found.</p>
      ) : (
        <>
          {/* Pagination at the top */}
          {renderPagination()}
          <Row className="justify-content-center w-100">
            {paginatedProducts.map((product) => (
              <Col
                key={product.id}
                xs={12}
                sm={12}
                md={6}
                lg={4}
                className="mb-4 d-flex justify-content-center"
              >
                <ProductCard product={product} onAdd={handleAdd} />
              </Col>
            ))}
          </Row>
          {/* Pagination at the bottom */}
          {renderPagination()}
        </>
      )}
    </Container>
  );
};

export default Products;
