"""Shared fixtures for admin integration tests."""

import pytest

HUMAN_KEY = "test-admin-key"
AGENT_KEY = "test-agent-key"
ADMIN_HEADERS = {"Authorization": f"Bearer {HUMAN_KEY}"}
AGENT_HEADERS = {"Authorization": f"Bearer {AGENT_KEY}"}


@pytest.fixture(autouse=True)
def patch_keys(monkeypatch):
    """Override admin keys for all admin integration tests."""
    import src.config as cfg

    monkeypatch.setattr(cfg.settings, "admin_secret_key", HUMAN_KEY)
    monkeypatch.setattr(cfg.settings, "agent_secret_key", AGENT_KEY)
