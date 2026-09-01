import { useEffect } from "react";
import styled from "styled-components";

import QuestionInput from "./QuestionInput";


const Intro = styled.div`
  margin-bottom: 18px;

  h1 {
    margin: 8px 0 8px;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(1.8rem, 3.2vw, 2.75rem);
    font-weight: 500;
    letter-spacing: -0.04em;
  }

  p { margin: 0; color: var(--color-muted); line-height: 1.5; }
`;

const Eyebrow = styled.span`
  color: var(--color-accent);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const Grid = styled.div`
  display: grid;
  gap: 22px 28px;

  @media (min-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Field = styled.section`
  padding-top: 17px;
  border-top: 1px solid #e8e5df;

  ${({ $wide }) => $wide && `
    @media (min-width: 760px) { grid-column: 1 / -1; }
  `}

  h2 { margin: 0 0 5px; font-size: 0.95rem; }
  p { margin: 0 0 11px; color: var(--color-muted); font-size: 0.76rem; line-height: 1.45; }
`;

const PrivacyNote = styled.p`
  margin: 16px 0 0;
  color: var(--color-muted);
  font-size: 0.72rem;
`;


function SectionBInput({ section, answers, patientSex, onAnswer }) {
  const questions = Object.fromEntries(
    section.questions.map((question) => [question.key, question]),
  );
  const showFemaleQuestions = patientSex !== "Male";
  const diagnosedQuestion = showFemaleQuestions
    ? questions.diagnosed_conditions
    : {
        ...questions.diagnosed_conditions,
        options: questions.diagnosed_conditions.options.filter(
          (option) => option !== "PCOS/PCOD",
        ),
      };

  useEffect(() => {
    if (patientSex !== "Male") return;

    onAnswer("menstrual_cycle", "Not applicable");
    onAnswer("pregnancy_related", "Not applicable");

    if (answers.diagnosed_conditions?.includes("PCOS/PCOD")) {
      onAnswer(
        "diagnosed_conditions",
        answers.diagnosed_conditions.filter((option) => option !== "PCOS/PCOD"),
      );
    }
  }, [answers.diagnosed_conditions, onAnswer, patientSex]);

  const renderQuestion = (question, wide = false) => (
    <Field key={question.key} $wide={wide}>
      <h2>{question.question}</h2>
      <p>{question.helper}</p>
      <QuestionInput
        question={question}
        value={answers[question.key]}
        onChange={(value) => onAnswer(question.key, value)}
      />
    </Field>
  );

  return (
    <div>
      <Intro>
        <Eyebrow>Part B · Health influences</Eyebrow>
        <h1>A few health details that may matter.</h1>
        <p>Select what applies. You can always choose “None” or “Not applicable.”</p>
      </Intro>

      <Grid>
        {renderQuestion(diagnosedQuestion, true)}
        {showFemaleQuestions && renderQuestion(questions.menstrual_cycle)}
        {showFemaleQuestions && renderQuestion(questions.pregnancy_related)}
        {renderQuestion(questions.adult_acne_oily_skin)}
        {renderQuestion(questions.excess_body_facial_hair)}
      </Grid>

      {!showFemaleQuestions && (
        <PrivacyNote>
          Menstrual and pregnancy questions were skipped based on your earlier selection.
        </PrivacyNote>
      )}
    </div>
  );
}

export default SectionBInput;
