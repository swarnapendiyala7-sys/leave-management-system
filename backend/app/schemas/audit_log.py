from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AuditLogResponse(BaseModel):
    id: int
    user_id: int
    leave_id: int | None
    action: str
    details: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)