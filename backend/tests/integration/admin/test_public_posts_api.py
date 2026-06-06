"""Integration tests: public posts API with blog-admin changes (task 13.10)."""

from datetime import UTC, datetime, timedelta
from uuid import uuid4

import pytest

from tests.integration.admin.conftest import ADMIN_HEADERS


@pytest.fixture
async def published_post(client) -> dict:
    cat_resp = await client.post(
        "/api/v1/admin/categories/",
        json={"name": f"Cat {uuid4().hex[:6]}"},
        headers=ADMIN_HEADERS,
    )
    cat_id = cat_resp.json()["id"]

    create_resp = await client.post(
        "/api/v1/admin/posts/",
        json={
            "title": "Public Post",
            "content": "Content",
            "category_id": cat_id,
            "seo_title": "SEO Title",
            "seo_description": "SEO Desc",
            "seo_keywords": "kw1,kw2",
        },
        headers=ADMIN_HEADERS,
    )
    post = create_resp.json()
    await client.patch(f"/api/v1/admin/posts/{post['id']}/publish", headers=ADMIN_HEADERS)
    return post


async def test_scheduled_post_excluded_from_public_api(client):
    cat_resp = await client.post(
        "/api/v1/admin/categories/",
        json={"name": f"Cat {uuid4().hex[:6]}"},
        headers=ADMIN_HEADERS,
    )
    cat_id = cat_resp.json()["id"]
    create_resp = await client.post(
        "/api/v1/admin/posts/",
        json={"title": "Future Post", "content": "...", "category_id": cat_id},
        headers=ADMIN_HEADERS,
    )
    post = create_resp.json()
    future = (datetime.now(tz=UTC) + timedelta(days=30)).isoformat()
    await client.patch(
        f"/api/v1/admin/posts/{post['id']}/publish",
        json={"published_at": future},
        headers=ADMIN_HEADERS,
    )

    resp = await client.get(f"/api/v1/posts/{post['slug']}")
    assert resp.status_code == 404


async def test_tag_filter_returns_matching_posts(client, published_post):
    tag_resp = await client.post(
        "/api/v1/admin/tags/",
        json={"name": f"FilterTag {uuid4().hex[:4]}"},
        headers=ADMIN_HEADERS,
    )
    tag = tag_resp.json()
    await client.put(
        f"/api/v1/admin/posts/{published_post['id']}/tags",
        json={"tag_ids": [tag["id"]]},
        headers=ADMIN_HEADERS,
    )

    resp = await client.get(f"/api/v1/posts/?tag={tag['slug']}")
    assert resp.status_code == 200
    slugs = [p["slug"] for p in resp.json()["data"]]
    assert published_post["slug"] in slugs


async def test_seo_block_present_in_public_response(client, published_post):
    resp = await client.get(f"/api/v1/posts/{published_post['slug']}")
    assert resp.status_code == 200
    body = resp.json()
    assert "seo" in body
    assert body["seo"]["title"] == "SEO Title"
    assert body["seo"]["description"] == "SEO Desc"


async def test_created_by_absent_from_public_response(client, published_post):
    resp = await client.get(f"/api/v1/posts/{published_post['slug']}")
    assert resp.status_code == 200
    assert "created_by" not in resp.json()


async def test_body_images_field_present_in_public_response(client, published_post):
    resp = await client.get(f"/api/v1/posts/{published_post['slug']}")
    assert resp.status_code == 200
    assert "body_images" in resp.json()


async def test_featured_image_returned_in_post_list(client):
    """GET /api/v1/posts returns featured_image as nested object when set."""
    import io

    from PIL import Image as PILImage

    cat_resp = await client.post(
        "/api/v1/admin/categories/",
        json={"name": f"ImgCat {uuid4().hex[:6]}"},
        headers=ADMIN_HEADERS,
    )
    cat_id = cat_resp.json()["id"]

    buf = io.BytesIO()
    img = PILImage.new("RGB", (100, 100), color=(255, 0, 0))
    img.save(buf, format="JPEG")
    buf.seek(0)
    img_resp = await client.post(
        "/api/v1/admin/images/",
        files={"file": ("test.jpg", buf, "image/jpeg")},
        headers=ADMIN_HEADERS,
    )
    assert img_resp.status_code == 201
    image_id = img_resp.json()["id"]

    create_resp = await client.post(
        "/api/v1/admin/posts/",
        json={
            "title": "Post With Image",
            "content": "Content",
            "category_id": cat_id,
            "featured_image_id": image_id,
        },
        headers=ADMIN_HEADERS,
    )
    post = create_resp.json()
    await client.patch(f"/api/v1/admin/posts/{post['id']}/publish", headers=ADMIN_HEADERS)

    resp = await client.get("/api/v1/posts/")
    assert resp.status_code == 200
    matching = [p for p in resp.json()["data"] if p["id"] == post["id"]]
    assert len(matching) == 1
    fi = matching[0]["featured_image"]
    assert fi is not None
    assert "original_url" in fi
    assert "thumbnail_url" in fi
    assert "alt_text" in fi


async def test_featured_image_returned_in_post_detail(client):
    """GET /api/v1/posts/{slug} returns featured_image as nested object when set."""
    import io

    from PIL import Image as PILImage

    cat_resp = await client.post(
        "/api/v1/admin/categories/",
        json={"name": f"ImgCat2 {uuid4().hex[:6]}"},
        headers=ADMIN_HEADERS,
    )
    cat_id = cat_resp.json()["id"]

    buf = io.BytesIO()
    img = PILImage.new("RGB", (100, 100), color=(0, 255, 0))
    img.save(buf, format="JPEG")
    buf.seek(0)
    img_resp = await client.post(
        "/api/v1/admin/images/",
        files={"file": ("detail_test.jpg", buf, "image/jpeg")},
        headers=ADMIN_HEADERS,
    )
    assert img_resp.status_code == 201
    image_id = img_resp.json()["id"]

    create_resp = await client.post(
        "/api/v1/admin/posts/",
        json={
            "title": "Detail Post With Image",
            "content": "Content",
            "category_id": cat_id,
            "featured_image_id": image_id,
        },
        headers=ADMIN_HEADERS,
    )
    post = create_resp.json()
    await client.patch(f"/api/v1/admin/posts/{post['id']}/publish", headers=ADMIN_HEADERS)

    resp = await client.get(f"/api/v1/posts/{post['slug']}")
    assert resp.status_code == 200
    fi = resp.json()["featured_image"]
    assert fi is not None
    assert "original_url" in fi
    assert "thumbnail_url" in fi


async def test_category_filter_by_slug(client, published_post):
    resp = await client.get("/api/v1/posts/")
    assert resp.status_code == 200
    posts = resp.json()["data"]
    if posts:
        cat_slug = posts[0]["category"]["slug"]
        filtered = await client.get(f"/api/v1/posts/?category={cat_slug}")
        assert filtered.status_code == 200
        for p in filtered.json()["data"]:
            assert p["category"]["slug"] == cat_slug
