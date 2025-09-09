// src/pages/__tests__/Profile.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Profile from "../Profile";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((msg) => {
    if (typeof msg === "string" && msg.includes("not wrapped in act")) {
      return;
    }
    console.warn(msg);
  });
});
// Mocks for context and Firestore
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { uid: "testid", email: "test@example.com" },
    loading: false,
    logout: jest.fn(),
  }),
}));
jest.mock("../../firebaseConfig", () => ({
  db: {},
  auth: {},
}));
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn().mockResolvedValue({
    exists: () => true,
    data: () => ({
      uid: "testid",
      email: "test@example.com",
      name: "Test User",
      address: "123 Test Street",
    }),
  }),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
}));
jest.mock("firebase/auth", () => ({
  deleteUser: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

describe("Profile", () => {
  it("renders the Profile page and email", async () => {
    render(<Profile />);
    // DEBUG: Uncomment this to see actual DOM during test
    // screen.debug();
    await waitFor(
      () => {
        expect(screen.getByText(/My Profile/i)).toBeInTheDocument();
        expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
      },
      { timeout: 7000 }
    );
  });

  it("allows name field editing", async () => {
    render(<Profile />);
    const nameInput = await screen.findByPlaceholderText("Name");
    fireEvent.change(nameInput, { target: { value: "New Name" } });
    expect(nameInput).toHaveValue("New Name");
  });
});
