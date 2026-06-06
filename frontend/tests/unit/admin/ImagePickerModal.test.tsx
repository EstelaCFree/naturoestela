import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi } from "vitest";
import { ImagePickerModal } from "@/features/admin/components/ImagePickerModal";
import { server } from "../../mocks/server";
import type { AdminImage } from "@/types/adminPost";

const mockImage: AdminImage = {
  id: "img-1",
  original_url: "http://example.com/img.jpg",
  thumbnail_url: "http://example.com/img-thumb.jpg",
  alt_text: "Test image",
  subtitle: null,
};

function renderModal(onSelect = vi.fn(), onClose = vi.fn()) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <ImagePickerModal onSelect={onSelect} onClose={onClose} />
    </QueryClientProvider>
  );
}

describe("ImagePickerModal", () => {
  it("renders image grid from API", async () => {
    server.use(
      http.get("*/api/v1/admin/images/", () =>
        HttpResponse.json({ data: [mockImage], meta: { total: 1, page: 1, page_size: 20 } })
      )
    );
    renderModal();
    await waitFor(() =>
      expect(screen.getByAltText("Test image")).toBeInTheDocument()
    );
  });

  it("shows empty state when no images", async () => {
    server.use(
      http.get("*/api/v1/admin/images/", () =>
        HttpResponse.json({ data: [], meta: { total: 0, page: 1, page_size: 20 } })
      )
    );
    renderModal();
    await waitFor(() =>
      expect(screen.getByText(/no images uploaded yet/i)).toBeInTheDocument()
    );
  });

  it("calls onSelect with the image and closes on selection", async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    server.use(
      http.get("*/api/v1/admin/images/", () =>
        HttpResponse.json({ data: [mockImage], meta: { total: 1, page: 1, page_size: 20 } })
      )
    );
    renderModal(onSelect, onClose);
    await waitFor(() => screen.getByAltText("Test image"));
    await userEvent.click(screen.getByAltText("Test image").closest("button")!);
    expect(onSelect).toHaveBeenCalledWith(mockImage);
    expect(onClose).toHaveBeenCalled();
  });
});
