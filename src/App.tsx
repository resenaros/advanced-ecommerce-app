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
import DisplayData from "./components/DisplayData";
import AddDataForm from "./components/AddDataForm";
import { AuthProvider } from "./context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const queryClient = new QueryClient();

/**
 * Main App Component
 * - Provides Redux store and React Query context to the whole app
 * - Sets up client-side routing for all main pages and features
 * - Includes NavBar, Home, Cart, Register, Login, DisplayData, and AddDataForm pages
 */
const App: React.FC = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          {/* Global Navigation Bar */}
          <Navbar />
          {/* Define all major routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/users" element={<DisplayData />} />
            <Route path="/add-user" element={<AddDataForm />} />
          </Routes>
        </Router>
        {/* React Query Devtools for debugging (optional, remove in production) */}
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
