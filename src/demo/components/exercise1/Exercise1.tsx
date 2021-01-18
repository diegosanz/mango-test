import React, { FC, useEffect, useState } from "react";
import Range from "../../../ui/components/range/Range";
import { useDispatch, useSelector } from "react-redux";
import { getExercise1State } from "../../store/exercise1/exercise1.selectors";
import { loadExercise1Options } from "../../store/exercise1/exercise1.slice";

const Exercise1: FC = () => {
  const [rangeSelected, setRangeSelected] = useState<{
    min: number;
    max: number;
  }>();

  const onChangeHandler = (ev: { min: number; max: number }) => {
    setRangeSelected(ev);
  };

  const dispatch = useDispatch();

  const exercise1State = useSelector(getExercise1State);

  useEffect(() => {
    dispatch(loadExercise1Options());
  }, [dispatch]);

  return (
    <div className="exercise1">
      <h1>Exercise 1</h1>
      {exercise1State.error}
      <Range
        options={exercise1State.options}
        value={rangeSelected}
        onChange={onChangeHandler}
        unit="€"
      />
    </div>
  );
};

export default Exercise1;
