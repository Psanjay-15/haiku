import styled from "styled-components";

import QuestionInput from "./QuestionInput";


const Intro = styled.div`
  margin-bottom: 20px;
  h1 { margin: 8px 0; font-family: Georgia, serif; font-size: clamp(1.9rem, 3.4vw, 2.9rem); font-weight: 500; letter-spacing: -.04em; }
  p { margin: 0; color: var(--color-muted); line-height: 1.5; }
`;
const Eyebrow = styled.span`
  color: var(--color-accent); font-size: .76rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
`;
const Block = styled.section`
  padding: 22px 0; border-top: 1px solid #e8e5df;
  h2 { margin: 0 0 6px; font-size: 1rem; }
  > p { margin: 0 0 14px; color: var(--color-muted); font-size: .78rem; line-height: 1.5; }
`;
const SampleGrid = styled.div`
  display: grid; gap: 10px;
  @media (min-width: 620px) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
`;
const SampleCard = styled.button`
  display: flex; min-height: 112px; align-items: center; gap: 14px; border: 1.5px solid
  ${({ $selected }) => $selected ? "var(--color-success)" : "var(--color-border)"}; border-radius: 17px;
  padding: 16px; background: ${({ $selected }) => $selected ? "#eef4f0" : "#fff"}; color: var(--color-ink);
  text-align: left; font: inherit; cursor: pointer;
  &:focus-visible { outline: 3px solid rgb(52 116 91 / 16%); outline-offset: 2px; }
`;
const SampleIcon = styled.span`
  display: grid; width: 48px; height: 58px; flex: 0 0 48px; place-items: center;
  border-radius: 50% 50% 50% 12%; transform: rotate(-45deg); background: ${({ $blood }) => $blood ? "#f7ded8" : "#dcebe8"};
  color: ${({ $blood }) => $blood ? "#a94535" : "var(--color-success)"}; font-size: .72rem; font-weight: 900;
  span { transform: rotate(45deg); }
`;
const SampleCopy = styled.span`
  display: grid; gap: 4px;
  strong { font-size: .9rem; }
  small { color: var(--color-muted); font-size: .72rem; line-height: 1.4; }
`;
const ConsentBox = styled.div`
  border: 1px solid var(--color-border); border-radius: 18px; padding: 18px; background: #faf9f5;
`;
const ConsentNote = styled.p`
  margin: 12px 0 0 !important; font-size: .72rem !important;
`;

const SAMPLE_DETAILS = {
  Saliva: ["SAL", "A simple saliva collection", false],
  Blood: ["BLD", "Collected by clinic staff", true],
  Either: ["ANY", "The clinic can recommend one", false],
};


function SectionEInput({ section, answers, onAnswer }) {
  const [sample, consent] = section.questions;

  return (
    <div>
      <Intro>
        <Eyebrow>Part E · Your choice</Eyebrow>
        <h1>Two final choices.</h1>
        <p>Your selections are recorded exactly as you provide them.</p>
      </Intro>

      <Block>
        <h2>{sample.question}</h2><p>{sample.helper}</p>
        <SampleGrid>
          {sample.options.map((option) => {
            const [mark, description, blood] = SAMPLE_DETAILS[option];
            const selected = answers.sample_type === option;
            return (
              <SampleCard key={option} type="button" $selected={selected} aria-pressed={selected} onClick={() => onAnswer("sample_type", option)}>
                <SampleIcon $blood={blood}><span>{mark}</span></SampleIcon>
                <SampleCopy><strong>{option}</strong><small>{description}</small></SampleCopy>
              </SampleCard>
            );
          })}
        </SampleGrid>
      </Block>

      <Block>
        <ConsentBox>
          <h2>{consent.question}</h2>
          <p>{consent.helper}</p>
          <QuestionInput question={consent} value={answers.consent} onChange={(value) => onAnswer("consent", value)} />
          <ConsentNote>You can choose No. Your choice will not be inferred or selected for you.</ConsentNote>
        </ConsentBox>
      </Block>
    </div>
  );
}

export default SectionEInput;
