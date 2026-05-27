import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export default function CheckoutPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

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

  const items = cart?.items || [];
  const total = useMemo(
    () => items.reduce((sum, it) => sum + (it.foodItem?.price || 0) * (it.quantity || 0), 0),
    [items]
  );

  const payNow = async (e) => {
    e.preventDefault();
    setPaying(true);
    try {
      // Placeholder: integrate payment gateway later
      await new Promise((r) => setTimeout(r, 700));
      alert("Payment UI placeholder: order flow next.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      <h2 style={{ marginBottom: 8 }}>Checkout</h2>

      {loading ? (
        <div style={{ color: "#666" }}>Loading…</div>
      ) : items.length === 0 ? (
        <div style={{ color: "#666" }}>Cart is empty.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 14, border: "1px solid rgba(0,0,0,0.06)" }}>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>Order Summary</div>
            <div style={{ display: "grid", gap: 10 }}>
              {items.map((it) => (
                <div
                  key={it.foodItem?._id || it.foodItem}
                  style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
                >
                  <div>
                    <div style={{ fontWeight: 800 }}>{it.foodItem?.name}</div>
                    <div style={{ color: "#666", fontSize: 14 }}>Qty: {it.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 900 }}>₹{(it.foodItem?.price || 0) * (it.quantity || 0)}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900 }}>
                <div>Total</div>
                <div>₹{total}</div>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 12, padding: 14, border: "1px solid rgba(0,0,0,0.06)" }}>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>Payment</div>
            <form onSubmit={payNow} style={{ display: "grid", gap: 10 }}>
              <input placeholder="Card number" inputMode="numeric" required />
              <div style={{ display: "flex", gap: 10 }}>
                <input placeholder="MM/YY" required />
                <input placeholder="CVV" inputMode="numeric" required />
              </div>
              <input placeholder="Name on card" required />
              <button type="submit" disabled={paying}>
                {paying ? "Processing..." : `Pay ₹${total}`}
              </button>
            </form>
            <div style={{ color: "#666", fontSize: 12, marginTop: 10 }}>
              Payment gateway integration pending.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

