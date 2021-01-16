import React, { FC, useEffect, useState, useRef } from "react";
import InvisibleInput from "../invisible-input/InvisibleInput";
import styled from "styled-components";
import RangeControl from "../range-control/RangeControl";
import { generatePercentages } from "../../../misc/utils/value-percent-generator";
import { RangeValue } from "../../../misc/models/RangeValue";
import {
  closestRangeValueByPercentage,
  closestRangeValueByValue,
} from "../../../misc/utils/closestRangeValue";

enum RangeControls {
  MIN,
  MAX,
}

const RangeStyles = styled.div`
  .range {
    display: flex;
    user-select: none;

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
  options: number[] | { min: number; max: number };
  value?: { min: number; max: number };
  onChange?: (e: { min: number; max: number }) => void;
}

interface RangeState {
  /** Tells if user can edit max and min inputs */
  inputEditable: boolean;
  limits: { min: number; max: number };
  options: RangeValue[];
  lastActiveControl: RangeControls;
  released: boolean;
  minPos: number;
  maxPos: number;
}

const Range: FC<RangeProps> = ({ options, value, onChange }) => {
  const rangeBarRef = useRef<HTMLDivElement>(null);

  const [rangeState, setRangeState] = useState<RangeState>({
    inputEditable: false,
    limits: { min: 0, max: 0 },
    options: [],
    lastActiveControl: RangeControls.MIN,
    released: true,
    minPos: 0,
    maxPos: 100,
  });

  const [val, setVal] = useState<{ min: number; max: number }>({
    min: 0,
    max: 0,
  });

  useEffect(() => {
    let rangeStateTemp: RangeState = {
      inputEditable: false,
      limits: { min: 0, max: 0 },
      options: [],
      lastActiveControl: RangeControls.MIN,
      released: true,
      minPos: 0,
      maxPos: 100,
    };

    if (Array.isArray(options)) {
      rangeStateTemp = {
        ...rangeStateTemp,
        options: generatePercentages(options),
      };
    } else if (!isNaN(options.max) && !isNaN(options.min)) {
      // Validate that in fact `min` is minor than `max`
      const min = Math.min(options.min, options.max);
      const max = Math.max(options.min, options.max);
      let steps: number[] = [];

      for (let i = min; i <= max; i++) {
        steps = [...steps, i];
      }

      rangeStateTemp = {
        ...rangeStateTemp,
        options: generatePercentages(steps),
      };
    }

    const min = value?.min || rangeState.limits.min;
    const max = value?.max || rangeState.limits.max;

    setVal({
      min,
      max,
    });

    setRangeState({
      ...rangeStateTemp,
      limits: {
        min: rangeStateTemp.options[0].value,
        max: rangeStateTemp.options[rangeStateTemp.options.length - 1].value,
      },
      maxPos: closestRangeValueByValue(max, rangeStateTemp.options).percent,
      minPos: closestRangeValueByValue(min, rangeStateTemp.options).percent,
    });
  }, [options, value]);

  const onStartMoving = (el: RangeControls) => {
    setRangeState({
      ...rangeState,
      lastActiveControl: el,
      released: false,
    });
  };

  const onMoving = (
    ev:
      | React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
      | React.TouchEvent<HTMLDivElement>
  ) => {
    if (!rangeState.released) {
      if (rangeBarRef.current) {
        const leftSpace = rangeBarRef.current.offsetLeft;
        const rangeWidth = rangeBarRef.current.clientWidth;
        const clientX: number =
          ev.nativeEvent instanceof TouchEvent
            ? (ev as any).touches[0].clientX
            : ev.nativeEvent instanceof MouseEvent
            ? (ev as any).clientX
            : 0;

        const percentajeReal = 100 / (rangeWidth / (clientX - leftSpace));
        let percentaje = percentajeReal;
        if (percentajeReal > 100) {
          percentaje = 100;
        } else if (percentajeReal < 0) {
          percentaje = 0;
        }

        if (rangeState.lastActiveControl === RangeControls.MIN) {
          const minValue = closestRangeValueByPercentage(
            rangeState.minPos,
            rangeState.options
          );

          setRangeState({
            ...rangeState,
            minPos: percentaje,
          });
          setVal({
            ...val,
            min: minValue.value,
          });
        } else if (rangeState.lastActiveControl === RangeControls.MAX) {
          const maxValue = closestRangeValueByPercentage(
            rangeState.maxPos,
            rangeState.options
          );

          setRangeState({
            ...rangeState,
            maxPos: percentaje,
          });
          setVal({
            ...val,
            max: maxValue.value,
          });
        }
      }
    }
  };

  const onStopMoving = () => {
    const minValue = closestRangeValueByPercentage(
      rangeState.minPos,
      rangeState.options
    );
    const maxValue = closestRangeValueByPercentage(
      rangeState.maxPos,
      rangeState.options
    );

    setRangeState({
      ...rangeState,
      released: true,
    });

    setVal({
      min: minValue.value,
      max: maxValue.value,
    });

    emitValue({
      min: minValue.value,
      max: maxValue.value,
    });
  };

  const updateValue = () => {
    const minValue = closestRangeValueByPercentage(
      rangeState.minPos,
      rangeState.options
    );
    const maxValue = closestRangeValueByPercentage(
      rangeState.maxPos,
      rangeState.options
    );

    setRangeState({
      ...rangeState,
      released: true,
    });

    setVal({
      min: minValue.value,
      max: maxValue.value,
    });

    emitValue({
      min: minValue.value,
      max: maxValue.value,
    });
  };

  const emitValue = (val: { min?: number; max?: number }) => {
    if (onChange) {
      onChange({
        min: val.min === undefined ? rangeState.limits.min : val.min,
        max: val.max === undefined ? rangeState.limits.max : val.max,
      });
    }
  };

  return (
    <RangeStyles>
      <div className="range">
        <InvisibleInput value={val.min} onChange={(ev) => console.log(ev)} />
        <div
          className="range__bar"
          ref={rangeBarRef}
          onMouseMove={(ev) => {
            onMoving(ev);
          }}
          onTouchMove={(ev) => {
            onMoving(ev);
          }}
          onMouseUp={onStopMoving}
          onTouchEnd={onStopMoving}
          onTouchCancel={onStopMoving}
        >
          <RangeControl
            onMouseDown={() => {
              onStartMoving(RangeControls.MIN);
            }}
            onTouchStart={() => {
              onStartMoving(RangeControls.MIN);
            }}
            className="range__bar__control m-min"
            style={{
              zIndex:
                rangeState.lastActiveControl === RangeControls.MIN ? 1 : 0,
              left: `${rangeState.minPos}%`,
            }}
          />

          <RangeControl
            onMouseDown={() => {
              onStartMoving(RangeControls.MAX);
            }}
            onTouchStart={() => {
              onStartMoving(RangeControls.MAX);
            }}
            className="range__bar__control m-max"
            style={{
              zIndex:
                rangeState.lastActiveControl === RangeControls.MAX ? 1 : 0,
              left: `${rangeState.maxPos}%`,
            }}
          />

          <div className="range__bar__rail"></div>
        </div>
        <InvisibleInput value={val.max} onChange={(ev) => console.log(ev)} />
      </div>
    </RangeStyles>
  );
};

export default Range;
