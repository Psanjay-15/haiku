from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.models.intake_form import IntakeForm
from app.schemas.intake_form import IntakeFormResponse


router = APIRouter(tags=["intake form"])


@router.get("/intake-form", response_model=IntakeFormResponse)
def get_intake_form(session: Session = Depends(get_db_session)):
    intake_form = session.scalar(
        select(IntakeForm)
        .where(IntakeForm.is_active.is_(True))
        .order_by(IntakeForm.version.desc())
    )

    if not intake_form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Intake form is unavailable",
        )

    return intake_form.definition
