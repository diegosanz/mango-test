import React from 'react';
import { render } from '@testing-library/react';
import NotFound from './NotFound';
import TestRenderer from 'react-test-renderer';

test('renders NotFound', () => {
  render(<NotFound />);
});

test('snapshot match', () => {
  const tree = TestRenderer.create(<NotFound />).toJSON();
  expect(tree).toMatchSnapshot();
});
