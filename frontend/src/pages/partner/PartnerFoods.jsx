import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";

export default function PartnerFoods() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = "http://localhost:3000";

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/foods/me`, { withCredentials: true });
      setFoods(res.data.foodItems || []);
    } catch (e) {
      console.error(e);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDelete = async (id) => {
    if (!id) return;
    if (!confirm("Delete this food item?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/foods/${id}`, { withCredentials: true });
      await load();
    } catch (e) {
      alert(e.response?.data?.message || "Failed to delete.");
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      <h2 style={{ marginBottom: 8 }}>Your Foods</h2>
      <div style={{ marginBottom: 12 }}>
        <Link to="/p/foods/new">Add new food</Link>
      </div>

      {loading ? (
        <div style={{ color: "#666" }}>Loading…</div>
      ) : foods.length === 0 ? (
        <div style={{ color: "#666" }}>No food items yet.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {foods.map((f) => (
            <div key={f._id} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ height: 140, background: "linear-gradient(135deg,#ff6b6b,#ff9e6b)", position: "relative" }}>
                {f.imageUrl ? (
                  <img src={f.imageUrl} alt={f.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#fff", fontSize: 32, fontWeight: 900 }}>
                    {(f.name || "F").slice(0, 1)}
                  </div>
                )}
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                  <div style={{ fontWeight: 900 }}>{f.name}</div>
                  <div style={{ fontWeight: 900, color: "#ff6b6b" }}>₹{f.price}</div>
                </div>
                <div style={{ color: "#666", fontSize: 14, margin: "8px 0 10px" }}>{f.description}</div>
                <button onClick={() => onDelete(f._id)} style={{ border: 0, padding: "10px 12px", borderRadius: 10, fontWeight: 800, background: "rgba(0,0,0,0.06)" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
