import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import creekImage from "../images/20180816_111841.jpg"
import {
  Grid,
  GridColumn,
  Image,
  Container,
  Divider,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableHeaderCell,
  TableBody,
  Icon
} from "semantic-ui-react"
import Mapbox from "../components/creekMap"
import creekStyles from "../styles/creek.module.css"

export default ({ data }) => {
  const creekData = data.allCreekSiteJson.edges[0].node
  const ptsNotFlat = data.allCreekSiteJson.edges.map(edge => edge.node.sites)
  const pts = [].concat(...ptsNotFlat)
  
  const colorLookUp = {Good: 'green', Marginal: 'yellow', Bad: 'red', NA: 'grey'}
  const analyteScores = data.allCreekScoresCsv.edges.map(edge => [
    edge.node.AnalyteName,
    edge.node.score,
  ])

  return (
    <Layout>
      <Container>
        <Grid>
          <GridColumn width={6}>
            <h1>{creekData.creek_name}</h1>
            <Image src={creekImage} size="medium"></Image>
            <h3>Associated Sites</h3>
            <ul>
              {creekData.sites.map((site, index) => {
                return (
                  <li key={index}>
                    <Link to={`site/${site.site_id}`}>{site.name}</Link>
                  </li>
                )
              })}
            </ul>
          </GridColumn>
          <GridColumn width={10}>
            <Mapbox
              pts={pts}
              height={300}
              zoom={11}
              lat={creekData.creek_lat}
              long={creekData.creek_long}
            />
            <Divider hidden />
            <p>{creekData.creek_description}</p>
            <div>
              <h4>Creek Report Card</h4>
              <Table celled padded>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>Vital Sign</TableHeaderCell>
                    <TableHeaderCell>Score</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyteScores.map(analyte => (
                    <TableRow>
                      <TableCell>{analyte[0]}</TableCell>
                      <TableCell>
                        <Icon name="circle" color={colorLookUp[analyte[1]]}></Icon>
                        {`  ${analyte[1]}`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </GridColumn>
        </Grid>
      </Container>
    </Layout>
  )
}

export const query = graphql`
  query($creekID: String!) {
    allCreekSiteJson(filter: { creek_id: { eq: $creekID } }) {
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
  }
`
