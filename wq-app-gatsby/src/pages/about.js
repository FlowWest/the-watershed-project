import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { graphql, useStaticQuery } from "gatsby"
import { Container, Grid, GridColumn } from "semantic-ui-react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import moment from "moment"

const About = () => {
  
  const data = useStaticQuery(graphql`
    query {
      allFieldDataJson {
        edges {
          node {
            StationCode
            AnalyteName
            UnitName
            data {
              SampleDate(formatString: "")
              Result
            }
          }
        }
      }
    }
  `)

  const filteredData = data.allFieldDataJson.edges.filter(
    edge =>
      (edge.node.StationCode === "ALH110") &
      (edge.node.AnalyteName === "Specific Conductivity")
  )[0].node

  // console.log(filteredData)

  const options = {
    title: {
      text: "My chart",
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Date",
      },
    },
    yAxis: {
      title: {
        text: `${filteredData.AnalyteName} (${filteredData.UnitName})`,
      },
      min: 0,
    },
    series: [
      {
        name: "",
        data: filteredData.data.map(pt => [
          moment.utc(pt.SampleDate).valueOf(),
          pt.Result,
        ]),
      },
    ],
  }

  return (
    <Layout>
      <SEO title="About" />
      <Container>
        <Grid>
          <GridColumn>
            <HighchartsReact highcharts={Highcharts} options={options} />
          </GridColumn>
        </Grid>
      </Container>
    </Layout>
  )
}

export default About
