import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// Logged-in users only; everyone else is sent to /login
function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="status">Checking your login…</p>;
  return user ? children : <Navigate to="/login" replace />;
}

// Login/Register pages: logged-in users are sent to the dashboard
function GuestOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="status">Checking your login…</p>;
  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Protected><Dashboard /></Protected>} />
            <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
            <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}
