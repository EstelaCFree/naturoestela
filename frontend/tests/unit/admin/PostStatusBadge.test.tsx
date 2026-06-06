import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PostStatusBadge } from "@/features/admin/components/PostStatusBadge";

describe("PostStatusBadge", () => {
  it("renders 'Draft' for draft status", () => {
    render(<PostStatusBadge status="draft" />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("renders 'Scheduled' for scheduled status", () => {
    render(<PostStatusBadge status="scheduled" />);
    expect(screen.getByText("Scheduled")).toBeInTheDocument();
  });

  it("renders 'Published' for published status", () => {
    render(<PostStatusBadge status="published" />);
    expect(screen.getByText("Published")).toBeInTheDocument();
  });
});
