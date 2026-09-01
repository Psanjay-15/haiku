import { useState } from "react";
import styled from "styled-components";

import { submitIntake } from "../services";
import PrimaryButton from "../reusable/PrimaryButton";


const ReviewHeader = styled.div`
  margin: 24px 0 20px;

  h1 {
    margin: 0 0 12px;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(2rem, 3.5vw, 3rem);
    font-weight: 500;
    letter-spacing: -0.04em;
  }

  p {
    margin: 0;
    color: var(--color-muted);
    line-height: 1.6;
  }

  @media print { display: none; }
`;

const ReviewToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media print { display: none; }
`;

const PrintButton = styled.button`
  min-height: 44px;
  border: 1px solid var(--color-border);
  border-radius: 11px;
  padding: 0 14px;
  background: #fff;
  color: var(--color-success);
  font: inherit;
  font-size: .76rem;
  font-weight: 750;
  cursor: pointer;

  &:hover { border-color: var(--color-success); background: #eef4f0; }
`;

const PrintHeading = styled.div`
  display: none;

  @media print {
    display: block;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid #17211d;

    h1 { margin: 0 0 4px; font: 700 18pt Georgia, serif; }
    p { margin: 0; color: #555; font-size: 9pt; }
  }
`;

const SectionsGrid = styled.div`
  display: grid;
  align-items: stretch;
  gap: 14px;

  @media (min-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media print {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
`;

const Section = styled.section`
  display: flex;
  height: 100%;
  flex-direction: column;
  margin: 0;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  overflow: hidden;
  background: #fff;

  &:nth-child(5) {
    @media (min-width: 900px) {
      grid-column: 1 / -1;
    }
  }

  @media print {
    break-inside: avoid;
    border-color: #aaa;
    box-shadow: none;

    &:nth-child(5) { grid-column: 1 / -1; }
  }
`;

const SectionTitle = styled.h2`
  display: flex;
  min-height: 45px;
  align-items: center;
  margin: 0;
  padding: 12px 15px;
  background: #f2f4ef;
  font-size: 0.88rem;
`;

const AnswerRow = styled.div`
  display: grid;
  grid-template-columns: minmax(135px, 1fr) minmax(110px, .8fr) auto;
  gap: 10px;
  padding: 11px 14px;
  border-top: 1px solid #ebe9e4;

  &:first-of-type {
    border-top: 0;
  }

  strong {
    font-size: 0.74rem;
    line-height: 1.45;
  }

  span {
    color: var(--color-muted);
    font-size: 0.74rem;
    line-height: 1.55;
    white-space: pre-line;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  @media print {
    grid-template-columns: minmax(120px, 1fr) minmax(100px, .85fr);
    gap: 8px;
    padding: 8px 10px;

    strong, span { font-size: 8pt; }
  }
`;

const EditButton = styled.button`
  align-self: start;
  border: 1px solid var(--color-border);
  border-radius: 9px;
  padding: 5px 8px;
  background: #fafaf8;
  color: var(--color-success);
  font: inherit;
  font-size: 0.72rem;
  font-weight: 750;
  cursor: pointer;

  &:hover {
    border-color: var(--color-success);
    background: #eef4f0;
  }

  &:focus-visible {
    outline: 3px solid rgb(52 116 91 / 16%);
    outline-offset: 2px;
  }

  @media print { display: none; }
`;

const SubmitArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 24px;
  padding: 20px;
  border-radius: 18px;
  background: #edf2ee;

  p {
    margin: 0;
    color: var(--color-muted);
    font-size: 0.8rem;
    line-height: 1.5;
  }

  @media (max-width: 600px) {
    align-items: stretch;
    flex-direction: column;
  }

  @media print { display: none; }
`;

const ErrorMessage = styled.p`
  margin: 14px 0 0;
  color: #a23e2c;
  font-size: 0.82rem;
`;

const BackButton = styled.button`
  min-height: 44px;
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--color-muted);
  font: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    color: var(--color-ink);
  }

  &:focus-visible {
    outline: 3px solid rgb(189 89 59 / 20%);
    outline-offset: 4px;
  }
`;

function yesNo(value) {
  return value ? "Yes" : "No";
}

function formatObject(question, value) {
  if (question.type === "habits") {
    return question.fields
      .map((field) => {
        const answer = value[field.key];
        if (answer === undefined) return null;
        const mainAnswer =
          typeof answer === "boolean" ? yesNo(answer) : answer;
        const followupAnswer = field.followup && value[field.followup.key];
        return `${field.label}: ${mainAnswer}${
          followupAnswer ? ` (${field.followup.label}: ${followupAnswer})` : ""
        }`;
      })
      .filter(Boolean)
      .join("\n");
  }

  return question.rows
    .map((row) => {
      const answer = value[row.key];
      const active = answer?.used ?? answer?.done;
      if (!active) return `${row.label}: No`;

      const details = [
        answer.name,
        answer.duration || answer.sessions,
        `Helped: ${yesNo(answer.helped)}`,
        answer.side_effects === undefined
          ? null
          : `Side effects: ${yesNo(answer.side_effects)}`,
      ].filter(Boolean);
      return `${row.label}: ${details.join(" · ")}`;
    })
    .join("\n");
}

function formatAnswer(question, answers) {
  const value = answers[question.key];

  if (question.type === "yesno_detail") {
    const detail = answers[question.detail_key];
    return detail ? `${yesNo(value)} — ${detail}` : yesNo(value);
  }
  if (["habits", "products", "procedures"].includes(question.type)) {
    return formatObject(question, value);
  }
  if (Array.isArray(value)) return value.length ? value.join(", ") : "None";
  if (typeof value === "boolean") return yesNo(value);
  return String(value);
}


function ReviewPage({
  form,
  answers,
  onBack,
  onEditQuestion,
  onSubmitted,
}) {
  const [status, setStatus] = useState("idle");

  async function handleSubmit() {
    setStatus("submitting");

    try {
      await submitIntake(answers);
      onSubmitted();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <ReviewToolbar>
        <BackButton type="button" onClick={onBack}>
          ← Back to last question
        </BackButton>
        <PrintButton type="button" onClick={() => window.print()}>
          Print / Save as PDF
        </PrintButton>
      </ReviewToolbar>
      <PrintHeading>
        <h1>Hair &amp; Scalp Intake</h1>
        <p>Confidential patient summary · Generated {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date())}</p>
      </PrintHeading>
      <ReviewHeader>
        <h1>Review your answers.</h1>
        <p>Make sure everything feels accurate before sending it to the clinic.</p>
      </ReviewHeader>

      <SectionsGrid>
        {form.sections.map((section) => (
          <Section key={section.id}>
            <SectionTitle>
              {section.id} · {section.title}
            </SectionTitle>
            {section.questions.map((question) => (
              <AnswerRow key={question.key}>
                <strong>{question.question}</strong>
                <span>{formatAnswer(question, answers)}</span>
                <EditButton
                  type="button"
                  aria-label={`Edit: ${question.question}`}
                  onClick={() => onEditQuestion(question.key)}
                >
                  Edit
                </EditButton>
              </AnswerRow>
            ))}
          </Section>
        ))}
      </SectionsGrid>

      <SubmitArea>
        <p>Submitting sends the completed intake securely to the clinic.</p>
        <PrimaryButton
          type="button"
          disabled={status === "submitting"}
          onClick={handleSubmit}
        >
          {status === "submitting" ? "Submitting…" : "Submit my intake"}
        </PrimaryButton>
      </SubmitArea>
      {status === "error" && (
        <ErrorMessage role="alert">
          We couldn’t submit your intake. Your answers are still saved—please try
          again.
        </ErrorMessage>
      )}
    </div>
  );
}

export default ReviewPage;
