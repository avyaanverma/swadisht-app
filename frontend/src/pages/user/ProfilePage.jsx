import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { session, logout } = useAuth();

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      <h2 style={{ marginBottom: 8 }}>Profile</h2>
      <div style={{ background: "#fff", borderRadius: 12, padding: 14, border: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ fontWeight: 900, marginBottom: 6 }}>{session.user?.fullName}</div>
        <div style={{ color: "#666" }}>{session.user?.email}</div>
        <div style={{ color: "#666", marginTop: 6 }}>Role: {session.role}</div>
        <button onClick={logout} style={{ marginTop: 12 }}>
          Sign out
        </button>
      </div>
    </div>
  );
}
