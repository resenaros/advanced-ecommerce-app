// src/components/Register.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
// Import FirebaseError type to properly type error
import type { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const { loading } = useAuth(); // Use loading from AuthContext for initial auth state

  // Use FirebaseError for error type instead of 'any'
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess(true);
      setError(null);
      // Redirect to home after registration
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      const firebaseErr = err as FirebaseError;
      setError(firebaseErr.message);
    }
  };

  // Show spinner while auth is initializing
  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleRegister}>
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
      <button type="submit">Register</button>
      {/* Show success message after registration */}
      {success && (
        <p style={{ color: "green" }}>
          Registration successful! Redirecting...
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default Register;
