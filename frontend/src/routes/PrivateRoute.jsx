import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (window.location.pathname.startsWith("/admin") && user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }
  return children;
}