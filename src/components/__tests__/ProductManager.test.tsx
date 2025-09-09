// src/pages/__tests__/ProductManager.test.tsx
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import ProductManager from "../ProductManager";

// Mock Firestore methods to avoid real DB calls in tests
jest.mock("../../firebaseConfig", () => ({
  db: {},
}));
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn().mockResolvedValue({ forEach: jest.fn() }),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}));

describe("ProductManager", () => {
  it("renders the Product Manager header", async () => {
    await act(async () => {
      render(<ProductManager />);
    });
    await waitFor(() => {
      expect(screen.getByText(/Product Manager/i)).toBeInTheDocument();
    });
  });

  it("updates form state when input changes", async () => {
    await act(async () => {
      render(<ProductManager />);
    });
    const titleInput = await screen.findByPlaceholderText("Title");
    fireEvent.change(titleInput, { target: { value: "New Product" } });
    expect(titleInput).toHaveValue("New Product");
  });
});
