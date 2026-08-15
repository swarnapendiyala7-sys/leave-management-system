from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.leave_type import LeaveType
from app.schemas.leave_type import LeaveTypeCreate


def get_leave_type_by_id(
    db: Session,
    leave_type_id: int,
) -> LeaveType | None:
    return db.get(LeaveType, leave_type_id)


def get_all_leave_types(
    db: Session,
) -> list[LeaveType]:
    statement = select(LeaveType).order_by(LeaveType.id)
    return list(db.scalars(statement).all())


def create_leave_type(
    db: Session,
    leave_type_data: LeaveTypeCreate,
) -> LeaveType:
    leave_type = LeaveType(
        name=leave_type_data.name,
        description=leave_type_data.description,
    )

    db.add(leave_type)
    db.commit()
    db.refresh(leave_type)

    return leave_type