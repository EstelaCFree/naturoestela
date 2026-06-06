import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { ContactForm } from "@/features/contact/components/ContactForm";
import { server } from "../mocks/server";

function renderWithQuery(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

async function fillForm() {
  await userEvent.type(screen.getByLabelText(/nombre/i), "Ana García");
  await userEvent.type(screen.getByLabelText(/email/i), "ana@example.com");
  await userEvent.type(screen.getByLabelText(/asunto/i), "Consulta");
  await userEvent.type(screen.getByLabelText(/mensaje/i), "Hola, me gustaría saber más.");
}

describe("ContactForm", () => {
  it("shows inline errors for missing fields on submit", async () => {
    renderWithQuery(<ContactForm />);
    await userEvent.click(screen.getByRole("button", { name: /enviar mensaje/i }));
    await waitFor(() => {
      expect(screen.getAllByRole("alert").length).toBeGreaterThan(0);
    });
  });

  it("disables submit button during submission", async () => {
    renderWithQuery(<ContactForm />);
    await fillForm();
    const button = screen.getByRole("button", { name: /enviar mensaje/i });
    await userEvent.click(button);
    expect(button).toBeDisabled();
  });

  it("shows success message on 201", async () => {
    renderWithQuery(<ContactForm />);
    await fillForm();
    await userEvent.click(screen.getByRole("button", { name: /enviar mensaje/i }));
    await waitFor(() => expect(screen.getByText(/mensaje enviado/i)).toBeInTheDocument());
  });

  it("shows error banner on network error", async () => {
    server.use(http.post("*/api/v1/contact/", () => HttpResponse.error()));
    renderWithQuery(<ContactForm />);
    await fillForm();
    await userEvent.click(screen.getByRole("button", { name: /enviar mensaje/i }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
  });
});
