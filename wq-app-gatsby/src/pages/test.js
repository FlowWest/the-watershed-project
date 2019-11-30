import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Container } from "semantic-ui-react"
import MapBox from "../components/Map"
import { useStaticQuery, graphql, Link } from "gatsby"

const Test = () => {
  const data = useStaticQuery(graphql`
    query {
      allTwpCedenSitesCsv {
        edges {
          node {
            lat
            long
            name
            site_id
            source
          }
        }
      }
    }
  `)

  const pts = [].concat(
    ...data.allTwpCedenSitesCsv.edges.map(edge => edge.node)
  )
  return (
    <Layout>
      <Container>
        <SEO title="Test" />
        <h1>Test Mapbox</h1>
        <MapBox pts={pts} />
      </Container>
    </Layout>
  )
}

export default Test
