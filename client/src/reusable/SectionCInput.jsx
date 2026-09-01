import styled from "styled-components";

import HabitsInput from "./HabitsInput";
import QuestionInput from "./QuestionInput";


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

function SectionCInput({ section, answers, onAnswer }) {
  const [events, habits] = section.questions;

  return (
    <div>
      <Intro>
        <Eyebrow>Part C · Lifestyle</Eyebrow>
        <h1>Recent changes and everyday habits.</h1>
        <p>Quick taps are enough. Extra details appear only when needed.</p>
      </Intro>
      <Block>
        <h2>{events.question}</h2><p>{events.helper}</p>
        <QuestionInput question={events} value={answers[events.key]} onChange={(value) => onAnswer(events.key, value)} />
      </Block>
      <Block>
        <h2>{habits.question}</h2><p>{habits.helper}</p>
        <HabitsInput question={habits} value={answers[habits.key]} onChange={(value) => onAnswer(habits.key, value)} />
      </Block>
    </div>
  );
}

export default SectionCInput;
