import styled from "styled-components";

import AppShell from "../reusable/AppShell";
import PrimaryButton from "../reusable/PrimaryButton";


const Hero = styled.section`
  display: grid;
  align-items: center;
  gap: 44px;

  @media (min-width: 900px) {
    grid-template-columns: minmax(0, 1.08fr) minmax(380px, 0.78fr);
    gap: clamp(64px, 8vw, 120px);
    padding: 32px 0 72px;
  }
`;

const SubmissionNotice = styled.div`
  margin-bottom: 28px;
  border: 1px solid rgb(52 116 91 / 24%);
  border-radius: 16px;
  padding: 15px 18px;
  background: #edf5f0;
  color: var(--color-success);
  font-size: 0.88rem;
  font-weight: 700;
`;

const Eyebrow = styled.p`
  margin: 0 0 16px;
  color: var(--color-accent);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  max-width: 760px;
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.7rem, 5.6vw, 5.4rem);
  font-weight: 500;
  letter-spacing: -0.052em;
  line-height: 0.96;
`;

const Accent = styled.span`
  color: var(--color-accent);
  font-style: italic;
`;

const Introduction = styled.p`
  max-width: 620px;
  margin: 26px 0 0;
  color: var(--color-muted);
  font-size: clamp(1rem, 1.4vw, 1.16rem);
  line-height: 1.7;
`;

const Details = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 28px 0 32px;
  padding: 0;
  list-style: none;
`;

const Detail = styled.li`
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 9px 13px;
  background: rgb(255 255 255 / 62%);
  color: var(--color-muted);
  font-size: 0.84rem;
  box-shadow: 0 4px 18px rgb(23 33 29 / 3%);
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const PrivacyNote = styled.p`
  max-width: 250px;
  margin: 0;
  color: var(--color-muted);
  font-size: 0.76rem;
  line-height: 1.45;

  @media (max-width: 520px) {
    display: none;
  }
`;

const JourneyCard = styled.aside`
  position: relative;
  overflow: hidden;
  border: 1px solid rgb(222 219 211 / 90%);
  border-radius: 30px;
  padding: clamp(26px, 4vw, 40px);
  background: rgb(255 253 248 / 88%);
  box-shadow: 0 28px 80px rgb(50 54 49 / 11%);

  &::after {
    position: absolute;
    top: -90px;
    right: -80px;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: rgb(189 89 59 / 8%);
    content: "";
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--color-border);
`;

const CardKicker = styled.p`
  margin: 0 0 7px;
  color: var(--color-muted);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
`;

const Time = styled.strong`
  font-family: Georgia, "Times New Roman", serif;
  font-size: 3rem;
  font-weight: 500;
  letter-spacing: -0.05em;
  line-height: 1;
`;

const TimeUnit = styled.span`
  color: var(--color-muted);
  font-size: 0.82rem;
  font-weight: 600;
`;

const JourneyTitle = styled.h2`
  margin: 28px 0 18px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.55rem;
  font-weight: 500;
`;

const JourneyList = styled.ol`
  display: grid;
  gap: 18px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const JourneyItem = styled.li`
  display: grid;
  grid-template-columns: 34px 1fr;
  align-items: start;
  gap: 13px;
`;

const StepNumber = styled.span`
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 10px;
  background: #eef2ed;
  color: var(--color-success);
  font-size: 0.76rem;
  font-weight: 800;
`;

const StepCopy = styled.div`
  strong {
    display: block;
    margin-bottom: 3px;
    font-size: 0.92rem;
  }

  span {
    color: var(--color-muted);
    font-size: 0.82rem;
    line-height: 1.45;
  }
`;


function WelcomePage({ form, onStart, submissionComplete }) {
  const questionCount = form.sections.reduce(
    (total, section) => total + section.questions.length,
    0,
  );

  return (
    <AppShell>
      {submissionComplete && (
        <SubmissionNotice role="status">
          ✓ Your intake was submitted successfully. Your doctor will have it
          before your consultation.
        </SubmissionNotice>
      )}
      <Hero>
        <div>
          <Eyebrow>Prepared care starts here</Eyebrow>
          <Title>
            Help your doctor see the <Accent>whole story.</Accent>
          </Title>
          <Introduction>
            Share what you have noticed about your hair, health, lifestyle, and
            past treatments before your consultation begins.
          </Introduction>

          <Details aria-label="Form details">
            <Detail>{questionCount} simple questions</Detail>
            <Detail>Tap-first answers</Detail>
            <Detail>Progress saved automatically</Detail>
          </Details>

          <ActionRow>
            <PrimaryButton type="button" onClick={onStart}>
              Start my intake <span aria-hidden="true">→</span>
            </PrimaryButton>
            <PrivacyNote>
              Your answers stay on this device until final submission.
            </PrivacyNote>
          </ActionRow>
        </div>

        <JourneyCard>
          <CardTop>
            <div>
              <CardKicker>Time to complete</CardKicker>
              <Time>5</Time> <TimeUnit>minutes</TimeUnit>
            </div>
            <TimeUnit>
              {questionCount} questions · {form.sections.length} sections
            </TimeUnit>
          </CardTop>
          <JourneyTitle>A calmer clinic visit starts before you arrive.</JourneyTitle>
          <JourneyList>
            <JourneyItem>
              <StepNumber>01</StepNumber>
              <StepCopy>
                <strong>Your hair story</strong>
                <span>When it began, what changed, and family history.</span>
              </StepCopy>
            </JourneyItem>
            <JourneyItem>
              <StepNumber>02</StepNumber>
              <StepCopy>
                <strong>Health and lifestyle</strong>
                <span>Only the details that may help your doctor.</span>
              </StepCopy>
            </JourneyItem>
            <JourneyItem>
              <StepNumber>03</StepNumber>
              <StepCopy>
                <strong>Treatments tried</strong>
                <span>What helped, what did not, and any side effects.</span>
              </StepCopy>
            </JourneyItem>
          </JourneyList>
        </JourneyCard>
      </Hero>
    </AppShell>
  );
}

export default WelcomePage;
