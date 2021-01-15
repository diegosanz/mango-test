import React, { FC, useEffect, useState } from "react";
import InvisibleInput from "../invisible-input/InvisibleInput";
import styled from "styled-components";
import RangeControl from "../range-control/RangeControl";

const RangeStyles = styled.div`
  .range {
    display: flex;

    &__boundaries {
      max-width: 100%;
    }

    &__bar {
      flex-grow: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;

      &__control {
        position: absolute;
      }

      &__rail {
        border-radius: 5px;
        height: 5px;
        background-color: #000;
      }
    }
  }
`;

interface RangeProps {
  values: number[] | { min: number; max: number };
}

const Range: FC<RangeProps> = ({ values }) => {
  const [rangeState, setRangeState] = useState<{
    inputEditable: boolean;
    limits: { min: number; max: number };
    values: number[];
  }>({
    inputEditable: false,
    limits: { min: 0, max: 0 },
    values: [],
  });

  const [value, setValue] = useState<{
    min: number;
    max: number;
    lastActiveControl: "MIN" | "MAX";
  }>({
    min: 0,
    max: 0,
    lastActiveControl: "MIN",
  });

  useEffect(() => {
    if (Array.isArray(values)) {
      const limitsSorted = values.sort((a, b) => a - b);
      setRangeState({
        inputEditable: false,
        limits: {
          min: limitsSorted[0],
          max: limitsSorted[limitsSorted.length - 1],
        },
        values: limitsSorted,
      });
    } else if (!isNaN(values.max) && !isNaN(values.min)) {
      // Validate that in fact `min` is minor than `max`
      const min = Math.min(values.min, values.max);
      const max = Math.max(values.min, values.max);
      let steps: number[] = [];

      for (let i = min; i <= max; i++) {
        steps = [...steps, i];
      }

      setRangeState({
        inputEditable: true,
        limits: {
          min: values.min,
          max: values.max,
        },
        values: steps,
      });
    }
  }, [values]);

  return (
    <RangeStyles>
      <div className="range">
        <InvisibleInput
          value={rangeState?.limits.min}
          onChange={(ev) => console.log(ev)}
        />
        <div className="range__bar">
          <RangeControl
            className="range__bar__control m-min"
            style={
              value.lastActiveControl === "MIN" ? { zIndex: 1 } : { zIndex: 0 }
            }
          />

          <RangeControl
            className="range__bar__control m-max"
            style={
              value.lastActiveControl === "MAX" ? { zIndex: 1 } : { zIndex: 0 }
            }
          />

          <div className="range__bar__rail"></div>
        </div>
        <InvisibleInput
          value={rangeState?.limits.max}
          onChange={(ev) => console.log(ev)}
        />
      </div>
    </RangeStyles>
  );
};

export default Range;
