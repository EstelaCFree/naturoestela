import { renderHook, act } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, it, expect, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { useAdminAuth } from "@/features/admin/hooks/useAdminAuth";
import { server } from "../../mocks/server";

const TOKEN_KEY = "access_token";

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(MemoryRouter, null, children);
}

describe("useAdminAuth", () => {
  afterEach(() => {
    localStorage.removeItem(TOKEN_KEY);
  });

  it("login stores token and returns success when probe responds 200", async () => {
    server.use(
      http.get("*/api/v1/admin/posts/", () =>
        HttpResponse.json({ data: [], meta: { total: 0, page: 1, page_size: 1 } })
      )
    );
    const { result } = renderHook(() => useAdminAuth(), { wrapper });

    await act(async () => {
      const outcome = await result.current.login("test-token");
      expect(outcome.success).toBe(true);
    });

    expect(localStorage.getItem(TOKEN_KEY)).toBe("test-token");
  });

  it("login returns error message and does not store token on 401", async () => {
    server.use(
      http.get("*/api/v1/admin/posts/", () =>
        HttpResponse.json({ detail: "Unauthorized" }, { status: 401 })
      )
    );
    const { result } = renderHook(() => useAdminAuth(), { wrapper });

    await act(async () => {
      const outcome = await result.current.login("bad-token");
      expect(outcome.success).toBe(false);
      if (!outcome.success) expect(outcome.error).toBe("Invalid token");
    });

    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it("logout removes token from localStorage", () => {
    localStorage.setItem(TOKEN_KEY, "some-token");
    const { result } = renderHook(() => useAdminAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it("isAuthenticated is true when token exists in localStorage", () => {
    localStorage.setItem(TOKEN_KEY, "some-token");
    const { result } = renderHook(() => useAdminAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("isAuthenticated is false when no token in localStorage", () => {
    const { result } = renderHook(() => useAdminAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
  });
});
