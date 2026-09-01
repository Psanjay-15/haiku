import styled from "styled-components";

import TreatmentInput from "./TreatmentInput";
import YesNoDetailInput from "./YesNoDetailInput";


const Intro = styled.div`
  margin-bottom: 17px;
  h1 { margin: 8px 0; font-family: Georgia, serif; font-size: clamp(1.8rem, 3.2vw, 2.7rem); font-weight: 500; letter-spacing: -.04em; }
  p { margin: 0; color: var(--color-muted); }
`;
const Eyebrow = styled.span`
  color: var(--color-accent); font-size: .76rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
`;
const Block = styled.section`
  padding: 17px 0; border-top: 1px solid #e8e5df;
  h2 { margin: 0 0 5px; font-size: .98rem; }
  > p { margin: 0 0 12px; color: var(--color-muted); font-size: .76rem; }
`;
const NoneButton = styled.button`
  min-height: 40px; margin: 0 0 10px; border: 1px solid var(--color-border); border-radius: 11px;
  padding: 0 14px; background: #fafaf8; color: var(--color-success); font: inherit; font-size: .76rem;
  font-weight: 750; cursor: pointer;
`;

function SectionDInput({ section, answers, onAnswer }) {
  const [products, procedures, sideEffects] = section.questions;

  return (
    <div>
      <Intro>
        <Eyebrow>Part D · Treatments</Eyebrow>
        <h1>What have you already tried?</h1>
        <p>Mark each item Used or No. Only used treatments ask for details.</p>
      </Intro>
      {[products, procedures].map((question) => (
        <Block key={question.key}>
          <h2>{question.question}</h2><p>{question.helper}</p>
          <NoneButton
            type="button"
            onClick={() => onAnswer(
              question.key,
              Object.fromEntries(
                question.rows.map((row) => [
                  row.key,
                  { [question.type === "products" ? "used" : "done"]: false },
                ]),
              ),
            )}
          >
            None of these
          </NoneButton>
          <TreatmentInput question={question} value={answers[question.key]} onChange={(value) => onAnswer(question.key, value)} />
        </Block>
      ))}
      <Block>
        <h2>{sideEffects.question}</h2><p>{sideEffects.helper}</p>
        <YesNoDetailInput
          question={sideEffects}
          value={answers[sideEffects.key]}
          detail={answers[sideEffects.detail_key]}
          onChange={(value) => onAnswer(sideEffects.key, value)}
          onDetailChange={(value) => onAnswer(sideEffects.detail_key, value)}
        />
      </Block>
    </div>
  );
}

export default SectionDInput;
