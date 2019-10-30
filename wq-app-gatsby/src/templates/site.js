import React, { Fragment } from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import { Header, Grid, GridColumn, Tab, Dropdown } from "semantic-ui-react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import moment from "moment"

export default ({ data, pageContext }) => {
  const sitesData = data.allCreekSiteJson.edges[0].node
  // need the edge containing current site
  // need list of all other sites, with id and name

  const [siteData] = sitesData.sites.filter(
    site => site.site_id === pageContext.siteID
  )
  const wqOptions = [
    {
      key: "dog",
      text: "dog",
      value: "dog",
    },
    {
      key: "cat",
      text: "cat",
      value: "cat",
    },
  ]

  const panes = [
    {
      menuItem: "Within",
      render: () => {
        return (
          <Tab.Pane attached={false}>
            <div>
              <h3>Select Water Quality Feature</h3>
              <Dropdown
                placeholder="Water Quality Feature"
                search
                selection
                options={wqOptions}
              />
            </div>
          </Tab.Pane>
        )
      },
    },
    {
      menuItem: "Between",
      render: () => {
        return <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane>
      },
    },
  ]

  return (
    <Layout>
      <Grid>
        <GridColumn width={6}>
          <Header as="h2">{siteData.name}</Header>
          <p>{siteData.description}</p>
          <ul>
            {sitesData.sites
              .filter(site => site.site_id !== pageContext.siteID)
              .map(site => {
                return (
                  <Fragment key={site.site_id}>
                    <li>
                      <Link to={`site/${site.site_id}`}>{site.name}</Link>
                    </li>
                  </Fragment>
                )
              })}
          </ul>
          <p>
            <Link to={`/creek/${sitesData.creek_id}`}>
              Go back to {sitesData.creek_name}
            </Link>
          </p>
        </GridColumn>
        <GridColumn width={10}>
          <Tab menu={{ secondary: true, pointing: true }} panes={panes}></Tab>
        </GridColumn>
      </Grid>
    </Layout>
  )
}

// Possibly need to refactor this query to contain more Creek data
export const query = graphql`
  query($siteID: String!) {
    allCreekSiteJson(
      filter: { sites: { elemMatch: { site_id: { eq: $siteID } } } }
    ) {
      edges {
        node {
          creek_name
          creek_id
          sites {
            description
            name
            site_id
          }
        }
      }
    }
  }
`
