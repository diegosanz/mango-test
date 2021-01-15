import React, { FC } from "react";
import Range from "../../../ui/components/range/Range";

const Exercise2: FC = () => {
  return (
    <div className="exercise2">
      <h1>Exercise 2</h1>
      <Range values={[10, 1, 3, 8]} />
    </div>
  );
};

export default Exercise2;
