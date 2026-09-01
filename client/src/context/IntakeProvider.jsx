import { useEffect, useState } from "react";

import { getIntakeForm } from "../services";
import IntakeContext from "./IntakeContext";


const STORAGE_KEY = "hair-scalp-intake";

const initialState = {
  hasStarted: false,
  currentQuestion: 0,
  answers: {},
};

function loadSavedIntake() {
  try {
    const savedIntake = localStorage.getItem(STORAGE_KEY);
    return savedIntake ? JSON.parse(savedIntake) : initialState;
  } catch {
    return initialState;
  }
}


function IntakeProvider({ children }) {
  const [intake, setIntake] = useState(loadSavedIntake);
  const [form, setForm] = useState(null);
  const [formStatus, setFormStatus] = useState("loading");
  const [submissionComplete, setSubmissionComplete] = useState(false);

  useEffect(() => {
    const hasProgress =
      intake.hasStarted ||
      intake.currentQuestion > 0 ||
      Object.keys(intake.answers).length > 0;

    if (hasProgress) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(intake));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [intake]);

  useEffect(() => {
    loadForm();
  }, []);

  async function loadForm() {
    setFormStatus("loading");

    try {
      const formDefinition = await getIntakeForm();
      setForm(formDefinition);
      setFormStatus("ready");
    } catch {
      setFormStatus("error");
    }
  }

  function startIntake() {
    setSubmissionComplete(false);
    setIntake((current) => ({ ...current, hasStarted: true }));
  }

  function returnToWelcome() {
    setIntake((current) => ({ ...current, hasStarted: false }));
  }

  function saveAnswer(key, value) {
    setIntake((current) => ({
      ...current,
      answers: { ...current.answers, [key]: value },
    }));
  }

  function goToNextQuestion() {
    setIntake((current) => ({
      ...current,
      currentQuestion: current.currentQuestion + 1,
    }));
  }

  function goToPreviousQuestion() {
    setIntake((current) => ({
      ...current,
      currentQuestion: Math.max(0, current.currentQuestion - 1),
    }));
  }

  function goToQuestion(questionIndex) {
    setIntake((current) => ({
      ...current,
      currentQuestion: questionIndex,
    }));
  }

  function completeIntake() {
    localStorage.removeItem(STORAGE_KEY);
    setIntake(initialState);
    setSubmissionComplete(true);
  }

  const value = {
    ...intake,
    form,
    formStatus,
    submissionComplete,
    loadForm,
    startIntake,
    returnToWelcome,
    saveAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    completeIntake,
  };

  return (
    <IntakeContext.Provider value={value}>{children}</IntakeContext.Provider>
  );
}

export default IntakeProvider;
