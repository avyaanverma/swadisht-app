import React from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function PartnerDashboard() {
  const { session } = useAuth();

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      <h2 style={{ marginBottom: 8 }}>Partner Dashboard</h2>
      <div style={{ color: "#666", marginBottom: 12 }}>
        {session.user?.businessName} • {session.user?.address}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link to="/p/reels">Manage Reels</Link>
        <Link to="/p/foods">Manage Foods</Link>
      </div>
    </div>
  );
}
