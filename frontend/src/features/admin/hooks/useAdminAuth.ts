import { isAxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import type { LoginResult } from "../types";

const TOKEN_KEY = "access_token";

export function useAdminAuth() {
  const navigate = useNavigate();
  const [isProbing, setIsProbing] = useState(false);

  const isAuthenticated = !!localStorage.getItem(TOKEN_KEY);

  async function login(token: string): Promise<LoginResult> {
    setIsProbing(true);
    try {
      await apiClient.get("/api/v1/admin/posts/", {
        params: { page_size: 1 },
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem(TOKEN_KEY, token);
      return { success: true };
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        return { success: false, error: "Invalid token" };
      }
      return { success: false, error: "Connection error. Please try again." };
    } finally {
      setIsProbing(false);
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    navigate("/admin/login");
  }

  return { login, logout, isAuthenticated, isProbing };
}
