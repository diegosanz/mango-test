import React, { FC } from "react";
import Range from "../../../ui/components/range/Range";

const Exercise2: FC = () => {
  return (
    <div className="exercise2">
      <h1>Exercise 2</h1>
      <Range values={[1.99, 5.99, 10.99, 30.99, 50.99, 70.99]} />
    </div>
  );
};

export default Exercise2;
