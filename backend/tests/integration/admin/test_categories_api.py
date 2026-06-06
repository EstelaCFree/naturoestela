"""Integration tests: admin categories API (task 13.6)."""

from tests.integration.admin.conftest import ADMIN_HEADERS


async def test_create_category_returns_201(client):
    response = await client.post(
        "/api/v1/admin/categories/",
        json={"name": "Fitoterapia"},
        headers=ADMIN_HEADERS,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Fitoterapia"
    assert data["slug"] == "fitoterapia"
    assert data["post_count"] == 0


async def test_create_category_auto_generates_slug(client):
    response = await client.post(
        "/api/v1/admin/categories/",
        json={"name": "Salud Hormonal"},
        headers=ADMIN_HEADERS,
    )
    assert response.status_code == 201
    assert response.json()["slug"] == "salud-hormonal"


async def test_create_duplicate_category_returns_409(client):
    await client.post(
        "/api/v1/admin/categories/",
        json={"name": "Duplicada"},
        headers=ADMIN_HEADERS,
    )
    response = await client.post(
        "/api/v1/admin/categories/",
        json={"name": "Duplicada"},
        headers=ADMIN_HEADERS,
    )
    assert response.status_code == 409


async def test_rename_category(client):
    create_resp = await client.post(
        "/api/v1/admin/categories/",
        json={"name": "Original"},
        headers=ADMIN_HEADERS,
    )
    cat_id = create_resp.json()["id"]

    response = await client.put(
        f"/api/v1/admin/categories/{cat_id}",
        json={"name": "Renombrada"},
        headers=ADMIN_HEADERS,
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Renombrada"


async def test_delete_empty_category_returns_204(client):
    create_resp = await client.post(
        "/api/v1/admin/categories/",
        json={"name": "Para borrar"},
        headers=ADMIN_HEADERS,
    )
    cat_id = create_resp.json()["id"]

    response = await client.delete(f"/api/v1/admin/categories/{cat_id}", headers=ADMIN_HEADERS)
    assert response.status_code == 204


async def test_list_categories_returns_all(client):
    await client.post(
        "/api/v1/admin/categories/",
        json={"name": "Cat List Test"},
        headers=ADMIN_HEADERS,
    )
    response = await client.get("/api/v1/admin/categories/", headers=ADMIN_HEADERS)
    assert response.status_code == 200
    assert isinstance(response.json()["data"], list)
