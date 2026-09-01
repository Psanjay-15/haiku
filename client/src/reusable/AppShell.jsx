import styled from "styled-components";


const Shell = styled.main`
  width: min(100% - 32px, 1240px);
  min-height: 100svh;
  margin: 0 auto;
  padding: 24px 0 48px;

  @media (min-width: 768px) {
    width: min(100% - 72px, 1240px);
    padding-top: 32px;
  }

  @media print {
    width: 100%;
    min-height: 0;
    margin: 0;
    padding: 0;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media print { display: none; }
`;

const Brand = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--color-ink);
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.03em;
`;

const BrandMark = styled.span`
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 10px;
  background: linear-gradient(145deg, var(--color-accent), #d37658);
  color: white;
  font-size: 0.75rem;
`;

const SecureNote = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--color-muted);
  font-size: 0.78rem;
  font-weight: 650;

  &::before {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--color-success);
    content: "";
    box-shadow: 0 0 0 4px rgb(52 116 91 / 10%);
  }

  @media (max-width: 520px) {
    display: none;
  }
`;

const Content = styled.div`
  margin-top: 44px;

  @media (min-width: 768px) {
    margin-top: 64px;
  }

  @media print { margin-top: 0; }
`;


function AppShell({ children }) {
  return (
    <Shell>
      <Header>
        <Brand aria-label="Hair and Scalp Intake">
          <BrandMark aria-hidden="true">HS</BrandMark>
          Hair &amp; Scalp Intake
        </Brand>
        <SecureNote>
          <span>Private by design</span>
        </SecureNote>
      </Header>
      <Content>{children}</Content>
    </Shell>
  );
}

export default AppShell;
