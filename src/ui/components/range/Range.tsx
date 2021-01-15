import React, { FC, useEffect, useState, useRef } from "react";
import InvisibleInput from "../invisible-input/InvisibleInput";
import styled from "styled-components";
import RangeControl from "../range-control/RangeControl";

enum RangeControls {
  MIN,
  MAX,
}

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

        /* TODO: borrar estos colores */
        &.m-max {
          background-color: red;
        }
        &.m-min {
          background-color: blue;
        }
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
    values: number[];
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
  }>({
    lastActiveControl: RangeControls.MIN,
    released: true,
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

  const onStartMoving = (
    ev:
      | React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
      | React.TouchEvent<HTMLDivElement>,
    el: RangeControls
  ) => {
    setMoving({
      lastActiveControl: el,
      released: false,
    });
  };

  const onMoving = (
    ev:
      | React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
      | React.TouchEvent<HTMLDivElement>,
    el: RangeControls
  ) => {
    if (moving.lastActiveControl === el && !moving.released) {
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
        if (percentaje > 100) {
          percentaje = 100;
        } else if (percentaje < 0) {
          percentaje = 0;
        }

        ev.currentTarget.style.left = percentaje + "%";
      }
    }
  };

  const onStopMoving = () => {
    setMoving({
      ...moving,
      released: true,
    });
  };

  return (
    <RangeStyles>
      <div className="range">
        <InvisibleInput
          value={rangeState?.limits.min}
          onChange={(ev) => console.log(ev)}
        />
        <div className="range__bar" ref={rangeBarRef}>
          <RangeControl
            onMouseDown={(ev) => {
              onStartMoving(ev, RangeControls.MIN);
            }}
            onTouchStart={(ev) => {
              onStartMoving(ev, RangeControls.MIN);
            }}
            onMouseMove={(ev) => {
              onMoving(ev, RangeControls.MIN);
            }}
            onTouchMove={(ev) => {
              onMoving(ev, RangeControls.MIN);
            }}
            onMouseOut={onStopMoving}
            onMouseUp={onStopMoving}
            onTouchEnd={onStopMoving}
            onTouchCancel={onStopMoving}
            className="range__bar__control m-min"
            style={
              moving.lastActiveControl === RangeControls.MIN
                ? { zIndex: 1 }
                : { zIndex: 0 }
            }
          />

          <RangeControl
            onMouseDown={(ev) => {
              onStartMoving(ev, RangeControls.MAX);
            }}
            onTouchStart={(ev) => {
              onStartMoving(ev, RangeControls.MAX);
            }}
            onMouseMove={(ev) => {
              onMoving(ev, RangeControls.MAX);
            }}
            onTouchMove={(ev) => {
              onMoving(ev, RangeControls.MAX);
            }}
            onMouseOut={onStopMoving}
            onMouseUp={onStopMoving}
            onTouchEnd={onStopMoving}
            onTouchCancel={onStopMoving}
            className="range__bar__control m-max"
            style={
              moving.lastActiveControl === RangeControls.MAX
                ? { zIndex: 1 }
                : { zIndex: 0 }
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
