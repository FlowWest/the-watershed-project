import React, { useState, Fragment } from "react"
import { graphql, Link, navigate } from "gatsby"
import Layout from "../components/layout"
import { Grid, GridColumn, Dropdown, Container } from "semantic-ui-react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import moment from "moment"

export default ({ data, pageContext }) => {
  const analytes = data.allExternalCedenJson.edges.map(edge => [
    edge.node.Analyte,
    edge.node.Unit,
  ])

  const [analyteUnit, setAnalyteUnit] = useState("")

  const analyteOptions = analytes.map((analyte, key) => ({
    key: key,
    text: `${analyte[0]} (${analyte[1]})`,
    value: `${analyte[0]} (${analyte[1]})`,
  }))

  const handleAnalyteChange = e => {
    e.preventDefault()
    return setAnalyteUnit(e.target.textContent)
  }

  const selectedAnalyteUnit = analyteUnit.split(/[()]/)
  const unit = selectedAnalyteUnit[1]
  const analyte = selectedAnalyteUnit[0].slice(0, -1)

  const siteData = data.allExternalCedenJson.edges.filter(
    edge => (edge.node.Analyte === analyte) & (edge.node.Unit === unit)
  )

  const wqFeature =
    siteData.length > 0 ? siteData[0].node.analyte_desc_name : null

  const featureDescription = []
    .concat(
      ...data.allWqCategoriesFeaturesJson.edges.map(edge => edge.node.features)
    )
    .filter(feature => feature.name === wqFeature)[0].feature_description

  console.log(featureDescription)

  const plotOptions = {
    chart: {
      type: "column",
      zoomType: "xy",
    },
    title: {
      text: "",
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Date",
      },
    },
    yAxis: {
      title: {
        text: analyteUnit,
      },
      min: 0,
    },
    series: [
      {
        name: analyteUnit,
        data:
          siteData.length > 0
            ? siteData[0].node.data.map(pt => [
                moment.utc(pt.SampleDate).valueOf(),
                pt.Result,
              ])
            : null,
      },
    ],
    credits: {
      enabled: false,
    },
  }

  return (
    <Layout>
      <Container>
        <Grid>
          <GridColumn width={12}>
            <h1>{pageContext.stationName}</h1>
            <div>
              <h3>Select Water Quality Feature</h3>
              <Dropdown
                placeholder="Water Quality Feature"
                search
                selection
                options={analyteOptions}
                onChange={handleAnalyteChange}
                defaultValue={analyte}
              />
            </div>
            {analyteUnit === "" ? null : (
              <HighchartsReact highcharts={Highcharts} options={plotOptions} />
            )}
          </GridColumn>
          <GridColumn width={4}>
            <h2>Water Quatilty Feature Description</h2>
            {analyteUnit === "" ? null : (
              <Fragment>
                <h3>{wqFeature}</h3>
                <p>{featureDescription}</p>
              </Fragment>
            )}
            <h4>Protocol Info</h4>
            {analyteUnit === "" ? null : (
              <p>{`${siteData[0].node.ProtocolName} (${siteData[0].node.ProtocolCode}) - ${siteData[0].node.ProtocolDescr}`}</p>
            )}
          </GridColumn>
        </Grid>
      </Container>
    </Layout>
  )
}

export const query = graphql`
  query($stationCode: String!) {
    allExternalCedenJson(filter: { StationCode: { eq: $stationCode } }) {
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
    allWqCategoriesFeaturesJson {
      edges {
        node {
          features {
            name
            feature_description
          }
        }
      }
    }
  }
`
