import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, afterEach } from "vitest";
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";
import { server } from "../../mocks/server";

const TOKEN_KEY = "access_token";

function renderPage(initialPath = "/admin/login") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/posts" element={<div>Admin posts</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("AdminLoginPage", () => {
  afterEach(() => {
    localStorage.removeItem(TOKEN_KEY);
  });

  it("renders the admin token field and sign in button", () => {
    renderPage();
    expect(screen.getByLabelText(/admin token/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows Invalid token error on 401", async () => {
    server.use(
      http.get("*/api/v1/admin/posts/", () =>
        HttpResponse.json({ detail: "Unauthorized" }, { status: 401 })
      )
    );
    renderPage();
    await userEvent.type(screen.getByLabelText(/admin token/i), "bad-token");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/invalid token/i)
    );
  });

  it("submit button is disabled while probe is in flight", async () => {
    server.use(
      http.get("*/api/v1/admin/posts/", () => new Promise(() => {}))
    );
    renderPage();
    await userEvent.type(screen.getByLabelText(/admin token/i), "test-token");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled();
  });

  it("redirects to /admin/posts on successful login", async () => {
    server.use(
      http.get("*/api/v1/admin/posts/", () =>
        HttpResponse.json({ data: [], meta: { total: 0, page: 1, page_size: 1 } })
      )
    );
    renderPage();
    await userEvent.type(screen.getByLabelText(/admin token/i), "correct-token");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => expect(screen.getByText("Admin posts")).toBeInTheDocument());
  });

  it("redirects immediately to /admin/posts when already authenticated", () => {
    localStorage.setItem(TOKEN_KEY, "existing-token");
    renderPage();
    expect(screen.getByText("Admin posts")).toBeInTheDocument();
  });
});
