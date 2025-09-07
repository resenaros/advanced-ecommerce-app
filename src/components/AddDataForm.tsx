// src/components/AddDataForm.tsx

import React, { useState, useRef } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

interface User {
  id?: string;
  name: string;
  age: number;
}

/**
 * AddDataForm lets you enter a name/age and adds a user to Firestore "users" collection.
 * Now with validation and auto-clearing success message!
 */
const AddDataForm: React.FC = () => {
  const [data, setData] = useState<Omit<User, "id">>({ name: "", age: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handles form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: name === "age" ? parseInt(value) : value });
  };

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: name must not be empty, age > 0
    if (!data.name.trim()) {
      setError("Name is required.");
      setSuccess(false);
      return;
    }
    if (data.age <= 0) {
      setError("Age must be greater than 0.");
      setSuccess(false);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await addDoc(collection(db, "users"), data);
      setSuccess(true);
      setData({ name: "", age: 0 }); // reset form
      // Auto-clear success after 2 seconds
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setSuccess(false), 2000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Error adding document");
        console.error("Error adding document: ", error);
      } else {
        setError("Error adding document");
        console.error("Error adding document: ", error);
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={data.name}
        onChange={handleChange}
        placeholder="Name"
        style={{ background: "#ffffe0" }}
      />
      <input
        name="age"
        type="number"
        value={data.age}
        onChange={handleChange}
        placeholder="Age"
        style={{ background: "#ffffe0" }}
      />
      <button type="submit" disabled={loading}>
        Add User
      </button>
      {loading && <span> Adding...</span>}
      {success && (
        <span style={{ color: "green", marginLeft: 8 }}>User added!</span>
      )}
      {error && <span style={{ color: "red", marginLeft: 8 }}>{error}</span>}
    </form>
  );
};

export default AddDataForm;
