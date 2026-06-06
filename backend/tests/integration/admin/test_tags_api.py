"""Integration tests: admin tags API (task 13.7)."""

from tests.integration.admin.conftest import ADMIN_HEADERS


async def test_create_tag_returns_201(client):
    response = await client.post(
        "/api/v1/admin/tags/",
        json={"name": "Sistema Nervioso"},
        headers=ADMIN_HEADERS,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Sistema Nervioso"
    assert data["slug"] == "sistema-nervioso"


async def test_create_duplicate_tag_returns_409(client):
    await client.post("/api/v1/admin/tags/", json={"name": "Dup"}, headers=ADMIN_HEADERS)
    response = await client.post("/api/v1/admin/tags/", json={"name": "Dup"}, headers=ADMIN_HEADERS)
    assert response.status_code == 409


async def test_rename_tag(client):
    create_resp = await client.post(
        "/api/v1/admin/tags/", json={"name": "Tag Original"}, headers=ADMIN_HEADERS
    )
    tag_id = create_resp.json()["id"]

    response = await client.put(
        f"/api/v1/admin/tags/{tag_id}",
        json={"name": "Tag Renombrada"},
        headers=ADMIN_HEADERS,
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Tag Renombrada"


async def test_delete_tag_returns_204(client):
    create_resp = await client.post(
        "/api/v1/admin/tags/", json={"name": "Tag Delete"}, headers=ADMIN_HEADERS
    )
    tag_id = create_resp.json()["id"]

    response = await client.delete(f"/api/v1/admin/tags/{tag_id}", headers=ADMIN_HEADERS)
    assert response.status_code == 204


async def test_delete_nonexistent_tag_returns_404(client):
    from uuid import uuid4

    response = await client.delete(f"/api/v1/admin/tags/{uuid4()}", headers=ADMIN_HEADERS)
    assert response.status_code == 404


async def test_list_tags(client):
    response = await client.get("/api/v1/admin/tags/", headers=ADMIN_HEADERS)
    assert response.status_code == 200
    assert isinstance(response.json()["data"], list)
