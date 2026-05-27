import React from "react";
import { NavLink } from "react-router";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="nav">
      <div className="nav__inner">
        <NavLink to="/reels" className="nav__brand">
          <div className="nav__logo">S</div>
          <div className="nav__title">Swadhisht</div>
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
        </nav>

        <div className="nav__actions">
          <NavLink to="/user/login" className="nav__action">
            Sign in
          </NavLink>
        </div>
      </div>
    </header>
  );
}

