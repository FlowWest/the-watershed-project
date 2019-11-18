import React, { useState, Fragment } from "react"
import { graphql, Link, navigate } from "gatsby"
import Layout from "../components/layout"
import img1 from "../images/Monitoring-Walnut-Creek-crop-1012x1024.jpg"
import img2 from "../images/20180502_105406.jpg"
import img3 from "../images/20180816_111841.jpg"
import img4 from "../images/20180824_121105.jpg"

import {
  Grid,
  GridColumn,
  Tab,
  Dropdown,
  Divider,
  Image,
  Container,
} from "semantic-ui-react"

import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import moment from "moment"
import siteStyles from "../styles/site.module.css"

export default ({ data, pageContext }) => {
  const firstAnalyte = pageContext.siteID === "BAX030" ? "Lead" : "Temperature"
  const [analyte, setAnalyte] = useState(firstAnalyte)
  const [selectedImage, setImage] = useState(img1)

  const sitesData = data.allCreekSiteJson.edges[0].node
  const [siteData] = sitesData.sites.filter(
    site => site.site_id === pageContext.siteID
  )

  const siteWQData = data.allFieldDataJson.edges.filter(
    edge => edge.node.StationCode === pageContext.siteID
  )

  const siteWQDataExists = siteWQData.length !== 0

  let panes

  const thresholdLookUp = {
    Temperature: { threshold: 24, start: 0, end: 24, direction: "below" },
    "Specific Conductivity": {
      threshold: 150,
      threshold2: 500,
      start: 150,
      end: 500,
      direction: "between",
    },
    pH: {
      threshold: 6.5,
      threshold2: 9,
      start: 6.5,
      end: 9,
      direction: "between",
    },
    "Dissolved Oxygen": { threshold: 5, start: 5, end: 25, direction: "above" },
    Turbidity: { threshold: 10, start: -10, end: 10, direction: "below" },
    Nitrate: { threshold: 0.5, start: 0, end: 0.5, direction: "below" },
    Copper: { threshold: 13, start: 0, end: 13, direction: "below" },
    Lead: { threshold: 65, start: 0, end: 65, direction: "below" },
    Mercury: {
      threshold: 0.77,
      threshold2: 1.4,
      start: 0.77,
      end: 1.4,
      direction: "between",
    },
    Nickel: { threshold: null, start: null, end: null, direction: null },
    Zinc: { threshold: null, start: null, end: null, direction: null },
    "Diesel Fuel": { threshold: 0, start: null, end: null, direction: "below" },
    "Motor Oil": { threshold: 0, start: null, end: null, direction: "below" },
  }

  const seriesAllSites = data.allFieldDataJson.edges
    .filter(edge => edge.node.AnalyteName === analyte)
    .map(station => ({
      name: station.node.label,
      data: station.node.data.map(pt => [
        moment.utc(pt.SampleDate).valueOf(),
        pt.Result,
      ]),
      visible: station.node.StationCode === pageContext.siteID ? true : false,
    }))

  if (siteWQDataExists) {
    const plotData = siteWQData.filter(
      edge => edge.node.AnalyteName === analyte
    )[0].node

    const analyteOptions = siteWQData.map(edge => ({
      key: edge.node.AnalyteName,
      text: edge.node.AnalyteName,
      value: edge.node.AnalyteName,
    }))

    let unit = analyte !== 'pH' ? plotData.UnitName : ''

    const label =
      thresholdLookUp[analyte].direction === "between"
        ? `${analyte} should be ${thresholdLookUp[analyte].direction} ${thresholdLookUp[analyte].threshold} and ${thresholdLookUp[analyte].threshold2} ${unit}`
        : `${analyte} should be ${thresholdLookUp[analyte].direction} ${thresholdLookUp[analyte].threshold} ${plotData.UnitName}`

    const plotOptions = {
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
          text: `${plotData.AnalyteName} (${plotData.UnitName})`,
        },
        min: 0,
        plotLines: [
          {
            color: "rgba(204, 0, 0, 1)", // Color value
            dashStyle: "dash",
            value: thresholdLookUp[analyte].threshold,
            width: 2,
          },
          {
            color: "rgba(204, 0, 0, 1)", // Color value
            dashStyle: "dash",
            value: thresholdLookUp[analyte].threshold2 || null,
            width: 2,
          },
        ],
        plotBands: [
          {
            color: "rgba(30, 130, 76, .1)",
            from: thresholdLookUp[analyte].start,
            to: thresholdLookUp[analyte].end,
          },
          {
            color: "rgba(204, 0, 0, .1)",
            from: 0,
            to: thresholdLookUp[analyte].start,
          },
          {
            color: "rgba(204, 0, 0, .1)",
            from: thresholdLookUp[analyte].end,
            to: thresholdLookUp[analyte].end + 1000,
          },
        ],
      },
      series: seriesAllSites,
      credits: {
        enabled: false
      }
    }

    const handleAnalyteChange = e => {
      e.preventDefault()
      return setAnalyte(e.target.textContent)
    }

    panes = [
      {
        menuItem: "Plots",
        render: () => (
          <Tab.Pane attached={false}>
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
            <HighchartsReact highcharts={Highcharts} options={plotOptions} />
            {thresholdLookUp[analyte].threshold !== null ? (
              <p>{label}</p>
            ) : null}
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Images",
        render: () => (
          <Tab.Pane attached={false}>
            <Image src={selectedImage} alt="image"></Image>
            <Divider hidden />
            <Image.Group size="tiny">
              <Image src={img1} onClick={() => setImage(img1)} />
              <Image src={img2} onClick={() => setImage(img2)} />
              <Image src={img3} onClick={() => setImage(img3)} />
              <Image src={img4} onClick={() => setImage(img4)} />
            </Image.Group>
            <Divider hidden />
          </Tab.Pane>
        ),
      },
    ]
  } else {
    panes = null
  }

  const siteOptions = sitesData.sites.map(site => ({
    key: site.site_id,
    text: site.name,
    value: site.site_id,
  }))

  return (
    <Layout>
      <Container>
        <Grid>
          <GridColumn width={6}>
            <h2
              className={siteStyles.siteHeader}
            >{`${siteData.name} (${siteData.site_id})`}</h2>

            <p className={siteStyles.siteDescription}>
              {siteData.description} Please contact{" "}
              <a href="mailto:helen@thewatershedproject.org">Helen Fitanides</a>{" "}
              if you’d like to join us!
            </p>
            <div className={siteStyles.links}>
              <Link to={`/creek/${sitesData.creek_id}`}>
                Go back to {sitesData.creek_name} overview
              </Link>
            </div>
            <h3 className={siteStyles.sitesHeader}>
              Sites on {sitesData.creek_name}
            </h3>
            <Dropdown
              placeholder="Select Site"
              fluid
              selection
              defaultValue={siteData.site_id}
              options={siteOptions}
              onChange={(e, data) => navigate(`site/${data.value}`)}
            />
          </GridColumn>
          <GridColumn width={10}>
            {siteWQDataExists ? (
              <Tab
                menu={{ secondary: true, pointing: true }}
                panes={panes}
              ></Tab>
            ) : (
              <Fragment>
                <h2 className={siteStyles.sitesHeader}>No Data</h2>
                <p className={siteStyles.siteDescription}>This site is inactive</p>
              </Fragment>
            )}
          </GridColumn>
        </Grid>
      </Container>
    </Layout>
  )
}

// Possibly need to refactor this query to contain more Creek data
export const query = graphql`
  query($siteID: String!, $creekID: String!) {
    allCreekSiteJson(
      filter: { sites: { elemMatch: { site_id: { eq: $siteID } } } }
    ) {
      edges {
        node {
          creek_id
          creek_name
          sites {
            lat
            long
            name
            site_id
            description
            label
          }
        }
      }
    }
    allFieldDataJson(filter: { creek_id: { eq: $creekID } }) {
      edges {
        node {
          StationCode
          AnalyteName
          UnitDescription
          UnitName
          label
          data {
            Result
            SampleDate(formatString: "")
          }
        }
      }
    }
  }
`
