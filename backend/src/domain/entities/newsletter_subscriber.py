from dataclasses import dataclass, field
from datetime import datetime
from uuid import UUID, uuid4


@dataclass
class NewsletterSubscriber:
    email: str
    id: UUID = field(default_factory=uuid4)
    subscribed_at: datetime = field(default_factory=datetime.utcnow)
    is_active: bool = True
