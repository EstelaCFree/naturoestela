import { Navigate, Outlet } from "react-router-dom";

const TOKEN_KEY = "access_token";

export function ProtectedRoute() {
  const isAuthenticated = !!localStorage.getItem(TOKEN_KEY);
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
