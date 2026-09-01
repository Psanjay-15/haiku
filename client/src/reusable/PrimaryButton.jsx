import styled from "styled-components";


const PrimaryButton = styled.button`
  display: inline-flex;
  min-height: 52px;
  align-items: center;
  justify-content: center;
  border: 0;
  gap: 10px;
  border-radius: 14px;
  padding: 0 22px;
  background: var(--color-ink);
  color: white;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 160ms ease,
    background 160ms ease;

  &:hover {
    background: #26332d;
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid rgb(194 84 49 / 30%);
    outline-offset: 3px;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #c8cac5;
    cursor: not-allowed;
    transform: none;
  }
`;

export default PrimaryButton;
