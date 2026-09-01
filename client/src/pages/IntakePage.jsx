import { useState } from "react";
import styled from "styled-components";

import useIntake from "../hooks/useIntake";
import AppShell from "../reusable/AppShell";
import HabitsInput from "../reusable/HabitsInput";
import PrimaryButton from "../reusable/PrimaryButton";
import QuestionInput from "../reusable/QuestionInput";
import TreatmentInput from "../reusable/TreatmentInput";
import YesNoDetailInput from "../reusable/YesNoDetailInput";
import ReviewPage from "./ReviewPage";


const Workspace = styled.section`
  display: grid;
  align-items: start;
  gap: 28px;

  @media (min-width: 900px) {
    grid-template-columns: 270px minmax(0, 740px);
    justify-content: center;
    gap: 44px;
  }
`;

const Sidebar = styled.aside`
  border: 1px solid var(--color-border);
  border-radius: 22px;
  padding: 22px;
  background: rgb(255 253 248 / 72%);

  @media (max-width: 899px) {
    padding: 16px;
  }
`;

const ProgressTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: var(--color-muted);
  font-size: 0.78rem;
  font-weight: 700;
`;

const ProgressTrack = styled.div`
  height: 7px;
  margin-top: 12px;
  overflow: hidden;
  border-radius: 999px;
  background: #e3e2dc;
`;

const ProgressValue = styled.div`
  width: ${({ $progress }) => `${$progress}%`};
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--color-success), #5b927c);
  transition: width 220ms ease;
`;

const SectionList = styled.ol`
  display: grid;
  gap: 8px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;

  @media (max-width: 899px) {
    display: none;
  }
`;

const SectionItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 11px;
  padding: 10px;
  background: ${({ $active }) => ($active ? "#eef2ed" : "transparent")};
  color: ${({ $active }) => ($active ? "var(--color-ink)" : "var(--color-muted)")};
  font-size: 0.8rem;
  font-weight: ${({ $active }) => ($active ? 750 : 550)};
`;

const SectionLetter = styled.span`
  display: grid;
  width: 26px;
  height: 26px;
  place-items: center;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "var(--color-success)" : "#e7e6e1")};
  color: ${({ $active }) => ($active ? "white" : "var(--color-muted)")};
  font-size: 0.7rem;
  font-weight: 800;
`;

const QuestionCard = styled.div`
  border: 1px solid var(--color-border);
  border-radius: 26px;
  padding: clamp(24px, 5vw, 48px);
  background: var(--color-surface);
  box-shadow: 0 24px 70px rgb(38 45 41 / 9%);
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
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

const QuestionNumber = styled.p`
  margin: 34px 0 11px;
  color: var(--color-accent);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  max-width: 650px;
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2rem, 4.2vw, 3.35rem);
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 1.05;
`;

const SupportingText = styled.p`
  margin: 14px 0 30px;
  color: var(--color-muted);
  font-size: 0.9rem;
  line-height: 1.6;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 34px;
  padding-top: 24px;
  border-top: 1px solid #e8e5df;
`;

const SavedNote = styled.span`
  color: var(--color-muted);
  font-size: 0.75rem;

  @media (max-width: 520px) {
    display: none;
  }
`;

const OTHER_PREFIX = "Other: ";

function isAnswerComplete(question, answer, answers) {
  if (question.type === "number") {
    return (
      Number.isInteger(answer) &&
      answer >= question.minimum &&
      answer <= question.maximum
    );
  }

  if (["single", "yesno", "consent"].includes(question.type)) {
    return answer !== undefined && answer !== null && answer !== "";
  }

  if (question.type === "multi_optional") {
    if (!answer) return true;
  }

  if (question.type === "yesno_detail") {
    if (typeof answer !== "boolean") return false;
    return !answer || Boolean(answers[question.detail_key]?.trim());
  }

  if (question.type === "habits") {
    if (!answer) return false;

    return question.fields.every((field) => {
      const fieldAnswer = answer[field.key];
      const mainAnswerComplete =
        field.type === "yesno"
          ? typeof fieldAnswer === "boolean"
          : Boolean(fieldAnswer && !fieldAnswer.endsWith?.(OTHER_PREFIX));

      if (!mainAnswerComplete) return false;
      if (!field.followup || fieldAnswer !== true) return true;
      return Boolean(answer[field.followup.key]?.toString().trim());
    });
  }

  if (["products", "procedures"].includes(question.type)) {
    if (!answer) return false;
    const isProduct = question.type === "products";
    const flagKey = isProduct ? "used" : "done";

    return question.rows.every((row) => {
      const rowAnswer = answer[row.key];
      if (!rowAnswer || typeof rowAnswer[flagKey] !== "boolean") return false;
      if (!rowAnswer[flagKey]) return true;

      if (row.requires_name && !rowAnswer.name?.trim()) return false;
      if (!(rowAnswer.duration || rowAnswer.sessions)) return false;
      if (typeof rowAnswer.helped !== "boolean") return false;
      return !isProduct || typeof rowAnswer.side_effects === "boolean";
    });
  }

  if (!Array.isArray(answer)) {
    return false;
  }

  if (answer.length === 0) return question.type === "multi_optional";

  const otherAnswer = answer.find((item) => item.startsWith(OTHER_PREFIX));
  return !otherAnswer || Boolean(otherAnswer.slice(OTHER_PREFIX.length).trim());
}


function IntakePage() {
  const {
    answers,
    completeIntake,
    currentQuestion,
    form,
    returnToWelcome,
    saveAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
  } = useIntake();
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);

  const questions = form.sections.flatMap((section) =>
    section.questions.map((question) => ({
      ...question,
      section_id: section.id,
      section_title: section.short_title,
    })),
  );
  const question = questions[currentQuestion];
  const reviewMode = !question;
  const completedQuestions = Math.min(currentQuestion, questions.length);
  const progress = Math.max(2, (completedQuestions / questions.length) * 100);
  const activeSectionIndex = question
    ? form.sections.findIndex((section) => section.id === question.section_id)
    : form.sections.length - 1;

  function handleBack() {
    if (currentQuestion === 0) {
      returnToWelcome();
      return;
    }

    goToPreviousQuestion();
  }

  function handleContinue() {
    if (question.type === "multi_optional" && !answers[question.key]) {
      saveAnswer(question.key, []);
    }

    if (currentQuestion === editingQuestionIndex) {
      setEditingQuestionIndex(null);
      goToQuestion(questions.length);
      return;
    }

    goToNextQuestion();
  }

  function handleEditQuestion(questionKey) {
    const questionIndex = questions.findIndex(
      (item) => item.key === questionKey,
    );

    setEditingQuestionIndex(questionIndex);
    goToQuestion(questionIndex);
  }

  function handleReviewBack() {
    setEditingQuestionIndex(null);
    goToPreviousQuestion();
  }

  function renderQuestionInput() {
    if (question.type === "habits") {
      return (
        <HabitsInput
          question={question}
          value={answers[question.key]}
          onChange={(value) => saveAnswer(question.key, value)}
        />
      );
    }

    if (["products", "procedures"].includes(question.type)) {
      return (
        <TreatmentInput
          question={question}
          value={answers[question.key]}
          onChange={(value) => saveAnswer(question.key, value)}
        />
      );
    }

    if (question.type === "yesno_detail") {
      return (
        <YesNoDetailInput
          question={question}
          value={answers[question.key]}
          detail={answers[question.detail_key]}
          onChange={(value) => saveAnswer(question.key, value)}
          onDetailChange={(value) => saveAnswer(question.detail_key, value)}
        />
      );
    }

    return (
      <QuestionInput
        question={question}
        value={answers[question.key]}
        onChange={(value) => saveAnswer(question.key, value)}
      />
    );
  }

  return (
    <AppShell>
      <Workspace>
        <Sidebar>
          <ProgressTop>
            <span>Your progress</span>
            <span>{completedQuestions} of {questions.length}</span>
          </ProgressTop>
          <ProgressTrack aria-hidden="true">
            <ProgressValue $progress={progress} />
          </ProgressTrack>
          <SectionList aria-label="Intake sections">
            {form.sections.map((section, index) => (
              <SectionItem key={section.id} $active={index === activeSectionIndex}>
                <SectionLetter $active={index === activeSectionIndex}>
                  {section.id}
                </SectionLetter>
                {section.short_title}
              </SectionItem>
            ))}
          </SectionList>
        </Sidebar>

        <QuestionCard aria-live="polite">
          {!reviewMode && (
            <BackButton type="button" onClick={handleBack}>
              <span aria-hidden="true">←</span> Back
            </BackButton>
          )}

          {reviewMode ? (
            <ReviewPage
              form={form}
              answers={answers}
              onBack={handleReviewBack}
              onEditQuestion={handleEditQuestion}
              onSubmitted={completeIntake}
            />
          ) : (
            <>
              <QuestionNumber>
                Question {question.number} of {questions.length} · {question.section_title}
              </QuestionNumber>
              <Title>{question.question}</Title>
              <SupportingText>{question.helper}</SupportingText>

              {renderQuestionInput()}

              <Actions>
                <SavedNote>Saved automatically on this device</SavedNote>
                <PrimaryButton
                  type="button"
                  disabled={
                    !isAnswerComplete(question, answers[question.key], answers)
                  }
                  onClick={handleContinue}
                >
                  Continue <span aria-hidden="true">→</span>
                </PrimaryButton>
              </Actions>
            </>
          )}
        </QuestionCard>
      </Workspace>
    </AppShell>
  );
}

export default IntakePage;
