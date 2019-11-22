import React from "react"
import { graphql, Link, navigate } from "gatsby"
import Layout from "../components/layout"
import { Grid, GridColumn } from "semantic-ui-react"

export default ({ data, pageContext }) => {

  const siteData = data.allExternalCedenJson.edges
  console.log(siteData)
  console.log(pageContext)


  return (
    <Layout>
      <Grid>
        <GridColumn width={8}>
          <p>{pageContext.stationName}</p>
        </GridColumn>
      </Grid>
    </Layout>
  )
}

export const query = graphql`
  query($stationCode: String!) {
    allExternalCedenJson(filter: {StationCode: {eq: $stationCode}}) {
      edges {
        node {
          Program
          StationName
          StationCode
          ProtocolCode
          ProtocolDescr
          ProtocolName
          analyte_desc_name
          Analyte
          Unit
          data {
            Result
            SampleDate(formatString: "")
          }
        }
      }
    }
  }
`
