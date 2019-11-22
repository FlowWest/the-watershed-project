import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Container, Grid, GridColumn } from "semantic-ui-react"
import { useStaticQuery, graphql } from "gatsby"
import MapboxCeden from "../components/cedenMap"

const CEDEN = () => {

  // const data = useStaticQuery(graphql`
  // query{
  //   allExternalCedenJson {
  //     edges {
  //       node {
  //         Program
  //         StationCode
  //         StationName
  //         lat
  //         long
  //         ProtocolCode
  //         ProtocolDescr
  //         ProtocolName
  //         data {
  //           SampleDate(formatString: "")
  //           Analyte
  //           Result
  //           Unit
  //           analyte_desc_name
  //         }
  //       }
  //     }
  //   }
  // }
  // `)

  // const pts  = data.allExternalCedenJson.edges.map(edge => edge.node)
  // console.log(pts)

  return (
    <Layout>
      <SEO title="External Data" />
      <Container>
        <Grid>
          <GridColumn width={12}>
            <p>hi</p>
            {/* <MapboxCeden
              pts={pts}
              lat={37.929787}
              long={-122.076019}
              zoom={8}
              height={"500px"}
            /> */}
          </GridColumn>
          <GridColumn width={4}>
            <p>bye</p>
          </GridColumn>
        </Grid>
      </Container>
    </Layout>
  )
}

export default CEDEN
