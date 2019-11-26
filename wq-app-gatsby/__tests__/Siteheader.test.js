module.exports = "test-file-stub"

import React from "react"
import {
  render,
  cleanup
} from '@testing-library/react'
import SiteHeader from '../src/components/siteHeader'


afterEach(cleanup)

test('it should render', () => {
  const {
    container
  } = render( < SiteHeader / > );

  expect(container).toMatchSnapshot();
})

test('it should contain navigation pages', () => {
  const {
    getByText
  } = render( < SiteHeader / > );

  expect(getByText('Home')).toBeTruthy();
  expect(getByText('About')).toBeTruthy();
  expect(getByText('Download')).toBeTruthy();
})

test('it should contain a header', () => {
  const {
    getByText
  } = render( < SiteHeader / > );
  const header = getByText('Water Quality in Contra Costa County');

  expect(header).toBeTruthy();
})

test('it should have the Watershed Logo', () => {
  const {
    container
  } = render( < SiteHeader / > );
  const watershedLogo = container.getElementsByClassName('ui image logo');

  expect(watershedLogo).toBeTruthy();
})

// tried to test navigation with gatsby, but failed. I think this is a case for E2E testing with Cypress.

// test('it should allow the user to navigate to different pages', async () => {
//   const history = createMemoryHistory()
//   const aboutRoute = '/about'
//   history.push(aboutRoute)
//   const { container, debug, getByText } = render(
//     <SiteHeader />
//   );
//   fireEvent.click(getByText(/about/i))
//   debug()
//   expect(container).toBe('/about')
// });
