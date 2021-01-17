import React, { FC } from "react";
import Range from "../../../ui/components/range/Range";

const Exercise1: FC = () => {
  const onChangeHandler = (ev: { min: number; max: number }) => {
    console.log("handler", ev);
  };

  return (
    <div className="exercise1">
      <h1>Exercise 1</h1>
      <Range
        options={{ min: 1, max: 100 }}
        onChange={onChangeHandler}
        value={{ min: 60, max: 50 }}
        unit="€"
      />
    </div>
  );
};

export default Exercise1;
