// src/App.tsx
import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Register from "./components/Register";
import Login from "./components/Login";
import { AuthProvider } from "./context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductManager from "./components/ProductManager";
import OrderHistory from "./pages/OrderHistory";
import Products from "./pages/Products";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      {/* AuthProvider wraps whole app for global auth state */}
      <AuthProvider>
        <Router>
          {/* Global Navigation Bar */}
          <Navbar />
          {/* Define all major routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Product catalog for all users */}
            <Route path="/products" element={<Products />} />
            {/* Product admin/CRUD panel, protected route */}
            <Route
              path="/product-manager"
              element={
                <ProtectedRoute>
                  <ProductManager />
                </ProtectedRoute>
              }
            />
            {/* Protected routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              }
            />
            {/* Public routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
        {/* React Query Devtools for debugging (optional, remove in production) */}
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
