from pydantic import BaseModel, ConfigDict, EmailStr, field_validator


class ContactRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    email: EmailStr
    subject: str
    message: str

    @field_validator("name")
    @classmethod
    def name_max_length(cls, v: str) -> str:
        if len(v.strip()) == 0:
            raise ValueError("name cannot be blank")
        if len(v) > 255:
            raise ValueError("name must be at most 255 characters")
        return v

    @field_validator("subject")
    @classmethod
    def subject_max_length(cls, v: str) -> str:
        if len(v.strip()) == 0:
            raise ValueError("subject cannot be blank")
        if len(v) > 255:
            raise ValueError("subject must be at most 255 characters")
        return v

    @field_validator("message")
    @classmethod
    def message_constraints(cls, v: str) -> str:
        if len(v.strip()) == 0:
            raise ValueError("message cannot be blank")
        if len(v) > 5000:
            raise ValueError("message must be at most 5000 characters")
        return v


class ContactResponse(BaseModel):
    data: dict[str, str]
