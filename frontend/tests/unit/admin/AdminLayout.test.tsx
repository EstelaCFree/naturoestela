import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { AdminLayout } from "@/features/admin/components/AdminLayout";

const TOKEN_KEY = "access_token";

function renderLayout(initialPath = "/admin/posts") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/admin/login" element={<div>Login page</div>} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="posts" element={<div>Posts page</div>} />
          <Route path="images" element={<div>Images page</div>} />
          <Route path="categories" element={<div>Categories page</div>} />
          <Route path="tags" element={<div>Tags page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("AdminLayout", () => {
  beforeEach(() => {
    localStorage.setItem(TOKEN_KEY, "test-token");
  });

  afterEach(() => {
    localStorage.removeItem(TOKEN_KEY);
  });

  it("renders all four navigation links", () => {
    renderLayout();
    expect(screen.getByRole("link", { name: /posts/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /images/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /categories/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /tags/i })).toBeInTheDocument();
  });

  it("active nav link has aria-current set to page", () => {
    renderLayout("/admin/posts");
    expect(screen.getByRole("link", { name: /posts/i })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /images/i })).not.toHaveAttribute("aria-current");
  });

  it("renders the sign out button", () => {
    renderLayout();
    expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
  });

  it("clicking sign out clears the localStorage token", async () => {
    renderLayout();
    await userEvent.click(screen.getByRole("button", { name: /sign out/i }));
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it("hamburger toggle button is present in the top bar", () => {
    renderLayout();
    expect(screen.getByRole("button", { name: /toggle sidebar/i })).toBeInTheDocument();
  });

  it("clicking hamburger button shows a second sidebar as mobile overlay", async () => {
    renderLayout();
    const sidebars = screen.queryAllByRole("complementary");
    expect(sidebars).toHaveLength(1);

    await userEvent.click(screen.getByRole("button", { name: /toggle sidebar/i }));
    expect(screen.queryAllByRole("complementary")).toHaveLength(2);
  });
});
