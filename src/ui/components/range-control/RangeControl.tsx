import styled from "styled-components";

const RangeControl = styled.div`
  cursor: grabbing;
  width: 1em;
  height: 1em;
  border-radius: 100%;
  background-color: #000;
  transform: translate(-50%, 0);
  transition: width 0.25s, height 0.25s;

  &:hover {
    width: 1.5em;
    height: 1.5em;
  }
`;

export default RangeControl;
