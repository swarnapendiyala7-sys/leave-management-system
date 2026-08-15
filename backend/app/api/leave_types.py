from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.leave_type import LeaveTypeCreate, LeaveTypeResponse
from app.services.leave_type import (
    create_leave_type,
    get_all_leave_types,
    get_leave_type_by_id,
)


router = APIRouter(
    prefix="/leave-types",
    tags=["Leave Types"],
)


@router.get(
    "",
    response_model=list[LeaveTypeResponse],
)
def list_leave_types(
    db: Session = Depends(get_db),
):
    return get_all_leave_types(db)


@router.get(
    "/{leave_type_id}",
    response_model=LeaveTypeResponse,
)
def get_leave_type(
    leave_type_id: int,
    db: Session = Depends(get_db),
):
    leave_type = get_leave_type_by_id(
        db,
        leave_type_id,
    )

    if not leave_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave type not found",
        )

    return leave_type


@router.post(
    "",
    response_model=LeaveTypeResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_leave_type(
    leave_type_data: LeaveTypeCreate,
    db: Session = Depends(get_db),
):
    try:
        return create_leave_type(
            db,
            leave_type_data,
        )
    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Leave type already exists",
        )