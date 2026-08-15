from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.leave import Leave
from app.schemas.leave import LeaveCreate, LeaveReview


def create_leave(
    db: Session,
    employee_id: int,
    leave_data: LeaveCreate,
) -> Leave:
    leave = Leave(
        employee_id=employee_id,
        leave_type_id=leave_data.leave_type_id,
        start_date=leave_data.start_date,
        end_date=leave_data.end_date,
        reason=leave_data.reason,
        status="PENDING",
    )

    db.add(leave)
    db.commit()
    db.refresh(leave)

    return leave


def get_leave_by_id(
    db: Session,
    leave_id: int,
) -> Leave | None:
    return db.get(Leave, leave_id)


def get_employee_leaves(
    db: Session,
    employee_id: int,
) -> list[Leave]:
    statement = (
        select(Leave)
        .where(Leave.employee_id == employee_id)
        .order_by(Leave.created_at.desc())
    )

    return list(db.scalars(statement).all())


def get_pending_leaves(
    db: Session,
) -> list[Leave]:
    statement = (
        select(Leave)
        .where(Leave.status == "PENDING")
        .order_by(Leave.created_at.asc())
    )

    return list(db.scalars(statement).all())


def review_leave(
    db: Session,
    leave: Leave,
    reviewer_id: int,
    review_data: LeaveReview,
) -> Leave:
    leave.status = review_data.status
    leave.manager_comments = review_data.manager_comments
    leave.reviewed_by = reviewer_id

    db.commit()
    db.refresh(leave)

    return leave


def cancel_leave(
    db: Session,
    leave: Leave,
) -> Leave:
    leave.status = "CANCELLED"

    db.commit()
    db.refresh(leave)

    return leave