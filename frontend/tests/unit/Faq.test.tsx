import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Faq } from "@/features/home/components/Faq";

describe("Faq", () => {
  it("renders all 6 items collapsed by default", () => {
    render(<Faq />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(6);
    buttons.forEach((btn) => expect(btn).toHaveAttribute("aria-expanded", "false"));
  });

  it("expands item when clicked", async () => {
    render(<Faq />);
    const firstButton = screen.getAllByRole("button")[0];
    await userEvent.click(firstButton);
    expect(firstButton).toHaveAttribute("aria-expanded", "true");
  });

  it("clicking a second item collapses the first", async () => {
    render(<Faq />);
    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[0]);
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(buttons[1]);
    expect(buttons[0]).toHaveAttribute("aria-expanded", "false");
    expect(buttons[1]).toHaveAttribute("aria-expanded", "true");
  });

  it("clicking the open item collapses it", async () => {
    render(<Faq />);
    const button = screen.getAllByRole("button")[0];
    await userEvent.click(button);
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });
});
