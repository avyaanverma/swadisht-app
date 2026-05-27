import React from "react";
import { NavLink } from "react-router";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { loading, session, logout } = useAuth();
  const isAuthed = !loading && session.authenticated;
  const isPartner = isAuthed && session.role === "foodPartner";
  const isUser = isAuthed && session.role === "user";

  return (
    <header className="nav">
      <div className="nav__inner">
        <NavLink to="/reels" className="nav__brand">
          <div className="nav__logo">S</div>
          <div className="nav__title">Swadisht</div>
        </NavLink>

        <nav className="nav__links">
          <NavLink
            to="/stores"
            className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}
          >
            Stores
          </NavLink>
          <NavLink
            to="/reels"
            className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}
          >
            Reels
          </NavLink>
          <NavLink
            to="/u/cart"
            className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}
          >
            Cart
          </NavLink>
          {isPartner && (
            <NavLink
              to="/p"
              className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}
            >
              Partner
            </NavLink>
          )}
        </nav>

        <div className="nav__actions">
          {isAuthed ? (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <NavLink to={isUser ? "/u/profile" : "/p"} className="nav__action">
                {isPartner ? session.user?.businessName || "Partner" : "Profile"}
              </NavLink>
              <button
                type="button"
                className="nav__action"
                onClick={logout}
                style={{
                  background: "rgba(0,0,0,0.75)",
                  boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
                }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <NavLink to="/user/login" className="nav__action">
              Sign in
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
