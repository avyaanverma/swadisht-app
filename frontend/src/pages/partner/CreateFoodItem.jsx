import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export default function CreateFoodItem() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/foods`,
        { name, description, price: Number(price), imageUrl },
        { withCredentials: true }
      );
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      alert("Food item added.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add food.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: 20 }}>
      <h2 style={{ marginBottom: 12 }}>Add Food Item</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          type="number"
          min="0"
          required
        />
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL (optional)" />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}

