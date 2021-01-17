import React, { FC, FocusEvent } from "react";
import styled from "styled-components";

const InvisibleInputContainer = styled.div`
  .span-input {
    border: none;
    display: inline;
    font-family: inherit;
    font-size: inherit;
    padding: 0;
    width: 100%;

    & {
      -moz-appearance: textfield;
    }
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &:disabled {
      color: inherit;
    }
  }
`;

interface InvisibleInputProps {
  value: number;
  unit?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLSpanElement>) => void;
  disabled?: boolean;
}

const InvisibleInput: FC<InvisibleInputProps> = ({
  value,
  unit,
  onChange,
  onBlur,
  disabled,
}) => {
  const emptyWidth = 3;
  return (
    <InvisibleInputContainer>
      <input
        className="span-input"
        type="number"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        style={{
          width: `${value.toString().length || emptyWidth}ch`,
        }}
        disabled={disabled}
      ></input>
      <span>{unit}</span>
    </InvisibleInputContainer>
  );
};

export default InvisibleInput;
