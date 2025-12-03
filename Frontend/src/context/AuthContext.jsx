import { createContext, useState, useEffect } from "react";
import { getMe } from "../api/authapi";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // NEW FIX

  // ------------------------------
  // Load user safely on refresh
  // ------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    // Try to validate token with backend
    (async () => {
      try {
        const res = await getMe();
        if (res?.user) {
          setUser(res.user);
          localStorage.setItem("user", JSON.stringify(res.user));
        }
      } catch (e) {
        console.log("Session expired → Logging out");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ------------------------------
  // Login Function
  // ------------------------------
  const login = (data) => {
    if (!data?.user || !data?.token) return;

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);

    setUser(data.user);
    setLoading(false);
  };

  // ------------------------------
  // Logout
  // ------------------------------
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
