import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, getToken } from "./api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!getToken()); // checking a saved login

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  // On page load, ask the server who the saved token belongs to.
  useEffect(() => {
    if (!getToken()) return;
    api("/auth/me")
      .then((data) => setUser(data.user))
      .catch(logout)
      .finally(() => setLoading(false));
  }, [logout]);

  // api.js fires this when the server rejects our token.
  useEffect(() => {
    window.addEventListener("unauthorized", logout);
    return () => window.removeEventListener("unauthorized", logout);
  }, [logout]);

  const authenticate = async (mode, form) => {
    const data = await api(`/auth/${mode}`, { method: "POST", body: form });
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, authenticate }}>
      {children}
    </AuthContext.Provider>
  );
}
