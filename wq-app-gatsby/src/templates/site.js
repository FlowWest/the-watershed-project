import React, { Fragment } from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import { Header Grid } from "semantic-ui-react"

export default ({ data }) => {
  const siteData = data.allCreekSiteJson.edges
  console.log('site data', siteData)
  // need the edge containing current site
  // need list of all other sites, with id and name
  return (
    <Layout>
      <Grid>
        <GridColumn width={6}>
          <Header as="h2">{siteData.name}</Header>
          <p>{siteData.description}</p>
          <ul>
            {siteData.}
          </ul>
          {/* <Link to={`/site/${site_id}`}>Go back to creek name</Link> */}
        </GridColumn>
        <GridColumn width={10}>
          <p>place holder</p>
        </GridColumn>
      </Grid>
    </Layout>

  ) 
}

export const query = graphql`
  query ($siteID: String!){
    allCreekSiteJson(filter: {sites: {elemMatch: {site_id: {eq: $siteID}}}}) {
      edges {
        node {
          creek_name
          creek_id
          sites {
            descripiton
            name
            site_id
          }
        }
      }
    }
  }
`
