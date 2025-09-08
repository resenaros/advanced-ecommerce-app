// src/components/Login.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
// The FirebaseError type is provided by the Firebase SDK
import type { FirebaseError } from "firebase/app";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Login Component
 * - Handles user login and logout using Firebase Auth
 * - Displays error and success messages
 * - Redirects to home after successful login
 * - Shows "You must be logged in" if redirected from a protected route
 */
const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const location = useLocation();

  // Read redirect state from ProtectedRoute
  const fromProtected = Boolean(
    (location.state as { fromProtected?: boolean })?.fromProtected
  );

  // Handle login with proper error typing
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess(true);
      setError(null);
      // Redirect to home after login
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      // Use FirebaseError type for error
      const firebaseErr = err as FirebaseError;
      setError(firebaseErr.message);
    }
  };

  // Handle logout with proper error typing
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setSuccess(false);
      setError(null);
    } catch (err) {
      const firebaseErr = err as FirebaseError;
      console.error("Logout error:", firebaseErr.message);
      setError(firebaseErr.message);
    }
  };

  // Show spinner while auth is initializing
  if (loading) return <div>Loading...</div>;

  return (
    <>
      {/* Show message if redirected from a protected route */}
      {fromProtected && (
        <p style={{ color: "orange", fontWeight: 500 }}>
          You must be logged in to access that page.
        </p>
      )}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {/* Show success message after login */}
        {success && (
          <p style={{ color: "green" }}>Login successful! Redirecting...</p>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      {/* Only show logout button if user is logged in */}
      {user && <button onClick={handleLogout}>Logout</button>}
    </>
  );
};

export default Login;
