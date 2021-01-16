import { RangeValue } from "../models/RangeValue";

export function closestRangeValue(
  percentage: number,
  rangeValues: RangeValue[]
): RangeValue {
  return rangeValues.reduce((prev, curr) => {
    return Math.abs(curr.percent - percentage) <
      Math.abs(prev.percent - percentage)
      ? curr
      : prev;
  });
}
