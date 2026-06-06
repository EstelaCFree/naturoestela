from pydantic import BaseModel, ConfigDict, EmailStr


class SubscribeRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email: EmailStr


class SubscribeResponse(BaseModel):
    data: dict[str, str]
