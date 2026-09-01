from pydantic import BaseModel, ConfigDict


class IntakeFormSection(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    title: str
    short_title: str
    questions: list[dict[str, object]]


class IntakeFormResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    form: str
    version: int
    sections: list[IntakeFormSection]
