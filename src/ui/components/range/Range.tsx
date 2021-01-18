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
import useEvent from "../../hooks/useEvent";
import { MinMax } from "../../../misc/models/MinMax";

enum RangeControls {
  MIN,
  MAX,
}

const RangeStyles = styled.div`
  .range {
    display: flex;
    user-select: none;
    padding: 1em 0;

    &.m-disabled {
      position: relative;
      opacity: 0.6;

      &::before {
        content: "";
        position: absolute;
        z-index: 2;
        cursor: not-allowed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
    }

    &__boundaries {
      max-width: 100%;
    }

    &__bar {
      flex-grow: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 0 1em;

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
  options?: number[] | MinMax;
  value?: MinMax;
  onChange?: (e: MinMax) => void;
  unit?: string;
  disabled?: boolean;
}

interface RangeState {
  /** Tells if user can edit max and min inputs */
  inputEditable: boolean;
  limitMin: number;
  limitMax: number;
  options: RangeValue[];
  released: boolean;
  minPos: number;
  maxPos: number;
  disabled: boolean;
}

const rangeStateDefault: RangeState = {
  inputEditable: true,
  limitMin: 0,
  limitMax: 0,
  options: [],
  released: true,
  minPos: 0,
  maxPos: 100,
  disabled: false,
};

const Range: FC<RangeProps> = ({
  options,
  value,
  onChange,
  unit,
  disabled,
}) => {
  const rangeBarRef = useRef<HTMLDivElement>(null);

  const [rangeState, setRangeState] = useState<RangeState>({
    ...rangeStateDefault,
  });

  const [lastActiveControl, setLastActiveControl] = useState<RangeControls>();

  const [val, setVal] = useState<MinMax>({
    min: 0,
    max: 0,
  });

  useEffect(() => {
    let rangeStateTemp: RangeState = { ...rangeStateDefault };

    if (!options || disabled) {
      setRangeState({
        ...rangeStateTemp,
        disabled: true,
        inputEditable: false,
      });
    }

    if (!options) {
      return;
    }

    if (Array.isArray(options)) {
      rangeStateTemp = {
        ...rangeStateTemp,
        inputEditable: false,
        options: generatePercentages(options),
      };
    } else if (options && !isNaN(options?.max) && !isNaN(options?.min)) {
      // Validate that in fact `min` is minor than `max`
      const min = Math.min(options.min, options.max);
      const max = Math.max(options.min, options.max);
      let steps: number[] = [];

      for (let i = min; i <= max; i++) {
        steps = [...steps, i];
      }

      rangeStateTemp = {
        ...rangeStateTemp,
        inputEditable: true,
        options: generatePercentages(steps),
      };
    } else {
      rangeStateTemp = {
        ...rangeStateTemp,
      };
    }

    const limitMin = rangeStateTemp.options[0]?.value;
    const limitMax =
      rangeStateTemp.options[rangeStateTemp.options.length - 1]?.value;
    const min = value?.min ?? limitMin;
    const max = value?.max ?? limitMax;

    setVal({
      min,
      max,
    });

    setRangeState({
      ...rangeStateTemp,
      limitMin,
      limitMax,
      maxPos: closestRangeValueByValue(max, rangeStateTemp.options).percent,
      minPos: closestRangeValueByValue(min, rangeStateTemp.options).percent,
    });
  }, [options, value]);

  const onStartMoving = (el: RangeControls) => {
    setRangeState({
      ...rangeState,
      released: false,
    });
    setLastActiveControl(el);
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

        if (lastActiveControl === RangeControls.MIN) {
          if (percentaje > rangeState.maxPos) {
            percentaje = rangeState.maxPos;
          }

          const minValue = closestRangeValueByPercentage(
            percentaje,
            rangeState.options
          );

          setRangeState({
            ...rangeState,
            minPos: percentaje,
          });
          setLastActiveControl(RangeControls.MIN);
          setVal({
            ...val,
            min: minValue.value,
          });
        } else if (lastActiveControl === RangeControls.MAX) {
          if (percentaje < rangeState.minPos) {
            percentaje = rangeState.minPos;
          }

          const maxValue = closestRangeValueByPercentage(
            percentaje,
            rangeState.options
          );

          setRangeState({
            ...rangeState,
            maxPos: percentaje,
          });
          setLastActiveControl(RangeControls.MAX);
          setVal({
            ...val,
            max: maxValue.value,
          });
        }
      }
    }
  };

  const onStopMoving = () => {
    if (!rangeState.released) {
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
        minPos: minValue.percent,
        maxPos: maxValue.percent,
      });

      setVal({
        min: minValue.value,
        max: maxValue.value,
      });

      emitValue({
        min: minValue.value,
        max: maxValue.value,
      });
    }
  };

  useEvent("mouseup", onStopMoving);

  const emitValue = (val: MinMax) => {
    if (onChange) {
      onChange(val);
    }
  };

  const handleTextInputMin = (ev: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = ev.target.valueAsNumber;

    if (newValue > val.max) {
      newValue = val.max;
    }

    const newRangeValue = closestRangeValueByValue(
      newValue,
      rangeState.options
    );

    setVal({
      ...val,
      min: newRangeValue.value,
    });

    setRangeState({
      ...rangeState,
      minPos: newRangeValue.percent,
    });
    setLastActiveControl(RangeControls.MIN);

    emitValue({
      ...val,
      min: newRangeValue.value,
    });
  };

  const handleTextInputMax = (ev: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = ev.target.valueAsNumber;

    if (newValue < val.min) {
      newValue = val.min;
    }

    const newRangeValue = closestRangeValueByValue(
      newValue,
      rangeState.options
    );

    setVal({
      ...val,
      max: newRangeValue.value,
    });

    setRangeState({
      ...rangeState,
      maxPos: newRangeValue.percent,
    });
    setLastActiveControl(RangeControls.MAX);

    emitValue({
      ...val,
      max: newRangeValue.value,
    });
  };

  return (
    <RangeStyles>
      <div className={`range ${rangeState.disabled ? "m-disabled" : null}`}>
        <InvisibleInput
          value={val.min}
          onChange={handleTextInputMin}
          unit={unit}
          disabled={!rangeState.inputEditable}
        />
        <div
          className="range__bar"
          ref={rangeBarRef}
          onMouseMove={(ev) => {
            onMoving(ev);
          }}
          onTouchMove={(ev) => {
            onMoving(ev);
          }}
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
              zIndex: lastActiveControl === RangeControls.MIN ? 1 : 0,
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
              zIndex: lastActiveControl === RangeControls.MAX ? 1 : 0,
              left: `${rangeState.maxPos}%`,
            }}
          />

          <div className="range__bar__rail"></div>
        </div>

        <InvisibleInput
          value={val.max}
          onChange={handleTextInputMax}
          unit={unit}
          disabled={!rangeState.inputEditable}
        />
      </div>
    </RangeStyles>
  );
};

export default Range;
