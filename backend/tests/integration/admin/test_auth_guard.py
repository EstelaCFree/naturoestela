"""Integration tests: admin auth guard (task 13.5)."""

from tests.integration.admin.conftest import ADMIN_HEADERS, AGENT_HEADERS


async def test_valid_human_key_accepted(client):
    response = await client.get("/api/v1/admin/posts/", headers=ADMIN_HEADERS)
    assert response.status_code == 200


async def test_valid_agent_key_accepted(client):
    response = await client.get("/api/v1/admin/posts/", headers=AGENT_HEADERS)
    assert response.status_code == 200


async def test_missing_auth_header_returns_401(client):
    response = await client.get("/api/v1/admin/posts/")
    assert response.status_code == 401
    assert response.json()["detail"]["code"] == "UNAUTHORIZED"


async def test_wrong_token_returns_401(client):
    response = await client.get(
        "/api/v1/admin/posts/", headers={"Authorization": "Bearer wrong-token"}
    )
    assert response.status_code == 401
    assert response.json()["detail"]["code"] == "UNAUTHORIZED"
