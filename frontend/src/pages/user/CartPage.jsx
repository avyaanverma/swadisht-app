import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const API_BASE_URL = "http://localhost:3000";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/cart`, { withCredentials: true });
      setCart(res.data.cart);
    } catch (e) {
      console.error(e);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateQty = async (foodItemId, quantity) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/api/cart/item`,
        { foodItemId, quantity },
        { withCredentials: true }
      );
      await load();
    } catch (e) {
      alert(e.response?.data?.message || "Failed to update.");
    }
  };

  const clear = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/cart/clear`, {}, { withCredentials: true });
      await load();
    } catch (e) {
      alert(e.response?.data?.message || "Failed to clear.");
    }
  };

  const items = cart?.items || [];
  const total = items.reduce((sum, it) => sum + (it.foodItem?.price || 0) * (it.quantity || 0), 0);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      <h2 style={{ marginBottom: 8 }}>Cart</h2>
      {loading ? (
        <div style={{ color: "#666" }}>Loading…</div>
      ) : items.length === 0 ? (
        <div style={{ color: "#666" }}>Cart is empty.</div>
      ) : (
        <>
          <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
            {items.map((it) => (
              <div
                key={it.foodItem?._id || it.foodItem}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 12,
                  border: "1px solid rgba(0,0,0,0.06)",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ minWidth: 220 }}>
                  <div style={{ fontWeight: 900 }}>{it.foodItem?.name || "Food"}</div>
                  <div style={{ color: "#666", fontSize: 14 }}>{it.foodItem?.description}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontWeight: 900 }}>₹{it.foodItem?.price || 0}</div>
                  <button onClick={() => updateQty(it.foodItem?._id, Math.max(0, (it.quantity || 0) - 1))}>-</button>
                  <div style={{ minWidth: 24, textAlign: "center", fontWeight: 900 }}>{it.quantity}</div>
                  <button onClick={() => updateQty(it.foodItem?._id, (it.quantity || 0) + 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Total: ₹{total}</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => navigate("/u/checkout")}>Checkout</button>
              <button onClick={clear}>Clear cart</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
