// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  uid: string;
  email: string;
  name?: string;
  address?: string;
  createdAt?: string;
}

const Profile: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editData, setEditData] = useState<{ name?: string; address?: string }>(
    {}
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  // Fetch profile from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setProfile(snap.data() as UserProfile);
          setEditData({
            name: snap.data().name || "",
            address: snap.data().address || "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile.");
      }
    };
    fetchProfile();
  }, [user]);

  // Update profile fields in Firestore
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { ...editData });
      setFeedback("Profile updated!");
      setProfile((prev) => (prev ? { ...prev, ...editData } : prev));
      setTimeout(() => setFeedback(null), 2000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Failed to update profile.");
    }
  };

  // Delete user account and Firestore document
  const handleDeleteAccount = async () => {
    if (!auth.currentUser) {
      setError("No current user found. Please log in again.");
      return;
    }
    setDeleting(true);
    setError(null);
    setFeedback(null);
    try {
      // Remove Firestore user doc
      await deleteDoc(doc(db, "users", auth.currentUser.uid));
      // Remove Firebase Auth user (must use currentUser for deletion)
      await deleteUser(auth.currentUser);
      setFeedback("Account deleted.");
      // Sign out and redirect
      await logout();
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      // Firebase will throw if token is expired or insufficient permissions
      console.error("Failed to delete account:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete account. Please log in again and try."
      );
    }
    setDeleting(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login to view your profile.</div>;

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "2rem auto",
        border: "2px solid #eee",
        borderRadius: "8px",
        padding: "2rem",
        background: "#fafcff",
      }}
    >
      <h2 className="mb-3 text-center">My Profile</h2>
      {feedback && <p style={{ color: "green" }}>{feedback}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="mb-3">
        <strong>Email:</strong> {profile?.email}
      </div>
      <form onSubmit={handleUpdate}>
        <div className="mb-2">
          <label>Name: </label>
          <input
            type="text"
            value={editData.name || ""}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            placeholder="Name"
            style={{ width: "100%" }}
          />
        </div>
        <div className="mb-2">
          <label>Address: </label>
          <input
            type="text"
            value={editData.address || ""}
            onChange={(e) =>
              setEditData({ ...editData, address: e.target.value })
            }
            placeholder="Address"
            style={{ width: "100%" }}
          />
        </div>
        <button type="submit" className="btn btn-success mt-2">
          Update Profile
        </button>
      </form>
      <hr />
      <button
        className="btn btn-danger mt-2"
        onClick={handleDeleteAccount}
        disabled={deleting}
      >
        Delete My Account
      </button>
    </div>
  );
};

export default Profile;
