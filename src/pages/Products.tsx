// src/pages/Products.tsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { useProducts } from "../api/products";
import type { Product } from "../api/products";
import ProductCard from "../components/ProductCard";
import CategorySelect from "../components/CategorySelect";
import { Container, Row, Col, Pagination } from "react-bootstrap";

// Max number of items to show per page. Grid is responsive based on screen size
const ITEMS_PER_PAGE = 6;

const Products: React.FC = () => {
  const [category, setCategory] = useState<string>("");
  const [page, setPage] = useState(1);

  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useProducts(category);

  console.log("Products:", products);

  const dispatch = useDispatch();

  // Calculate total pages based on filtered products
  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));

  // Whenever the category or products change, make sure page is within bounds
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [category, products, totalPages, page]);

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
      <div className="mb-4">
        <CategorySelect selected={category} onChange={setCategory} />
      </div>

      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : isError ? (
        <p className="text-center">Error loading products: {String(error)}</p>
      ) : (
        <>
          {products.length === 0 ? (
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
        </>
      )}
    </Container>
  );
};

export default Products;
