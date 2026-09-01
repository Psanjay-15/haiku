import styled from "styled-components";

import QuestionInput from "./QuestionInput";

const Intro = styled.div`
  margin-bottom: 18px;

  h1 {
    max-width: 680px;
    margin: 10px 0 12px;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(1.8rem, 3.2vw, 2.75rem);
    font-weight: 500;
    letter-spacing: -0.04em;
    line-height: 1.05;
  }

  p {
    margin: 0;
    color: var(--color-muted);
    line-height: 1.6;
  }
`;

const Eyebrow = styled.span`
  color: var(--color-accent);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const Group = styled.section`
  padding: 17px 0;
  border-top: 1px solid #e8e5df;

  &:first-of-type {
    border-top: 0;
  }
`;

const GroupHeading = styled.div`
  margin-bottom: 11px;

  h2 {
    margin: 0 0 5px;
    font-size: 1rem;
  }

  p {
    margin: 0;
    color: var(--color-muted);
    font-size: 0.8rem;
    line-height: 1.5;
  }
`;

const TwoColumns = styled.div`
  display: grid;
  gap: 28px;

  @media (min-width: 680px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Field = styled.div`
  h3 {
    margin: 0 0 10px;
    font-size: 0.88rem;
  }
`;

const SexChoices = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;

const SexChoice = styled.button`
  min-height: 52px;
  border: 1.5px solid
    ${({ $selected }) =>
      $selected ? "var(--color-success)" : "var(--color-border)"};
  border-radius: 13px;
  background: ${({ $selected }) => ($selected ? "#eef4f0" : "#fff")};
  color: var(--color-ink);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid rgb(52 116 91 / 16%);
    outline-offset: 2px;
  }
`;

const SEX_OPTIONS = ["Male", "Female", "Rather not say"];

function SectionAInput({
  section,
  answers,
  patientSex,
  onAnswer,
  onSexChange,
}) {
  const questions = Object.fromEntries(
    section.questions.map((question) => [question.key, question]),
  );

  return (
    <div>
      <Intro>
        <Eyebrow>Part A · Your hair story</Eyebrow>
        <h1>Help us understand what you’re noticing.</h1>
        <p>
          Everything on this page is saved automatically. Your best estimate is
          completely fine.
        </p>
      </Intro>

      <Group>
        <GroupHeading>
          <h2>First, a little about you</h2>
          <p>
            This helps the clinic understand which later questions are relevant.
          </p>
        </GroupHeading>
        <TwoColumns>
          <Field>
            <h3>{questions.age_hair_loss_began.question}</h3>
            <QuestionInput
              question={questions.age_hair_loss_began}
              value={answers.age_hair_loss_began}
              onChange={(value) => onAnswer("age_hair_loss_began", value)}
            />
          </Field>
          <Field>
            <h3>What is your gender?</h3>
            <SexChoices>
              {SEX_OPTIONS.map((option) => (
                <SexChoice
                  key={option}
                  type="button"
                  $selected={patientSex === option}
                  aria-pressed={patientSex === option}
                  onClick={() => onSexChange(option)}
                >
                  {option}
                </SexChoice>
              ))}
            </SexChoices>
          </Field>
        </TwoColumns>
      </Group>

      <Group>
        <GroupHeading>
          <h2>What have you noticed?</h2>
          <p>Choose the answers that come closest to your experience.</p>
        </GroupHeading>
        <TwoColumns>
          <Field>
            <h3>{questions.duration.question}</h3>
            <QuestionInput
              question={questions.duration}
              value={answers.duration}
              onChange={(value) => onAnswer("duration", value)}
            />
          </Field>
          <Field>
            <h3>{questions.family_history.question}</h3>
            <QuestionInput
              question={questions.family_history}
              value={answers.family_history}
              onChange={(value) => onAnswer("family_history", value)}
            />
          </Field>
        </TwoColumns>
      </Group>

      <Group>
        <GroupHeading>
          <h2>{questions.pattern.question}</h2>
          <p>{questions.pattern.helper}</p>
        </GroupHeading>
        <QuestionInput
          question={questions.pattern}
          value={answers.pattern}
          onChange={(value) => onAnswer("pattern", value)}
        />
      </Group>
    </div>
  );
}

export default SectionAInput;
