from unittest.mock import AsyncMock

import pytest
from httpx import AsyncClient

from src.application.use_cases.submit_contact import SubmitContact
from src.domain.entities.contact_submission import ContactSubmission
from src.presentation.routers import contact as contact_router


@pytest.fixture
def saved_submission() -> ContactSubmission:
    from uuid import uuid4

    return ContactSubmission(
        id=uuid4(),
        name="Ana García",
        email="ana@example.com",
        subject="Consulta",
        message="Hola, me gustaría saber más.",
    )


async def test_post_contact_returns_201_without_email(
    client: AsyncClient, saved_submission: ContactSubmission
) -> None:
    mock_repository = AsyncMock()
    mock_repository.save.return_value = saved_submission

    def _override() -> SubmitContact:
        return SubmitContact(repository=mock_repository, email_service=None)

    from src.main import app

    app.dependency_overrides[contact_router._get_use_case] = _override
    try:
        response = await client.post(
            "/api/v1/contact/",
            json={
                "name": "Ana García",
                "email": "ana@example.com",
                "subject": "Consulta",
                "message": "Hola, me gustaría saber más.",
            },
        )
    finally:
        app.dependency_overrides.pop(contact_router._get_use_case, None)

    assert response.status_code == 201
    mock_repository.save.assert_called_once()
