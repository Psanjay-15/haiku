import styled from "styled-components";


const NumberField = styled.label`
  display: flex;
  max-width: 330px;
  min-height: 68px;
  align-items: center;
  gap: 12px;
  border: 1.5px solid var(--color-border);
  border-radius: 16px;
  padding: 0 18px;
  background: #fff;
  transition: border 150ms ease, box-shadow 150ms ease;

  &:focus-within {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 4px rgb(189 89 59 / 10%);
  }

  input {
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--color-ink);
    font-size: 1.5rem;
    font-weight: 750;
  }

  span {
    flex: 0 0 auto;
    color: var(--color-muted);
    font-size: 0.88rem;
    font-weight: 650;
  }
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(${({ $pattern }) => $pattern ? 3 : 2}, minmax(0, 1fr));
  }
`;

const Option = styled.button`
  display: flex;
  min-height: 58px;
  align-items: center;
  gap: 12px;
  border: 1.5px solid
    ${({ $selected }) => ($selected ? "var(--color-success)" : "var(--color-border)")};
  border-radius: 15px;
  padding: 13px 15px;
  background: ${({ $selected }) => ($selected ? "#eef4f0" : "#fff")};
  color: var(--color-ink);
  text-align: left;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 650;
  cursor: pointer;
  transition: border 150ms ease, background 150ms ease, transform 150ms ease;

  &::before {
    display: grid;
    width: 20px;
    height: 20px;
    flex: 0 0 20px;
    place-items: center;
    border: 1.5px solid
      ${({ $selected }) => ($selected ? "var(--color-success)" : "#c6cac5")};
    border-radius: ${({ $multi }) => ($multi ? "6px" : "50%")};
    background: ${({ $selected }) => ($selected ? "var(--color-success)" : "#fff")};
    color: white;
    content: ${({ $selected }) => ($selected ? '"✓"' : '""')};
    font-size: 0.72rem;
    font-weight: 900;
  }

  &:hover {
    border-color: ${({ $selected }) => ($selected ? "var(--color-success)" : "#adb4ae")};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid rgb(52 116 91 / 16%);
    outline-offset: 2px;
  }
`;

const PatternOption = styled(Option)`
  position: relative;
  min-height: 154px;
  flex-direction: column;
  align-items: stretch;
  gap: 0;
  padding: 0;
  overflow: hidden;

  &::before {
    position: absolute;
    z-index: 1;
    top: 12px;
    right: 12px;
  }
`;

const PatternImage = styled.img`
  width: 100%;
  height: 94px;
  object-fit: contain;
  padding: 7px 26px 0;
  background: #f3eee7;
`;

const PatternCopy = styled.span`
  display: grid;
  gap: 4px;
  padding: 9px 38px 11px 12px;

  strong {
    font-size: 0.8rem;
    line-height: 1.25;
  }

  small {
    color: var(--color-muted);
    font-size: 0.68rem;
    font-weight: 500;
    line-height: 1.4;
  }
`;

const OtherField = styled.label`
  display: block;
  margin-top: 12px;

  span {
    display: block;
    margin-bottom: 7px;
    color: var(--color-muted);
    font-size: 0.78rem;
    font-weight: 700;
  }

  input {
    width: 100%;
    min-height: 52px;
    border: 1.5px solid var(--color-border);
    border-radius: 13px;
    padding: 0 15px;
    outline: 0;
    background: #fff;
    color: var(--color-ink);

    &:focus {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 4px rgb(189 89 59 / 10%);
    }
  }
`;

const OTHER_PREFIX = "Other: ";

const PATTERN_DETAILS = {
  "Receding hairline": ["Moving back around the temples", "/intake-assets/receding-hairline.svg"],
  "Thinning at crown": ["More scalp visible near the crown", "/intake-assets/thinning-crown.svg"],
  "Widening part line": ["The centre or side part looks wider", "/intake-assets/widening-part.svg"],
  "Diffuse thinning": ["Less density across most of the scalp", "/intake-assets/diffuse-thinning.svg"],
  "Patchy loss": ["One or more defined bare patches", "/intake-assets/patchy-loss.svg"],
  "Sudden excessive shedding": ["Much more hair falling than usual", "/intake-assets/excessive-shedding.svg"],
};


function QuestionInput({ question, value, onChange }) {
  if (question.type === "number") {
    return (
      <NumberField>
        <input
          aria-label={question.question}
          type="number"
          inputMode="numeric"
          min={question.minimum}
          max={question.maximum}
          placeholder={question.placeholder}
          value={value ?? ""}
          onChange={(event) => {
            const nextValue = event.target.value;
            onChange(nextValue === "" ? "" : Number(nextValue));
          }}
          autoFocus
        />
        <span>{question.suffix}</span>
      </NumberField>
    );
  }

  const isMulti = question.type === "multi" || question.type === "multi_optional";
  const isPatternQuestion = question.key === "pattern";
  const options = question.options.map((option) => {
    const normalized = typeof option === "string" ? { label: option, value: option } : option;
    const fallback = PATTERN_DETAILS[normalized.value];

    return fallback
      ? { description: fallback[0], image: fallback[1], ...normalized }
      : normalized;
  });
  const selectedValues = isMulti
    ? value || []
    : value === undefined
      ? []
      : [value];
  const otherAnswer = selectedValues.find((answer) =>
    typeof answer === "string" && answer.startsWith(OTHER_PREFIX),
  );
  const isOtherSelected = Boolean(otherAnswer);

  function selectOption(option) {
    if (!isMulti) {
      onChange(option);
      return;
    }

    if (option === question.exclusive_option) {
      onChange(selectedValues.includes(option) ? [] : [option]);
      return;
    }

    const withoutExclusive = selectedValues.filter(
      (answer) => answer !== question.exclusive_option,
    );

    onChange(
      withoutExclusive.includes(option)
        ? withoutExclusive.filter((answer) => answer !== option)
        : [...withoutExclusive, option],
    );
  }

  function toggleOther() {
    const withoutExclusiveAndOther = selectedValues.filter(
      (answer) =>
        answer !== question.exclusive_option && !answer.startsWith(OTHER_PREFIX),
    );

    onChange(
      isOtherSelected
        ? withoutExclusiveAndOther
        : [...withoutExclusiveAndOther, OTHER_PREFIX],
    );
  }

  function changeOtherAnswer(event) {
    const otherText = event.target.value;
    const fixedAnswers = selectedValues.filter(
      (answer) => !answer.startsWith(OTHER_PREFIX),
    );
    onChange([...fixedAnswers, `${OTHER_PREFIX}${otherText}`]);
  }

  return (
    <div>
      <OptionGrid $pattern={isPatternQuestion}>
        {options.map((option) => {
          const OptionComponent = isPatternQuestion ? PatternOption : Option;

          return (
          <OptionComponent
            key={String(option.value)}
            type="button"
            $selected={selectedValues.includes(option.value)}
            $multi={isMulti}
            aria-pressed={selectedValues.includes(option.value)}
            onClick={() => selectOption(option.value)}
          >
            {isPatternQuestion ? (
              <>
                <PatternImage src={option.image} alt="" aria-hidden="true" />
                <PatternCopy>
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </PatternCopy>
              </>
            ) : option.label}
          </OptionComponent>
          );
        })}
        {question.allow_other && (
          <Option
            type="button"
            $selected={isOtherSelected}
            $multi
            aria-pressed={isOtherSelected}
            onClick={toggleOther}
          >
            {question.other_label}
          </Option>
        )}
      </OptionGrid>

      {isOtherSelected && (
        <OtherField>
          <span>{question.other_prompt}</span>
          <input
            type="text"
            maxLength="200"
            placeholder={question.other_placeholder}
            value={otherAnswer.slice(OTHER_PREFIX.length)}
            onChange={changeOtherAnswer}
            autoFocus
          />
        </OtherField>
      )}
    </div>
  );
}

export default QuestionInput;
