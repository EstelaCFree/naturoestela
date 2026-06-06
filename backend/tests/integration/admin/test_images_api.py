"""Integration tests: admin images API (task 13.8)."""

import io

from tests.integration.admin.conftest import ADMIN_HEADERS


def _make_fake_jpeg(size: int = 100) -> bytes:
    """Return a minimal valid JPEG-like payload for testing."""
    from PIL import Image as PILImage

    buf = io.BytesIO()
    PILImage.new("RGB", (200, 200), color=(100, 149, 237)).save(buf, format="JPEG")
    return buf.getvalue()


async def test_upload_jpeg_returns_201_with_webp_urls(client):
    jpeg_bytes = _make_fake_jpeg()
    response = await client.post(
        "/api/v1/admin/images/",
        headers=ADMIN_HEADERS,
        files={"file": ("photo.jpg", jpeg_bytes, "image/jpeg")},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["original_url"].endswith(".webp")
    assert data["thumbnail_url"].endswith(".webp")
    assert data["width"] is not None


async def test_upload_unsupported_type_returns_422(client):
    response = await client.post(
        "/api/v1/admin/images/",
        headers=ADMIN_HEADERS,
        files={"file": ("doc.pdf", b"%PDF-1.4", "application/pdf")},
    )
    assert response.status_code == 422


async def test_update_metadata(client):
    jpeg_bytes = _make_fake_jpeg()
    create_resp = await client.post(
        "/api/v1/admin/images/",
        headers=ADMIN_HEADERS,
        files={"file": ("img.jpg", jpeg_bytes, "image/jpeg")},
    )
    image_id = create_resp.json()["id"]

    response = await client.patch(
        f"/api/v1/admin/images/{image_id}",
        json={"alt_text": "Hierbas medicinales", "subtitle": "Foto de estudio"},
        headers=ADMIN_HEADERS,
    )
    assert response.status_code == 200
    assert response.json()["alt_text"] == "Hierbas medicinales"


async def test_delete_image_when_not_in_use(client):
    jpeg_bytes = _make_fake_jpeg()
    create_resp = await client.post(
        "/api/v1/admin/images/",
        headers=ADMIN_HEADERS,
        files={"file": ("del.jpg", jpeg_bytes, "image/jpeg")},
    )
    image_id = create_resp.json()["id"]

    response = await client.delete(f"/api/v1/admin/images/{image_id}", headers=ADMIN_HEADERS)
    assert response.status_code == 204


async def test_list_images_returns_paginated_response(client):
    response = await client.get("/api/v1/admin/images/", headers=ADMIN_HEADERS)
    assert response.status_code == 200
    body = response.json()
    assert "data" in body
    assert "meta" in body
