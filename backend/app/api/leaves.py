from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.leave import LeaveCreate, LeaveResponse, LeaveReview
from app.services.leave import (
    cancel_leave,
    create_leave,
    get_employee_leaves,
    get_leave_by_id,
    get_pending_leaves,
    review_leave,
)


router = APIRouter(
    prefix="/leaves",
    tags=["Leaves"],
)


@router.post(
    "",
    response_model=LeaveResponse,
    status_code=status.HTTP_201_CREATED,
)
def apply_for_leave(
    employee_id: int,
    leave_data: LeaveCreate,
    db: Session = Depends(get_db),
):
    leave = create_leave(
        db,
        employee_id,
        leave_data,
    )

    return leave


@router.get(
    "/employee/{employee_id}",
    response_model=list[LeaveResponse],
)
def list_employee_leaves(
    employee_id: int,
    db: Session = Depends(get_db),
):
    return get_employee_leaves(
        db,
        employee_id,
    )


@router.get(
    "/pending",
    response_model=list[LeaveResponse],
)
def list_pending_leaves(
    db: Session = Depends(get_db),
):
    return get_pending_leaves(db)


@router.get(
    "/{leave_id}",
    response_model=LeaveResponse,
)
def get_leave(
    leave_id: int,
    db: Session = Depends(get_db),
):
    leave = get_leave_by_id(
        db,
        leave_id,
    )

    if not leave:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave not found",
        )

    return leave


@router.put(
    "/{leave_id}/review",
    response_model=LeaveResponse,
)
def review_leave_request(
    leave_id: int,
    reviewer_id: int,
    review_data: LeaveReview,
    db: Session = Depends(get_db),
):
    leave = get_leave_by_id(
        db,
        leave_id,
    )

    if not leave:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave not found",
        )

    if leave.status != "PENDING":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending leaves can be reviewed",
        )

    return review_leave(
        db,
        leave,
        reviewer_id,
        review_data,
    )


@router.put(
    "/{leave_id}/cancel",
    response_model=LeaveResponse,
)
def cancel_leave_request(
    leave_id: int,
    db: Session = Depends(get_db),
):
    leave = get_leave_by_id(
        db,
        leave_id,
    )

    if not leave:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave not found",
        )

    if leave.status != "PENDING":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending leaves can be cancelled",
        )

    return cancel_leave(
        db,
        leave,
    )