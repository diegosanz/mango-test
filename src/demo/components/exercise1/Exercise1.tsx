import React, { FC, useState } from "react";
import Range from "../../../ui/components/range/Range";

const Exercise1: FC = () => {
  const [rangeSelected, setRangeSelected] = useState<{
    min: number;
    max: number;
  }>();

  const onChangeHandler = (ev: { min: number; max: number }) => {
    setRangeSelected(ev);
  };

  return (
    <div className="exercise1">
      <h1>Exercise 1</h1>
      <Range
        options={{ min: 1, max: 100 }}
        value={rangeSelected}
        onChange={onChangeHandler}
        unit="€"
      />
    </div>
  );
};

export default Exercise1;
