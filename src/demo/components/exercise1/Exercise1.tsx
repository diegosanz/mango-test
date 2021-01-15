import React, { FC } from "react";
import Range from "../../../ui/components/range/Range";

const Exercise1: FC = () => {
  return (
    <div className="exercise1">
      <h1>Exercise 1</h1>
      <Range values={{ min: 0, max: 100 }} />
    </div>
  );
};

export default Exercise1;
