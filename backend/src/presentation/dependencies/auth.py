from dataclasses import dataclass
from typing import Literal

from fastapi import Header
from fastapi.exceptions import HTTPException

from src.config import settings


@dataclass
class CallerIdentity:
    source: Literal["human", "ai"]


async def get_admin_caller(authorization: str | None = Header(default=None)) -> CallerIdentity:
    if not authorization:
        raise HTTPException(
            status_code=401, detail={"error": "Unauthorized", "code": "UNAUTHORIZED"}
        )
    prefix = "Bearer "
    if not authorization.startswith(prefix):
        raise HTTPException(
            status_code=401, detail={"error": "Unauthorized", "code": "UNAUTHORIZED"}
        )

    token = authorization[len(prefix) :]

    if settings.admin_secret_key and token == settings.admin_secret_key:
        return CallerIdentity(source="human")
    if settings.agent_secret_key and token == settings.agent_secret_key:
        return CallerIdentity(source="ai")

    raise HTTPException(status_code=401, detail={"error": "Unauthorized", "code": "UNAUTHORIZED"})
