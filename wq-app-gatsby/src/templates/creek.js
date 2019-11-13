import React from "react"
import { graphql, navigate } from "gatsby"
import Layout from "../components/layout"
import creekImage from "../images/20180816_111841.jpg"
import {
  Grid,
  GridColumn,
  Image,
  Container,
  Divider,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Icon,
  Dropdown,
  GridRow,
} from "semantic-ui-react"
import Mapbox from "../components/creekMap"
import creekStyles from "../styles/creek.module.css"

export default ({ data, pageContext }) => {
  const creekData = data.allCreekSiteJson.edges.filter(
    edge => edge.node.creek_id === pageContext.creekID
  )[0].node
  const creekOptions = data.allCreekSiteJson.edges.map(edge => ({
    key: edge.node.creek_id,
    text: edge.node.creek_name,
    value: edge.node.creek_id,
  }))

  const pts = [].concat(...creekData.sites)

  const colorLookUp = {
    Good: "green",
    Marginal: "yellow",
    Bad: "red",
    NA: "grey",
  }
  const analyteScores = data.allCreekScoresCsv.edges.map(edge => [
    edge.node.AnalyteName,
    edge.node.score,
  ])

  const siteOptions = creekData.sites.map(site => ({
    key: site.site_id,
    text: `${site.name} (${site.site_id})`,
    value: site.site_id,
  }))

  const grade = data.allCreekGradesCsv.edges[0].node.letter_grade

  return (
    <Layout>
      <Container>
        <Grid>
          <GridColumn width={16}>
            <h1 className={creekStyles.creekHeader}>{creekData.creek_name}</h1>
          </GridColumn>
          <GridColumn width={6}>
            <Image src={creekImage} size="large"></Image>
            <Divider hidden />
            <p className={creekStyles.creekDescription}>
              {creekData.creek_description}
            </p>
          </GridColumn>
          <GridColumn width={10}>
            <Grid>
              <GridRow>
                <GridColumn width={16}>
                  <Mapbox
                    pts={pts}
                    height={300}
                    zoom={10}
                    lat={creekData.creek_lat}
                    long={creekData.creek_long}
                  />
                </GridColumn>
              </GridRow>
              <GridRow>
                <GridColumn width={9}>
                  <h3 className={creekStyles.header2}>Creek Report Card</h3>
                  <Grid>
                    <GridColumn width={10}>
                      <Table basic="very" celled collapsing>
                        <TableBody className={creekStyles.creekScore}>
                          {analyteScores.map(analyte => (
                            <TableRow>
                              <TableCell>{analyte[0]}</TableCell>
                              <TableCell>
                                <Icon
                                  name="circle"
                                  color={colorLookUp[analyte[1]]}
                                ></Icon>
                                {`  ${analyte[1]}`}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </GridColumn>
                    <GridColumn width={6}>
                      <h2 className={creekStyles.header2}>{`Grade: ${grade}`}</h2>
                    </GridColumn>
                  </Grid>
                </GridColumn>
                <GridColumn width={7}>
                  <h3 className={creekStyles.header2}>
                    Explore Sampling Sites
                  </h3>
                  <Dropdown
                    placeholder="Select Site"
                    fluid
                    selection
                    options={siteOptions}
                    onChange={(e, data) => navigate(`site/${data.value}`)}
                  />

                  <h3 className={creekStyles.header2}>Explore Other Creeks</h3>
                  <Dropdown
                    placeholder="Select Creek"
                    fluid
                    selection
                    options={creekOptions}
                    onChange={(e, data) => navigate(`creek/${data.value}`)}
                  />
                </GridColumn>
              </GridRow>
            </Grid>
          </GridColumn>
        </Grid>
      </Container>
    </Layout>
  )
}

export const query = graphql`
  query($creekID: String!) {
    allCreekSiteJson {
      edges {
        node {
          creek_name
          creek_description
          creek_id
          creek_lat
          creek_long
          sites {
            site_id
            name
            description
            lat
            long
          }
        }
      }
    }
    allCreekScoresCsv(filter: { creek_id: { eq: $creekID } }) {
      edges {
        node {
          creek_id
          AnalyteName
          score
        }
      }
    }
    allCreekGradesCsv(filter: { creek_id: { eq: $creekID } }) {
      edges {
        node {
          letter_grade
          grade
        }
      }
    }
  }
`
