import styled from "styled-components";


const HabitList = styled.div`
  display: grid;
  gap: 12px;
`;

const HabitCard = styled.div`
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 16px;
  background: #fff;
`;

const HabitRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;

  @media (max-width: 560px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const HabitLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.4;
`;

const Choices = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

const Choice = styled.button`
  min-height: 38px;
  border: 1px solid
    ${({ $selected }) => ($selected ? "var(--color-success)" : "var(--color-border)")};
  border-radius: 10px;
  padding: 0 13px;
  background: ${({ $selected }) => ($selected ? "#eef4f0" : "#fafaf8")};
  color: var(--color-ink);
  font: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
`;

const Followup = styled.div`
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #ece9e3;

  label {
    display: block;
    margin-bottom: 8px;
    color: var(--color-muted);
    font-size: 0.76rem;
    font-weight: 700;
  }

  input {
    width: 100%;
    min-height: 46px;
    border: 1px solid var(--color-border);
    border-radius: 11px;
    padding: 0 13px;
    outline: none;

    &:focus {
      border-color: var(--color-accent);
    }
  }
`;

const OTHER_PREFIX = "Other: ";


function HabitsInput({ question, value, onChange }) {
  const habits = value || {};

  function updateValue(key, nextValue, followupKey) {
    const nextHabits = { ...habits, [key]: nextValue };

    if (nextValue === false && followupKey) {
      delete nextHabits[followupKey];
    }

    onChange(nextHabits);
  }

  return (
    <HabitList>
      {question.fields.map((field) => {
        const fieldValue = habits[field.key];
        const isCustomFrequency =
          field.allow_other &&
          typeof fieldValue === "string" &&
          fieldValue.startsWith(OTHER_PREFIX);

        return (
          <HabitCard key={field.key}>
            <HabitRow>
              <HabitLabel>{field.label}</HabitLabel>

              {field.type === "yesno" ? (
                <Choices>
                  {question.boolean_options.map((option) => (
                    <Choice
                      key={String(option.value)}
                      type="button"
                      $selected={fieldValue === option.value}
                      aria-pressed={fieldValue === option.value}
                      onClick={() =>
                        updateValue(
                          field.key,
                          option.value,
                          field.followup?.key,
                        )
                      }
                    >
                      {option.label}
                    </Choice>
                  ))}
                </Choices>
              ) : (
                <Choices>
                  {field.options.map((option) => (
                    <Choice
                      key={option}
                      type="button"
                      $selected={fieldValue === option}
                      aria-pressed={fieldValue === option}
                      onClick={() => updateValue(field.key, option)}
                    >
                      {option}
                    </Choice>
                  ))}
                  {field.allow_other && (
                    <Choice
                      type="button"
                      $selected={isCustomFrequency}
                      aria-pressed={isCustomFrequency}
                      onClick={() => updateValue(field.key, OTHER_PREFIX)}
                    >
                      {field.other_label}
                    </Choice>
                  )}
                </Choices>
              )}
            </HabitRow>

            {isCustomFrequency && (
              <Followup>
                <label htmlFor={`${field.key}-other`}>
                  {field.other_prompt}
                </label>
                <input
                  id={`${field.key}-other`}
                  type="text"
                  maxLength="200"
                  value={fieldValue.slice(OTHER_PREFIX.length)}
                  onChange={(event) =>
                    updateValue(field.key, `${OTHER_PREFIX}${event.target.value}`)
                  }
                  autoFocus
                />
              </Followup>
            )}

            {field.followup && fieldValue === true && (
              <Followup>
                <label htmlFor={field.followup.key}>{field.followup.label}</label>
                {field.followup.type === "single" ? (
                  <Choices>
                    {field.followup.options.map((option) => (
                      <Choice
                        key={option}
                        type="button"
                        $selected={habits[field.followup.key] === option}
                        aria-pressed={habits[field.followup.key] === option}
                        onClick={() => updateValue(field.followup.key, option)}
                      >
                        {option}
                      </Choice>
                    ))}
                  </Choices>
                ) : (
                  <input
                    id={field.followup.key}
                    type="text"
                    maxLength="200"
                    value={habits[field.followup.key] || ""}
                    onChange={(event) =>
                      updateValue(field.followup.key, event.target.value)
                    }
                  />
                )}
              </Followup>
            )}
          </HabitCard>
        );
      })}
    </HabitList>
  );
}

export default HabitsInput;
