import { useState, useEffect } from "react";
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

const DisplayData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newAge, setNewAge] = useState<string>("");
  const [newName, setNewName] = useState<string>("");

  // Fix: Add explicit parameter types
  const updateUser = async (userId: string, updatedData: Partial<User>) => {
    const userDoc = doc(db, "users", userId);
    await updateDoc(userDoc, updatedData);
  };

  const deleteUser = async (userId: string) => {
    await deleteDoc(doc(db, "users", userId));
  };

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const dataArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      setUsers(dataArray);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Users List</h2>
      {users.map((user) => (
        <div
          key={user.id}
          style={{ border: "2px solid black", margin: "10px" }}
        >
          <div key={user.id}>
            <p>Name: {user.name}</p>
            <p>Age: {user.age}</p>
          </div>
          <input
            onChange={(e) => setNewName(e.target.value)}
            type="string"
            placeholder="Enter new name:"
          />
          <button onClick={() => updateUser(user.id!, { name: newName })}>
            Update Name
          </button>
          <input
            onChange={(e) => setNewAge(e.target.value)}
            type="number"
            placeholder="Enter new age:"
          />
          <button onClick={() => updateUser(user.id!, { age: Number(newAge) })}>
            Update Age
          </button>
          <button
            style={{ backgroundColor: "crimson" }}
            onClick={() => deleteUser(user.id!)}
          >
            Delete User
          </button>
        </div>
      ))}
    </div>
  );
};

export default DisplayData;
