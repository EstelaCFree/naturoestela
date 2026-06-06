import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AuthorshipBadge } from "@/features/admin/components/AuthorshipBadge";

describe("AuthorshipBadge", () => {
  it("renders 'Human' for human authorship", () => {
    render(<AuthorshipBadge authorship="human" />);
    expect(screen.getByText("Human")).toBeInTheDocument();
  });

  it("renders 'AI' for ai authorship", () => {
    render(<AuthorshipBadge authorship="ai" />);
    expect(screen.getByText("AI")).toBeInTheDocument();
  });
});
