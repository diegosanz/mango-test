import React, { FC, useState } from "react";
import { MinMax } from "../../../misc/models/MinMax";
import Range from "../../../ui/components/range/Range";

const Exercise2: FC = () => {
  const [rangeSelected, setRangeSelected] = useState<{
    min: number;
    max: number;
  }>();

  const onChangeHandler = (ev: MinMax) => {
    setRangeSelected(ev);
  };

  return (
    <div className="exercise2">
      <h1>Exercise 2</h1>
      <Range
        options={[1.99, 5.99, 10.99, 30.99, 50.99, 70.99]}
        value={rangeSelected}
        onChange={onChangeHandler}
        unit="€"
      />
    </div>
  );
};

export default Exercise2;
