import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { NewsletterForm } from "@/features/newsletter/components/NewsletterForm";

function renderWithQuery(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe("NewsletterForm", () => {
  it("shows inline validation error for invalid email before submit", async () => {
    renderWithQuery(<NewsletterForm />);
    await userEvent.click(screen.getByRole("button", { name: /suscribirme/i }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
  });

  it("disables submit button during submission", async () => {
    renderWithQuery(<NewsletterForm />);
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "nuevo@example.com");
    const button = screen.getByRole("button", { name: /suscribirme/i });
    await userEvent.click(button);
    expect(button).toBeDisabled();
  });

  it("shows success message on 201", async () => {
    renderWithQuery(<NewsletterForm />);
    await userEvent.type(screen.getByRole("textbox"), "nuevo@example.com");
    await userEvent.click(screen.getByRole("button", { name: /suscribirme/i }));
    await waitFor(() => expect(screen.getByText(/te has suscrito con éxito/i)).toBeInTheDocument());
  });

  it("shows already-subscribed message on 200", async () => {
    renderWithQuery(<NewsletterForm />);
    await userEvent.type(screen.getByRole("textbox"), "existing@example.com");
    await userEvent.click(screen.getByRole("button", { name: /suscribirme/i }));
    await waitFor(() => expect(screen.getByText(/ya estás suscrita\/o/i)).toBeInTheDocument());
  });
});
