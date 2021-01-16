import React, { FC, useEffect, useState, useRef } from "react";
import InvisibleInput from "../invisible-input/InvisibleInput";
import styled from "styled-components";
import RangeControl from "../range-control/RangeControl";
import { generatePercentages } from "../../../misc/utils/value-percent-generator";
import { RangeValue } from "../../../misc/models/RangeValue";
import { closestRangeValue } from "../../../misc/utils/closestRangeValue";

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
  values: number[] | { min: number; max: number };
}

const Range: FC<RangeProps> = ({ values }) => {
  const rangeBarRef = useRef<HTMLDivElement>(null);

  const [rangeState, setRangeState] = useState<{
    inputEditable: boolean;
    limits: { min: number; max: number };
    values: RangeValue[];
  }>({
    inputEditable: false,
    limits: { min: 0, max: 0 },
    values: [],
  });

  // const [value, setValue] = useState<{
  //   min: number;
  //   max: number;
  // }>({
  //   min: 0,
  //   max: 0,
  // });

  const [moving, setMoving] = useState<{
    lastActiveControl: RangeControls;
    released: boolean;
    minPos: number;
    maxPos: number;
  }>({
    lastActiveControl: RangeControls.MIN,
    released: true,
    minPos: 0,
    maxPos: 100,
  });

  useEffect(() => {
    if (Array.isArray(values)) {
      const valuePercent = generatePercentages(values);

      setRangeState({
        inputEditable: false,
        limits: {
          min: valuePercent[0]?.value || 0,
          max: valuePercent[valuePercent.length - 1]?.value || 0,
        },
        values: valuePercent,
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
        values: generatePercentages(steps),
      });
    }
  }, [values]);

  const onStartMoving = (el: RangeControls) => {
    setMoving({
      ...moving,
      lastActiveControl: el,
      released: false,
    });
  };

  const onMoving = (
    ev:
      | React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
      | React.TouchEvent<HTMLDivElement>
  ) => {
    if (!moving.released) {
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

        if (moving.lastActiveControl === RangeControls.MIN) {
          setMoving({
            ...moving,
            minPos: percentaje,
          });
        } else if (moving.lastActiveControl === RangeControls.MAX) {
          setMoving({
            ...moving,
            maxPos: percentaje,
          });
        }
      }
    }
  };

  const onStopMoving = () => {
    const minValue = closestRangeValue(moving.minPos, rangeState.values);
    const maxValue = closestRangeValue(moving.maxPos, rangeState.values);
    setMoving({
      ...moving,
      released: true,
      minPos: minValue.percent,
      maxPos: maxValue.percent,
    });
  };

  return (
    <RangeStyles>
      <div className="range">
        <InvisibleInput
          value={rangeState?.limits.min}
          onChange={(ev) => console.log(ev)}
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
              zIndex: moving.lastActiveControl === RangeControls.MIN ? 1 : 0,
              left: `${moving.minPos}%`,
            }}
          />

          <RangeControl
            onMouseDown={() => {
              onStartMoving(RangeControls.MAX);
            }}
            onTouchStart={() => {
              onStartMoving(RangeControls.MAX);
            }}
            onMouseOut={onStopMoving}
            className="range__bar__control m-max"
            style={{
              zIndex: moving.lastActiveControl === RangeControls.MAX ? 1 : 0,
              left: `${moving.maxPos}%`,
            }}
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
