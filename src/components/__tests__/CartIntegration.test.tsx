// src/components/__tests__/CartIntegration.test.tsx
import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../store";
import Products from "../../pages/Products";
import Cart from "../../pages/Cart";

// Mock Firestore and ProductCard for isolation and speed
jest.mock("../../firebaseConfig", () => ({
  db: {},
}));
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn().mockResolvedValue({
    forEach: (cb: any) =>
      [
        {
          id: "prod1",
          data: () => ({
            id: "prod1",
            title: "Test Product",
            price: 10,
            category: "TestCat",
            description: "Test Desc",
            image: "",
          }),
        },
      ].forEach(cb),
  }),
  query: jest.fn(),
  where: jest.fn(),
}));

jest.mock("../../components/ProductCard", () => {
  return function DummyProductCard(props: any) {
    return (
      <div>
        <span>{props.product.title}</span>
        <button onClick={() => props.onAdd(props.product, 1)}>
          Add to Cart
        </button>
      </div>
    );
  };
});

describe("Cart integration", () => {
  it("updates cart when product is added", async () => {
    render(
      <Provider store={store}>
        <Products />
        <Cart />
      </Provider>
    );

    // Wait for product card
    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });

    // Click Add to Cart (use button role and label)
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));

    // Wait for cart table to update
    await waitFor(() => {
      expect(screen.getByText(/Shopping Cart/i)).toBeInTheDocument();
      // There should be at least one strong Test Product in cart table
      const cartProductCells = screen.getAllByText(/Test Product/i);
      // Should be present in cart and product list
      expect(cartProductCells.length).toBeGreaterThan(1);
      expect(screen.getByText(/Total Items: 1/)).toBeInTheDocument();
      expect(screen.getByText(/Total Price: \$10.00/)).toBeInTheDocument();
    });
  });
});
