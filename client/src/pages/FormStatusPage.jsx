import styled from "styled-components";

import AppShell from "../reusable/AppShell";
import PrimaryButton from "../reusable/PrimaryButton";


const StatusCard = styled.div`
  max-width: 560px;
  margin: 100px auto 0;
  border: 1px solid var(--color-border);
  border-radius: 24px;
  padding: 38px;
  background: var(--color-surface);
  text-align: center;
  box-shadow: 0 24px 70px rgb(38 45 41 / 8%);

  h1 {
    margin: 0 0 12px;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 2rem;
    font-weight: 500;
  }

  p {
    margin: 0 0 24px;
    color: var(--color-muted);
    line-height: 1.6;
  }
`;

const Loader = styled.div`
  width: 32px;
  height: 32px;
  margin: 0 auto 20px;
  border: 3px solid #e1e3de;
  border-top-color: var(--color-success);
  border-radius: 50%;
  animation: spin 700ms linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;


function FormStatusPage({ status, onRetry }) {
  const loading = status === "loading";

  return (
    <AppShell>
      <StatusCard role={loading ? "status" : "alert"}>
        {loading ? (
          <>
            <Loader aria-hidden="true" />
            <h1>Preparing your intake…</h1>
            <p>We’re loading the latest questions from the clinic.</p>
          </>
        ) : (
          <>
            <h1>We couldn’t load the intake.</h1>
            <p>Check your connection and try again. Your saved answers are safe.</p>
            <PrimaryButton type="button" onClick={onRetry}>
              Try again
            </PrimaryButton>
          </>
        )}
      </StatusCard>
    </AppShell>
  );
}

export default FormStatusPage;
