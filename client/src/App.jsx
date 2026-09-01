import useIntake from "./hooks/useIntake";
import IntakePage from "./pages/IntakePage";
import FormStatusPage from "./pages/FormStatusPage";
import WelcomePage from "./pages/WelcomePage";


function App() {
  const {
    form,
    formStatus,
    hasStarted,
    loadForm,
    startIntake,
    submissionComplete,
  } = useIntake();

  if (formStatus !== "ready") {
    return <FormStatusPage status={formStatus} onRetry={loadForm} />;
  }

  if (hasStarted) {
    return <IntakePage />;
  }

  return (
    <WelcomePage
      form={form}
      onStart={startIntake}
      submissionComplete={submissionComplete}
    />
  );
}

export default App;
