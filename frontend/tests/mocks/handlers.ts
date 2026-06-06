import { http, HttpResponse } from "msw";

const mockPosts = [
  {
    id: "1",
    title: "Post de prueba",
    slug: "post-de-prueba",
    excerpt: "Un extracto de prueba",
    content: "Contenido",
    category: { id: "c1", name: "Salud Natural", slug: "salud-natural" },
    tags: [], featured_image: null,
    published_at: "2026-05-01T10:00:00Z",
    created_at: "2026-05-01T10:00:00Z",
    updated_at: "2026-05-01T10:00:00Z",
  },
];

export const handlers = [
  http.get("*/api/v1/posts/", () =>
    HttpResponse.json({ data: mockPosts, meta: { total: 1, page: 1, page_size: 10 } })
  ),
  http.post("*/api/v1/newsletter/subscribe", async ({ request }) => {
    const body = await request.json() as { email: string };
    if (body.email === "existing@example.com") {
      return HttpResponse.json({ data: { message: "Already subscribed" } }, { status: 200 });
    }
    return HttpResponse.json({ data: { message: "Successfully subscribed" } }, { status: 201 });
  }),
  http.post("*/api/v1/contact/", () =>
    HttpResponse.json({ data: { message: "Your message has been received" } }, { status: 201 })
  ),
  // Admin fallback handlers (tests override these via server.use())
  http.get("*/api/v1/admin/posts/", () =>
    HttpResponse.json({ data: [], meta: { total: 0, page: 1, page_size: 20 } })
  ),
  http.get("*/api/v1/admin/tags/", () => HttpResponse.json({ data: [] })),
  http.get("*/api/v1/admin/images/", () =>
    HttpResponse.json({ data: [], meta: { total: 0, page: 1, page_size: 20 } })
  ),
  http.get("*/api/v1/admin/categories/", () => HttpResponse.json({ data: [] })),
];
