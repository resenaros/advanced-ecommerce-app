// src/components/DisplayData.tsx
import { useState, useEffect, useRef } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

interface User {
  id?: string;
  name: string;
  age: number;
}

/**
 * DisplayData lists users from Firestore "users" collection.
 * Shows feedback after update/delete, auto-clearing after 2 seconds.
 * Logs errors for debugging.
 */
const DisplayData: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [newAge, setNewAge] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [refreshToggle, setRefreshToggle] = useState<boolean>(false);

  // Fetch user data from Firestore
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const dataArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      setUsers(dataArray);
    } catch (err) {
      // Log the error for debugging
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [refreshToggle]);

  // Update user info in Firestore
  const updateUser = async (userId: string, updatedData: Partial<User>) => {
    // Validation for updates (optional, can add more)
    if (updatedData.name && !updatedData.name.trim()) {
      setFeedback("Name cannot be empty.");
      setAutoClearFeedback();
      return;
    }
    if (updatedData.age !== undefined && updatedData.age <= 0) {
      setFeedback("Age must be greater than 0.");
      setAutoClearFeedback();
      return;
    }
    try {
      await updateDoc(doc(db, "users", userId), updatedData);
      setFeedback("User updated!");
      setAutoClearFeedback();
      setRefreshToggle((v) => !v); // trigger refresh
    } catch (err) {
      // Log the error for debugging
      console.error("Error updating user:", err);
      setFeedback("Failed to update user");
      setAutoClearFeedback();
    }
  };

  // Delete user from Firestore
  const deleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      setFeedback("User deleted!");
      setAutoClearFeedback();
      setRefreshToggle((v) => !v); // trigger refresh
    } catch (err) {
      // Log the error for debugging
      console.error("Error deleting user:", err);
      setFeedback("Failed to delete user");
      setAutoClearFeedback();
    }
  };

  // Helper: auto-clear feedback message after 2 seconds
  const setAutoClearFeedback = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <div>
      <h2>Users List</h2>
      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {feedback && <p style={{ color: "green" }}>{feedback}</p>}
      {users.length === 0 && !loading ? (
        <p>No users found.</p>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            style={{
              border: "2px solid black",
              margin: "10px",
              padding: "10px",
            }}
          >
            <p>Name: {user.name}</p>
            <p>Age: {user.age}</p>
            <input
              onChange={(e) => setNewName(e.target.value)}
              type="text"
              placeholder="Enter new name:"
              style={{ marginRight: 8 }}
            />
            <button onClick={() => updateUser(user.id!, { name: newName })}>
              Update Name
            </button>
            <input
              onChange={(e) => setNewAge(e.target.value)}
              type="number"
              placeholder="Enter new age:"
              style={{ marginLeft: 8, marginRight: 8 }}
            />
            <button
              onClick={() => updateUser(user.id!, { age: Number(newAge) })}
            >
              Update Age
            </button>
            <button
              style={{
                backgroundColor: "crimson",
                color: "#fff",
                marginLeft: 8,
              }}
              onClick={() => deleteUser(user.id!)}
            >
              Delete User
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default DisplayData;
