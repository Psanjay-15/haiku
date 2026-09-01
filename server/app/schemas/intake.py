from typing import Literal, get_args

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


Duration = Literal["Less than 6 months", "6-12 months", "Over a year"]

FamilyHistoryOption = Literal[
    "Father had hair loss",
    "Mother had hair loss",
    "Siblings with thinning or baldness",
    "No known family history",
]

HairLossPattern = Literal[
    "Receding hairline",
    "Thinning at crown",
    "Widening part line",
    "Diffuse thinning",
    "Patchy loss",
    "Sudden excessive shedding",
]

DiagnosedCondition = Literal[
    "PCOS/PCOD",
    "Thyroid disorder",
    "Diabetes",
    "Autoimmune disease",
    "Anemia",
    "None",
]

MenstrualCycle = Literal["Regular", "Irregular", "Menopausal", "Not applicable"]

PregnancyRelated = Literal[
    "Currently pregnant",
    "Postpartum <1 year",
    "Not applicable",
]

PastSixMonthsOption = Literal[
    "Crash dieting or major weight loss",
    "High stress or emotional trauma",
    "Fever with illness (COVID, Dengue, Typhoid)",
    "Recent surgery",
    "Change in location/water/air quality",
]

SmokingSeverity = Literal["Mild <5/day", "Moderate 5-10/day", "Severe >10/day"]
HairWashFrequency = Literal["Daily", "Alternate Days", "Weekly"]
ProductDuration = Literal["<3mo", "3-6mo", ">6mo"]
ProcedureSessions = Literal["1-3", "4-6", ">6"]
SampleType = Literal["Saliva", "Blood", "Either"]

OTHER_PREFIX = "Other: "
MAX_OTHER_LENGTH = 200


def allow_fixed_option_or_other(value: str, fixed_options: tuple[str, ...]) -> str:
    if value in fixed_options:
        return value

    if not value.startswith(OTHER_PREFIX):
        raise ValueError("Select a provided option or use 'Other: your answer'")

    other_answer = value.removeprefix(OTHER_PREFIX).strip()
    if not other_answer:
        raise ValueError("Other answer cannot be empty")
    if len(other_answer) > MAX_OTHER_LENGTH:
        raise ValueError("Other answer must be 200 characters or fewer")

    return f"{OTHER_PREFIX}{other_answer}"


def allow_fixed_options_or_other(
    values: list[str], fixed_options: tuple[str, ...]
) -> list[str]:
    answers = [
        allow_fixed_option_or_other(value, fixed_options) for value in values
    ]

    if len(answers) != len(set(answers)):
        raise ValueError("Duplicate answers are not allowed")

    return answers


class IntakeModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class Habits(IntakeModel):
    smoking: bool
    smoking_severity: SmokingSeverity | None = None
    alcohol: bool
    hard_water: bool
    hair_wash_frequency: str
    heating_tools_styling_chemicals: bool
    salon_treatments: bool
    salon_treatment_detail: str | None = None

    @field_validator("hair_wash_frequency")
    @classmethod
    def validate_hair_wash_frequency(cls, value: str) -> str:
        return allow_fixed_option_or_other(value, get_args(HairWashFrequency))

    @model_validator(mode="after")
    def validate_followups(self):
        if self.smoking and self.smoking_severity is None:
            raise ValueError("smoking_severity is required when smoking is true")
        if not self.smoking and self.smoking_severity is not None:
            raise ValueError("smoking_severity must be empty when smoking is false")

        if self.salon_treatments and not (
            self.salon_treatment_detail and self.salon_treatment_detail.strip()
        ):
            raise ValueError(
                "salon_treatment_detail is required when salon_treatments is true"
            )
        if not self.salon_treatments and self.salon_treatment_detail is not None:
            raise ValueError(
                "salon_treatment_detail must be empty when salon_treatments is false"
            )

        return self


class ProductUsage(IntakeModel):
    used: bool
    duration: ProductDuration | None = None
    helped: bool | None = None
    side_effects: bool | None = None

    @model_validator(mode="after")
    def validate_usage_details(self):
        details = (self.duration, self.helped, self.side_effects)

        if self.used and any(value is None for value in details):
            raise ValueError(
                "duration, helped and side_effects are required when used is true"
            )
        if not self.used and any(value is not None for value in details):
            raise ValueError(
                "duration, helped and side_effects must be empty when used is false"
            )

        return self


class Products(IntakeModel):
    otc_medicated_shampoos: ProductUsage
    hair_oils_serums: ProductUsage
    topical_minoxidil: ProductUsage
    oral_minoxidil: ProductUsage
    supplements: ProductUsage


class ProcedureUsage(IntakeModel):
    done: bool
    sessions: ProcedureSessions | None = None
    helped: bool | None = None

    @model_validator(mode="after")
    def validate_procedure_details(self):
        details = (self.sessions, self.helped)

        if self.done and any(value is None for value in details):
            raise ValueError("sessions and helped are required when done is true")
        if not self.done and any(value is not None for value in details):
            raise ValueError("sessions and helped must be empty when done is false")

        return self


class OtherProcedureUsage(ProcedureUsage):
    name: str | None = None

    @model_validator(mode="after")
    def validate_other_procedure_name(self):
        if self.done and not (self.name and self.name.strip()):
            raise ValueError("name is required when another procedure was done")
        if not self.done and self.name is not None:
            raise ValueError("name must be empty when another procedure was not done")

        return self


class Procedures(IntakeModel):
    prp_gfc_iprf: ProcedureUsage
    stem_cells_exosomes: ProcedureUsage
    hair_transplant: ProcedureUsage
    other: OtherProcedureUsage


class IntakeSubmission(IntakeModel):
    # Section A: Personal and family hair loss history
    age_hair_loss_began: int = Field(ge=0, le=120)
    duration: Duration
    family_history: list[str] = Field(min_length=1)
    pattern: list[str] = Field(min_length=1)

    # Section B: Hormonal and health influences
    diagnosed_conditions: list[str] = Field(min_length=1)
    menstrual_cycle: MenstrualCycle
    pregnancy_related: PregnancyRelated
    adult_acne_oily_skin: bool
    excess_body_facial_hair: bool

    # Section C: Lifestyle and environmental triggers
    past_6_months: list[str]
    habits: Habits

    # Section D: Current hair care and treatments
    products: Products
    procedures: Procedures
    past_treatment_side_effects: bool
    past_treatment_side_effects_detail: str | None = None

    # Section E: Sample collection and consent
    sample_type: SampleType
    consent: bool

    @field_validator("family_history")
    @classmethod
    def validate_family_history_options(cls, values: list[str]) -> list[str]:
        return allow_fixed_options_or_other(values, get_args(FamilyHistoryOption))

    @field_validator("pattern")
    @classmethod
    def validate_pattern_options(cls, values: list[str]) -> list[str]:
        return allow_fixed_options_or_other(values, get_args(HairLossPattern))

    @field_validator("diagnosed_conditions")
    @classmethod
    def validate_diagnosed_condition_options(cls, values: list[str]) -> list[str]:
        return allow_fixed_options_or_other(values, get_args(DiagnosedCondition))

    @field_validator("past_6_months")
    @classmethod
    def validate_past_six_month_options(cls, values: list[str]) -> list[str]:
        return allow_fixed_options_or_other(values, get_args(PastSixMonthsOption))

    @model_validator(mode="after")
    def validate_conditional_answers(self):
        if (
            "No known family history" in self.family_history
            and len(self.family_history) > 1
        ):
            raise ValueError(
                "No known family history cannot be combined with another option"
            )

        if "None" in self.diagnosed_conditions and len(self.diagnosed_conditions) > 1:
            raise ValueError("None cannot be combined with a diagnosed condition")

        if self.past_treatment_side_effects and not (
            self.past_treatment_side_effects_detail
            and self.past_treatment_side_effects_detail.strip()
        ):
            raise ValueError(
                "past_treatment_side_effects_detail is required when "
                "past_treatment_side_effects is true"
            )
        if (
            not self.past_treatment_side_effects
            and self.past_treatment_side_effects_detail is not None
        ):
            raise ValueError(
                "past_treatment_side_effects_detail must be empty when "
                "past_treatment_side_effects is false"
            )

        return self
