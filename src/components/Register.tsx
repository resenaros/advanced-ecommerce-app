// src/components/Register.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
// Import FirebaseError type to properly type error
import type { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const { loading } = useAuth();

  // Use FirebaseError for error type instead of 'any'
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Create Firestore document for user profile
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name,
        address,
        createdAt: new Date().toISOString(),
      });
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
    <form
      onSubmit={handleRegister}
      style={{ maxWidth: 400, margin: "2rem auto" }}
    >
      <input
        type="email"
        placeholder="Email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 12 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 12 }}
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        required
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", marginBottom: 12 }}
      />
      <input
        type="text"
        placeholder="Address"
        value={address}
        required
        onChange={(e) => setAddress(e.target.value)}
        style={{ width: "100%", marginBottom: 12 }}
      />
      <button type="submit" style={{ width: "100%" }}>
        Register
      </button>
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
