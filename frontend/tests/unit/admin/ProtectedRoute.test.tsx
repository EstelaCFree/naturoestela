import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, afterEach } from "vitest";
import { ProtectedRoute } from "@/features/admin/components/ProtectedRoute";

const TOKEN_KEY = "access_token";

function renderWithRoutes(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/admin/login" element={<div>Login page</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<div>Protected content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  afterEach(() => {
    localStorage.removeItem(TOKEN_KEY);
  });

  it("renders outlet content when token is present", () => {
    localStorage.setItem(TOKEN_KEY, "valid-token");
    renderWithRoutes("/admin/dashboard");
    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });

  it("redirects to /admin/login when no token is present", () => {
    renderWithRoutes("/admin/dashboard");
    expect(screen.getByText("Login page")).toBeInTheDocument();
  });
});
