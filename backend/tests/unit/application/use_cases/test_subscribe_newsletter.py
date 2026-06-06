from unittest.mock import AsyncMock
from uuid import uuid4

import pytest

from src.application.use_cases.subscribe_newsletter import SubscribeNewsletter
from src.domain.entities.newsletter_subscriber import NewsletterSubscriber


def make_subscriber(email: str = "test@example.com") -> NewsletterSubscriber:
    return NewsletterSubscriber(id=uuid4(), email=email)


@pytest.fixture
def repository():
    return AsyncMock()


@pytest.fixture
def use_case(repository):
    return SubscribeNewsletter(repository)


async def test_creates_new_subscriber(use_case, repository):
    repository.find_by_email.return_value = None
    subscriber = make_subscriber()
    repository.save.return_value = subscriber

    result, created = await use_case.execute("test@example.com")

    assert created is True
    repository.save.assert_called_once()


async def test_returns_existing_subscriber_without_inserting(use_case, repository):
    existing = make_subscriber()
    repository.find_by_email.return_value = existing

    result, created = await use_case.execute("test@example.com")

    assert created is False
    assert result == existing
    repository.save.assert_not_called()
