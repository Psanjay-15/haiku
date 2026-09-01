import { useContext } from "react";

import IntakeContext from "../context/IntakeContext";


function useIntake() {
  const context = useContext(IntakeContext);

  if (!context) {
    throw new Error("useIntake must be used inside IntakeProvider");
  }

  return context;
}

export default useIntake;
