from sqlalchemy import select

from app.core.database import SessionLocal
from app.data.intake_form import INTAKE_FORM_DEFINITION
from app.models.intake_form import IntakeForm


def seed_intake_form() -> None:
    with SessionLocal() as session:
        version = INTAKE_FORM_DEFINITION["version"]
        existing_form = session.scalar(
            select(IntakeForm).where(IntakeForm.version == version)
        )

        active_forms = session.scalars(
            select(IntakeForm).where(IntakeForm.is_active.is_(True))
        ).all()
        for active_form in active_forms:
            active_form.is_active = False

        if existing_form:
            existing_form.name = INTAKE_FORM_DEFINITION["form"]
            existing_form.definition = INTAKE_FORM_DEFINITION
            existing_form.is_active = True
        else:
            session.add(
                IntakeForm(
                    name=INTAKE_FORM_DEFINITION["form"],
                    version=version,
                    definition=INTAKE_FORM_DEFINITION,
                    is_active=True,
                )
            )

        session.commit()
