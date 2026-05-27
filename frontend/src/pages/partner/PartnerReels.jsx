import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";

export default function PartnerReels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = "http://localhost:3000";

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/reels/me`, { withCredentials: true });
      setReels(res.data.reels || []);
    } catch (e) {
      console.error(e);
      setReels([]);
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
    if (!confirm("Delete this reel?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/reels/${id}`, { withCredentials: true });
      await load();
    } catch (e) {
      alert(e.response?.data?.message || "Failed to delete.");
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      <h2 style={{ marginBottom: 8 }}>Your Reels</h2>
      <div style={{ marginBottom: 12 }}>
        <Link to="/p/reels/new">Upload new reel</Link>
      </div>

      {loading ? (
        <div style={{ color: "#666" }}>Loading…</div>
      ) : reels.length === 0 ? (
        <div style={{ color: "#666" }}>No reels yet.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
          {reels.map((r) => (
            <div key={r._id} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ aspectRatio: "9/16", background: "#000" }}>
                <video src={r.videoUrl} controls playsInline preload="metadata" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>{r.title}</div>
                <div style={{ color: "#666", fontSize: 14, marginBottom: 10 }}>{r.description}</div>
                <button onClick={() => onDelete(r._id)} style={{ border: 0, padding: "10px 12px", borderRadius: 10, fontWeight: 800, background: "rgba(0,0,0,0.06)" }}>
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
