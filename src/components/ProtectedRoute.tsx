// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute blocks access to children unless user is authenticated.
 * Redirects to /login (with state) if not authenticated.
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  if (!user) {
    // Pass state to login so it can display redirect message
    return (
      <Navigate
        to="/login"
        replace
        state={{ fromProtected: true, from: location.pathname }}
      />
    );
  }
  return <>{children}</>;
};

export default ProtectedRoute;
