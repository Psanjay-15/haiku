from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.models.intake import Intake
from app.schemas.intake import IntakeResponse, IntakeSubmission


router = APIRouter(prefix="/intakes", tags=["intakes"])


@router.post("", response_model=IntakeResponse, status_code=status.HTTP_201_CREATED)
def create_intake(
    submission: IntakeSubmission,
    session: Session = Depends(get_db_session),
) -> Intake:
    intake = Intake(
        answers=submission.model_dump(mode="json"),
        current_section="E",
        status="submitted",
        submitted_at=datetime.now(UTC),
    )

    try:
        session.add(intake)
        session.commit()
        session.refresh(intake)
    except SQLAlchemyError as exc:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not create intake",
        ) from exc

    return intake
