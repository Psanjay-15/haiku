import styled from "styled-components";


const Choices = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
`;

const Choice = styled.button`
  min-height: 56px;
  border: 1.5px solid
    ${({ $selected }) => ($selected ? "var(--color-success)" : "var(--color-border)")};
  border-radius: 14px;
  background: ${({ $selected }) => ($selected ? "#eef4f0" : "#fff")};
  color: var(--color-ink);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
`;

const DetailField = styled.label`
  display: block;
  margin-top: 16px;

  span {
    display: block;
    margin-bottom: 8px;
    color: var(--color-muted);
    font-size: 0.78rem;
    font-weight: 700;
  }

  textarea {
    width: 100%;
    min-height: 112px;
    resize: vertical;
    border: 1.5px solid var(--color-border);
    border-radius: 14px;
    padding: 13px;
    outline: none;

    &:focus {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 4px rgb(189 89 59 / 10%);
    }
  }
`;


function YesNoDetailInput({ question, value, detail, onChange, onDetailChange }) {
  return (
    <div>
      <Choices>
        {question.options.map((option) => (
          <Choice
            key={String(option.value)}
            type="button"
            $selected={value === option.value}
            aria-pressed={value === option.value}
            onClick={() => {
              onChange(option.value);
              if (!option.value) {
                onDetailChange(undefined);
              }
            }}
          >
            {option.label}
          </Choice>
        ))}
      </Choices>

      {value === true && (
        <DetailField>
          <span>{question.detail_label}</span>
          <textarea
            maxLength="500"
            placeholder={question.detail_placeholder}
            value={detail || ""}
            onChange={(event) => onDetailChange(event.target.value)}
            autoFocus
          />
        </DetailField>
      )}
    </div>
  );
}

export default YesNoDetailInput;
