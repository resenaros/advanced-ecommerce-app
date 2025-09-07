// src/components/Login.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

// The FirebaseError type is provided by the Firebase SDK
import type { FirebaseError } from "firebase/app";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Handle login with proper error typing
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      setError(null);
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
      alert("Logged out!");
      setError(null);
    } catch (err) {
      const firebaseErr = err as FirebaseError;
      console.error("Logout error:", firebaseErr.message);
      setError(firebaseErr.message);
    }
  };

  return (
    <>
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
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
};

export default Login;
