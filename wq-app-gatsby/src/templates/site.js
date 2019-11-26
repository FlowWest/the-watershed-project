import React, { useState, Fragment } from "react"
import { graphql, Link, navigate } from "gatsby"
import _ from "underscore"
import Layout from "../components/layout"
import SEO from "../components/seo"

import {
  Grid,
  GridColumn,
  Tab,
  Dropdown,
  Divider,
  Image,
  Container,
  Accordion,
} from "semantic-ui-react"

import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import moment from "moment"
import siteStyles from "../styles/site.module.css"

export default ({ data, pageContext }) => {
  const images = data.allImagesCsv.edges
    .filter(edge => edge.node.ID === pageContext.siteID)
    .map(image => image.node)

  _.sortBy(images, "imageOrder")

  const firstAnalyte = pageContext.siteID === "BAX030" ? "Lead" : "Temperature"
  const [analyte, setAnalyte] = useState(firstAnalyte)
  const [selectedImage, setImage] = useState(images[0])

  const sitesData = data.allCreekSiteJson.edges[0].node
  const [siteData] = sitesData.sites.filter(
    site => site.site_id === pageContext.siteID
  )

  const siteWQData = data.allFieldDataJson.edges.filter(
    edge => edge.node.StationCode === pageContext.siteID
  )

  const siteWQDataExists = siteWQData.length !== 0

  let panes
  const thresholdData = data.allWaterQualityThresholdsCsv.edges.filter(
    edge => edge.node.analyteName === analyte
  )

  const {
    thresholdDirection,
    aquaticThreshold,
    aquaticThreshold2,
    sourceLinkText,
    sourceURL,
    notes,
    category,
  } = thresholdData[0].node

  const wqFeatureDetails =
    pageContext.siteID === "BAX030"
      ? ""
      : data.allWqCategoriesFeaturesJson.edges
          .filter(edge => edge.node.category === category)[0]
          .node.features.filter(feature => feature.name === analyte)[0]
          .feature_description

  const barColors = {inflow: 'rgb(124, 181, 236)', outflow: 'rgb(247, 163, 92)'}

  const seriesAllSites =
    pageContext.siteID === "BAX030"
      ? _.chain(
          data.allFieldDataJson.edges.filter(
            edge =>
              (edge.node.AnalyteName === analyte) &
              (edge.node.StationCode === "BAX030")
          )[0].node.data
        )
          .groupBy("FlowDirection")
          .mapObject((val, key) => ({
            name: key,
            data: val.map(pt => [
              moment.utc(pt.SampleDate).valueOf(),
              pt.Result,
            ]),
            color: barColors[key]
          }))
          .values()
          .value()
      : data.allFieldDataJson.edges
          .filter(edge => edge.node.AnalyteName === analyte)
          .map(station => ({
            name: station.node.label,
            data: station.node.data.map(pt => [
              moment.utc(pt.SampleDate).valueOf(),
              pt.Result,
            ]),
            visible:
              station.node.StationCode === pageContext.siteID ? true : false,
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

    const unit = analyte !== "pH" ? plotData.UnitName : ""

    const label =
      thresholdDirection === "between"
        ? `${analyte} should be ${thresholdDirection} ${aquaticThreshold} and ${aquaticThreshold2} ${unit}`
        : `${analyte} should be ${thresholdDirection} ${aquaticThreshold} ${unit}`

    const green = "rgba(30, 130, 76, .1)"
    const red = "rgba(204, 0, 0, .1)"

    let color1 =
      thresholdDirection === "above" || thresholdDirection === "between"
        ? red
        : green
    let color2 = thresholdDirection === "above" ? green : red

    const plotBands =
      thresholdDirection === "between"
        ? [
            {
              color: red,
              from: 0,
              to: parseFloat(aquaticThreshold),
            },
            {
              color: red,
              from: parseFloat(aquaticThreshold2),
              to: parseFloat(aquaticThreshold2) + 5000,
            },
            {
              color: green,
              from: parseFloat(aquaticThreshold),
              to: parseFloat(aquaticThreshold2),
            },
          ]
        : [
            {
              color: color1,
              from: 0,
              to: parseFloat(aquaticThreshold),
            },
            {
              color: color2,
              from: parseFloat(aquaticThreshold),
              to: parseFloat(aquaticThreshold) + 5000,
            },
          ]

    const detailsPanel = [
      {
        key: "details",
        title: "more details",
        content: {
          content: (
            <div>
              <h4>
                {category}: {analyte}
              </h4>
              <p>{wqFeatureDetails}</p>
              <p>{label}</p>
              <p>
                {notes === "NA" ? "" : notes} (Source:{" "}
                <a href={sourceURL} target="_blank" rel="noopener noreferrer">
                  {sourceLinkText}
                </a>
                )
              </p>
            </div>
          ),
        },
      },
    ]

    const plotOptions = {
      title: {
        text: "",
      },
      chart: {
        type: pageContext.siteID === "BAX030" ? "column" : "line",
        zoomType: "xy",
      },
      xAxis: {
        type: "datetime",
        title: {
          text: "Date",
        },
      },
      yAxis: {
        title: {
          text:
            analyte === "pH"
              ? `${plotData.AnalyteName} ${unit}`
              : `${plotData.AnalyteName} (${unit})`,
        },
        min: 0,
        plotLines: [
          {
            color: "rgba(204, 0, 0, 1)",
            dashStyle: "dash",
            value: aquaticThreshold,
            width: 2,
          },
          {
            color: "rgba(204, 0, 0, 1)",
            dashStyle: "dash",
            value: aquaticThreshold2 || null,
            width: 2,
          },
        ],
        plotBands: plotBands,
      },
      series: seriesAllSites,
      credits: {
        enabled: false,
      },
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
            <p>Click and drag on the chart to zoom in</p>
            {aquaticThreshold !== null ? (
              <Accordion panels={detailsPanel} />
            ) : null}
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Images",
        render: () => (
          <Tab.Pane attached={false}>
            <a
              href={selectedImage.imageURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src={selectedImage.imageURL} alt="image"></Image>
            </a>
            <Divider hidden />
            <Image.Group size="tiny">
              {images.map(image => (
                <Image src={image.imageURL} onClick={() => setImage(image)} />
              ))}
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
        <SEO title={pageContext.name} />
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
                <p className={siteStyles.siteDescription}>
                  This site is inactive
                </p>
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
            FlowDirection
          }
        }
      }
    }
    allWaterQualityThresholdsCsv {
      edges {
        node {
          analyteName
          aquaticThreshold
          aquaticThreshold2
          sourceLinkText
          sourceURL
          notes
          thresholdDirection
          units
          category
        }
      }
    }
    allWqCategoriesFeaturesJson {
      edges {
        node {
          category
          description
          features {
            name
            feature_description
          }
        }
      }
    }
    allImagesCsv {
      edges {
        node {
          imageOrder
          imageURL
          ID
        }
      }
    }
  }
`
