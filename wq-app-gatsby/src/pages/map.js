import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Grid, GridColumn, Header } from "semantic-ui-react"
import { graphql, useStaticQuery, Link } from "gatsby"
import Mapbox from "../components/creekMap"
const TOKEN = process.env.toast

const Map = () => {

  const data = useStaticQuery(graphql`
    query {
      allCreekSiteJson {
        edges {
          node {
            id
            creek_name
            creek_id
          }
        }
      }
    }
  `)


  return (
    <Layout>
      <SEO title="Map" />
      <Grid>
        <GridColumn width={6}>
          <Header as="h2">Contra Costa County Creeks</Header>
          <p>
            Contra Costa County has over 20 major creeks, as identified by the
            <a href="http://cocowaterweb.org/wp-content/uploads/Watershed-Atlas.pdf">
              {" "}
              Contra Costa County Watershed Atlas
            </a>
            . Spread out through natural and urban spaces, these waterways exist
            in several forms: natural, concrete, or underground. An estimated
            35% of the land that drains to these creeks is made up of impervious
            surfaces such as roads and houses, which contributes to runoff
            pollution during storms, as the rain is not able to filter through
            the soil.
          </p>

          <Header as="h2">Creeks</Header>
          <ul>
            {data.allCreekSiteJson.edges.map(edge => {
              return (
                <li key={edge.node.id}>
                  <Link to={`creek/${edge.node.creek_id}`}>{edge.node.creek_name}</Link>
                </li>
              )
            })}
          </ul>
        </GridColumn>
        <GridColumn width={10}>
          <Mapbox />
        </GridColumn>
      </Grid>
    </Layout>
  )
}

export default Map
