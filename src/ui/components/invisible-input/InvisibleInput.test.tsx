import React from "react";
import { render } from "@testing-library/react";
import TestRenderer from "react-test-renderer";
import InvisibleInput from "./InvisibleInput";

test("renders InvisibleInput", () => {
  render(<InvisibleInput value={100} />);
});

test("snapshot match", () => {
  const tree = TestRenderer.create(<InvisibleInput value={100} />).toJSON();
  expect(tree).toMatchSnapshot();
});
