import React from "react";
import { Navigate, Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function UserLayout() {
  const { loading, session } = useAuth();

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20, color: "#666" }}>Loading…</div>
      </>
    );
  }

  if (!session.authenticated || session.role !== "user") return <Navigate to="/user/login" replace />;

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
