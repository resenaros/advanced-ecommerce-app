// src/components/Register.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

// Import FirebaseError type to properly type error
import type { FirebaseError } from "firebase/app";

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Use FirebaseError for error type instead of 'any'
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration successful!");
      setError(null);
    } catch (err) {
      const firebaseErr = err as FirebaseError;
      setError(firebaseErr.message);
    }
  };

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
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default Register;
