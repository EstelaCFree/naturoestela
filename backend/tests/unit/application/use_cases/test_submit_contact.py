from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4

import pytest

from src.application.use_cases.submit_contact import SubmitContact
from src.domain.entities.contact_submission import ContactSubmission


@pytest.fixture
def repository() -> AsyncMock:
    return AsyncMock()


@pytest.fixture
def saved_submission() -> ContactSubmission:
    return ContactSubmission(
        id=uuid4(), name="Ana", email="ana@example.com", subject="Hola", message="Mensaje"
    )


async def test_saves_valid_submission(
    repository: AsyncMock, saved_submission: ContactSubmission
) -> None:
    repository.save.return_value = saved_submission
    use_case = SubmitContact(repository)

    result = await use_case.execute(
        name="Ana", email="ana@example.com", subject="Hola", message="Mensaje"
    )

    repository.save.assert_called_once()
    assert result == saved_submission


async def test_without_email_service_saves_and_does_not_raise(
    repository: AsyncMock, saved_submission: ContactSubmission
) -> None:
    repository.save.return_value = saved_submission
    use_case = SubmitContact(repository, email_service=None)

    result = await use_case.execute(
        name="Ana", email="ana@example.com", subject="Hola", message="Mensaje"
    )

    repository.save.assert_called_once()
    assert result == saved_submission


async def test_with_email_service_calls_send_notification(
    repository: AsyncMock, saved_submission: ContactSubmission
) -> None:
    repository.save.return_value = saved_submission
    email_service = MagicMock()
    use_case = SubmitContact(repository, email_service=email_service)

    result = await use_case.execute(
        name="Ana", email="ana@example.com", subject="Hola", message="Mensaje"
    )

    email_service.send_contact_notification.assert_called_once_with(saved_submission)
    assert result == saved_submission


async def test_email_failure_does_not_propagate(
    repository: AsyncMock, saved_submission: ContactSubmission
) -> None:
    repository.save.return_value = saved_submission
    email_service = MagicMock()
    email_service.send_contact_notification.side_effect = Exception("Resend is down")
    use_case = SubmitContact(repository, email_service=email_service)

    result = await use_case.execute(
        name="Ana", email="ana@example.com", subject="Hola", message="Mensaje"
    )

    assert result == saved_submission
