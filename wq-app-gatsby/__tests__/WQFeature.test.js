import React from 'react'
import { render, cleanup } from '@testing-library/react'
import WQFeature from '../src/components/wqFeature'
import wqFeaturesJSON from '../src/data/wq_categories_features.json'
const { features, category, description } = wqFeaturesJSON[0]


afterEach(cleanup)

test('it should render', () => {
  const { container, debug } = render(
    <WQFeature
      category={category}
      description={description}
      features={features}
    />
  );
  debug();
  expect(container).toMatchSnapshot();
});

test('it should have a water drop image', () => {
  const { getByAltText } = render(
    <WQFeature
      category={category}
      description={description}
      features={features}
    />
  );

  expect(getByAltText('water drop illustration')).toBeTruthy();
});

      // would be interesting to create the entire wqFeature grid and test each water blob