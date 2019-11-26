import React from "react"
import {
  render,
  cleanup
} from '@testing-library/react'
import ScrollModal from "../src/components/scrollModal"
import wqFeatures from '../src/data/wq_categories_features.json'

afterEach(cleanup)

test('It should render', async () => {
  const { features } = wqFeatures[0];
  const { container, debug}  = await render(<ScrollModal features={features} />);
  debug();
  expect(container).toMatchSnapshot();
});
