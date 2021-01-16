import React, { FC } from "react";
import Range from "../../../ui/components/range/Range";

const Exercise2: FC = () => {
  const onChangeHandler = (ev: { min: number; max: number }) => {
    console.log("handler", ev);
  };

  return (
    <div className="exercise2">
      <h1>Exercise 2</h1>
      <Range
        options={[1.99, 5.99, 10.99, 30.99, 50.99, 70.99]}
        value={{ min: 5.99, max: 50.99 }}
        onChange={onChangeHandler}
      />
    </div>
  );
};

export default Exercise2;
