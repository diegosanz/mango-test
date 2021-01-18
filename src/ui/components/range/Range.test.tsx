import React from "react";
import { render } from "@testing-library/react";
import TestRenderer from "react-test-renderer";
import Range from "./Range";

test("renders Range", () => {
  render(<Range />);
});

test("snapshot empty range match", () => {
  const tree = TestRenderer.create(<Range />).toJSON();
  expect(tree).toMatchSnapshot();
});

test("snapshot MinMax range match", () => {
  const tree = TestRenderer.create(
    <Range value={{ min: 15, max: 89 }} options={{ min: 1, max: 100 }} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test("snapshot Number[] range match", () => {
  const tree = TestRenderer.create(
    <Range value={{ min: 15, max: 89 }} options={[2, 15, 78, 89]} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test("snapshot disabled range match", () => {
  const tree = TestRenderer.create(<Range disabled={true} />).toJSON();
  expect(tree).toMatchSnapshot();
});
