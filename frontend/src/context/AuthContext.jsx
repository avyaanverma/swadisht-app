import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState({ authenticated: false, role: null, user: null });

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/me`, { withCredentials: true });
      setSession(res.data || { authenticated: false, role: null, user: null });
    } catch (e) {
      setSession({ authenticated: false, role: null, user: null });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (session?.authenticated && session.role === "foodPartner") {
        await axios.get(`${API_BASE_URL}/api/auth/foodpartner/logout`, { withCredentials: true });
      } else if (session?.authenticated && session.role === "user") {
        await axios.get(`${API_BASE_URL}/api/auth/user/logout`, { withCredentials: true });
      } else {
        // best-effort: clear cookie on server for both roles
        await axios.get(`${API_BASE_URL}/api/auth/user/logout`, { withCredentials: true }).catch(() => {});
        await axios.get(`${API_BASE_URL}/api/auth/foodpartner/logout`, { withCredentials: true }).catch(() => {});
      }
    } finally {
      await refresh();
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      loading,
      session,
      refresh,
      logout,
    }),
    [loading, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
