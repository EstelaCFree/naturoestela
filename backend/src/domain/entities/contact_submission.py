from dataclasses import dataclass, field
from datetime import datetime
from uuid import UUID, uuid4


@dataclass
class ContactSubmission:
    name: str
    email: str
    subject: str
    message: str
    id: UUID = field(default_factory=uuid4)
    submitted_at: datetime = field(default_factory=datetime.utcnow)
    is_read: bool = False
