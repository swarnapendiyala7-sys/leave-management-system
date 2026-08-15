from datetime import date
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


class LeaveCreate(BaseModel):
    leave_type_id: int
    start_date: date
    end_date: date
    reason: str = Field(min_length=3, max_length=2000)

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date < self.start_date:
            raise ValueError("End date cannot be before start date")
        return self


class LeaveReview(BaseModel):
    status: Literal["APPROVED", "REJECTED"]
    manager_comments: str | None = Field(
        default=None,
        max_length=2000,
    )


class LeaveResponse(BaseModel):
    id: int
    employee_id: int
    leave_type_id: int
    start_date: date
    end_date: date
    reason: str
    status: str
    manager_comments: str | None
    reviewed_by: int | None

    model_config = ConfigDict(from_attributes=True)