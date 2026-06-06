"""Integration tests: admin posts API (task 13.9)."""

from datetime import UTC, datetime, timedelta
from uuid import uuid4

import pytest

from tests.integration.admin.conftest import ADMIN_HEADERS, AGENT_HEADERS


@pytest.fixture
async def category_id(client) -> str:
    resp = await client.post(
        "/api/v1/admin/categories/",
        json={"name": f"Cat {uuid4().hex[:6]}"},
        headers=ADMIN_HEADERS,
    )
    return resp.json()["id"]


async def _create_post(client, category_id: str, **kwargs) -> dict:
    payload = {
        "title": kwargs.get("title", "Test Post"),
        "content": kwargs.get("content", "Content"),
        "category_id": category_id,
        "excerpt": kwargs.get("excerpt", ""),
    }
    resp = await client.post("/api/v1/admin/posts/", json=payload, headers=ADMIN_HEADERS)
    assert resp.status_code == 201
    return resp.json()


async def test_create_post_creates_draft(client, category_id):
    post = await _create_post(client, category_id)
    assert post["status"] == "draft"
    assert post["published_at"] is None
    assert post["created_by"] == "human"


async def test_agent_key_sets_created_by_ai(client, category_id):
    resp = await client.post(
        "/api/v1/admin/posts/",
        json={"title": "AI Post", "content": "...", "category_id": category_id},
        headers=AGENT_HEADERS,
    )
    assert resp.status_code == 201
    assert resp.json()["created_by"] == "ai"


async def test_publish_immediately(client, category_id):
    post = await _create_post(client, category_id)
    resp = await client.patch(f"/api/v1/admin/posts/{post['id']}/publish", headers=ADMIN_HEADERS)
    assert resp.status_code == 200
    assert resp.json()["status"] == "published"


async def test_schedule_post_with_future_date(client, category_id):
    post = await _create_post(client, category_id)
    future = (datetime.now(tz=UTC) + timedelta(days=7)).isoformat()
    resp = await client.patch(
        f"/api/v1/admin/posts/{post['id']}/publish",
        json={"published_at": future},
        headers=ADMIN_HEADERS,
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "scheduled"


async def test_unpublish_reverts_to_draft(client, category_id):
    post = await _create_post(client, category_id)
    await client.patch(f"/api/v1/admin/posts/{post['id']}/publish", headers=ADMIN_HEADERS)

    resp = await client.patch(f"/api/v1/admin/posts/{post['id']}/unpublish", headers=ADMIN_HEADERS)
    assert resp.status_code == 200
    assert resp.json()["status"] == "draft"


async def test_update_post(client, category_id):
    post = await _create_post(client, category_id, title="Original")
    resp = await client.put(
        f"/api/v1/admin/posts/{post['id']}",
        json={
            "title": "Updated",
            "content": "New content",
            "category_id": category_id,
        },
        headers=ADMIN_HEADERS,
    )
    assert resp.status_code == 200
    assert resp.json()["title"] == "Updated"


async def test_delete_post(client, category_id):
    post = await _create_post(client, category_id)
    resp = await client.delete(f"/api/v1/admin/posts/{post['id']}", headers=ADMIN_HEADERS)
    assert resp.status_code == 204


async def test_list_with_status_filter(client, category_id):
    await _create_post(client, category_id, title="Draft post")

    resp = await client.get("/api/v1/admin/posts/?status=draft", headers=ADMIN_HEADERS)
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert all(p["status"] == "draft" for p in data)


async def test_set_tags(client, category_id):
    post = await _create_post(client, category_id)
    tag_resp = await client.post(
        "/api/v1/admin/tags/",
        json={"name": f"Tag {uuid4().hex[:4]}"},
        headers=ADMIN_HEADERS,
    )
    tag_id = tag_resp.json()["id"]

    resp = await client.put(
        f"/api/v1/admin/posts/{post['id']}/tags",
        json={"tag_ids": [tag_id]},
        headers=ADMIN_HEADERS,
    )
    assert resp.status_code == 200


async def test_set_tags_unknown_id_returns_404(client, category_id):
    post = await _create_post(client, category_id)
    resp = await client.put(
        f"/api/v1/admin/posts/{post['id']}/tags",
        json={"tag_ids": [str(uuid4())]},
        headers=ADMIN_HEADERS,
    )
    assert resp.status_code == 404


async def test_duplicate_slug_returns_409(client, category_id):
    await _create_post(client, category_id, title="Unique Title")
    resp = await client.post(
        "/api/v1/admin/posts/",
        json={
            "title": "Other",
            "content": "...",
            "category_id": category_id,
            "slug": "unique-title",
        },
        headers=ADMIN_HEADERS,
    )
    assert resp.status_code == 409
