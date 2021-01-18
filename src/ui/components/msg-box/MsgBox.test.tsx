import React from "react";
import { render } from "@testing-library/react";
import TestRenderer from "react-test-renderer";
import MsgBox from "./MsgBox";

test("renders empty error MsgBox", () => {
  render(<MsgBox type="error" />);
});

test("renders empty info MsgBox", () => {
  render(<MsgBox type="info" />);
});

test("renders full error MsgBox", () => {
  render(<MsgBox type="error">Test</MsgBox>);
});

test("renders full info MsgBox", () => {
  render(<MsgBox type="info">Test</MsgBox>);
});

test("snapshot empty error match", () => {
  const tree = TestRenderer.create(<MsgBox type="error" />).toJSON();
  expect(tree).toMatchSnapshot();
});

test("snapshot empty info match", () => {
  const tree = TestRenderer.create(<MsgBox type="info" />).toJSON();
  expect(tree).toMatchSnapshot();
});

test("snapshot full error match", () => {
  const tree = TestRenderer.create(<MsgBox type="error">Test</MsgBox>).toJSON();
  expect(tree).toMatchSnapshot();
});

test("snapshot full error match", () => {
  const tree = TestRenderer.create(<MsgBox type="info">Test</MsgBox>).toJSON();
  expect(tree).toMatchSnapshot();
});
