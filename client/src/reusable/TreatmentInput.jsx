import styled from "styled-components";


const TreatmentList = styled.div`
  display: grid;
  gap: 10px;
  @media (min-width: 760px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
`;

const TreatmentCard = styled.div`
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 13px;
  ${({ $open }) => $open && `
    @media (min-width: 760px) { grid-column: 1 / -1; }
  `}
  background: #fff;
`;

const TreatmentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 560px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const TreatmentName = styled.strong`
  font-size: 0.9rem;
`;

const Choices = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

const Choice = styled.button`
  min-height: 44px;
  border: 1px solid
    ${({ $selected }) => ($selected ? "var(--color-success)" : "var(--color-border)")};
  border-radius: 10px;
  padding: 0 12px;
  background: ${({ $selected }) => ($selected ? "#eef4f0" : "#fafaf8")};
  color: var(--color-ink);
  font: inherit;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
`;

const Details = styled.div`
  display: grid;
  gap: 15px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ece9e3;
`;

const DetailRow = styled.div`
  display: grid;
  grid-template-columns: minmax(120px, 0.6fr) 1fr;
  align-items: center;
  gap: 14px;

  > span {
    color: var(--color-muted);
    font-size: 0.76rem;
    font-weight: 700;
  }

  input {
    min-height: 42px;
    border: 1px solid var(--color-border);
    border-radius: 10px;
    padding: 0 12px;
    outline: none;

    &:focus {
      border-color: var(--color-accent);
    }
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;


function TreatmentInput({ question, value, onChange }) {
  const treatments = value || {};
  const isProduct = question.type === "products";
  const flagKey = isProduct ? "used" : "done";

  function updateRow(rowKey, updates) {
    onChange({
      ...treatments,
      [rowKey]: {
        ...treatments[rowKey],
        ...updates,
      },
    });
  }

  function setUsed(rowKey, selected) {
    onChange({
      ...treatments,
      [rowKey]: selected
        ? { ...treatments[rowKey], [flagKey]: true }
        : { [flagKey]: false },
    });
  }

  return (
    <TreatmentList>
      {question.rows.map((row) => {
        const rowValue = treatments[row.key] || {};
        const selected = rowValue[flagKey];

        return (
          <TreatmentCard key={row.key} $open={selected === true}>
            <TreatmentHeader>
              <TreatmentName>{row.label}</TreatmentName>
              <Choices>
                {question.status_options.map((option) => (
                  <Choice
                    key={String(option.value)}
                    type="button"
                    $selected={selected === option.value}
                    aria-pressed={selected === option.value}
                    onClick={() => setUsed(row.key, option.value)}
                  >
                    {option.label}
                  </Choice>
                ))}
              </Choices>
            </TreatmentHeader>

            {selected === true && (
              <Details>
                {row.requires_name && (
                  <DetailRow>
                    <span>{row.name_label}</span>
                    <input
                      type="text"
                      maxLength="200"
                      placeholder={row.name_placeholder}
                      value={rowValue.name || ""}
                      onChange={(event) =>
                        updateRow(row.key, { name: event.target.value })
                      }
                    />
                  </DetailRow>
                )}

                <DetailRow>
                  <span>
                    {isProduct ? question.duration_label : question.sessions_label}
                  </span>
                  <Choices>
                    {(isProduct
                      ? question.duration_options
                      : question.session_options
                    ).map((option) => {
                      const detailKey = isProduct ? "duration" : "sessions";
                      return (
                        <Choice
                          key={option}
                          type="button"
                          $selected={rowValue[detailKey] === option}
                          aria-pressed={rowValue[detailKey] === option}
                          onClick={() =>
                            updateRow(row.key, { [detailKey]: option })
                          }
                        >
                          {option}
                        </Choice>
                      );
                    })}
                  </Choices>
                </DetailRow>

                <DetailRow>
                  <span>{question.helped_label}</span>
                  <Choices>
                    {question.boolean_options.map((option) => (
                      <Choice
                        key={String(option.value)}
                        type="button"
                        $selected={rowValue.helped === option.value}
                        aria-pressed={rowValue.helped === option.value}
                        onClick={() =>
                          updateRow(row.key, { helped: option.value })
                        }
                      >
                        {option.label}
                      </Choice>
                    ))}
                  </Choices>
                </DetailRow>

                {isProduct && (
                  <DetailRow>
                    <span>{question.side_effects_label}</span>
                    <Choices>
                      {question.boolean_options.map((option) => (
                        <Choice
                          key={String(option.value)}
                          type="button"
                          $selected={rowValue.side_effects === option.value}
                          aria-pressed={rowValue.side_effects === option.value}
                          onClick={() =>
                            updateRow(row.key, { side_effects: option.value })
                          }
                        >
                          {option.label}
                        </Choice>
                      ))}
                    </Choices>
                  </DetailRow>
                )}
              </Details>
            )}
          </TreatmentCard>
        );
      })}
    </TreatmentList>
  );
}

export default TreatmentInput;
