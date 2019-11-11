import React, { Fragment, useState, useEffect } from "react"
import { graphql, Link } from "gatsby"
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
import homeStyles from "../styles/home.module.css"

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

  // TODO - figure out how to have a componentDidMount like function that will grab a analyte that exists at the site
  // useEffect(() => {
  //   const siteWQData = data.allFieldDataJson.edges
  //   const siteWQDataExists = siteWQData.length !== 0

  //   if (siteWQDataExists) {
  //     const firstAnalyte = siteWQData[0].node.AnalyteName
  //     setAnalyte(firstAnalyte)
  //   }
  // }, [analyte])

  const seriesAllSites = data.allFieldDataJson.edges
    .filter(edge => edge.node.AnalyteName === analyte)
    .map(station => ({
      name: station.node.StationCode,
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
      },
      series: seriesAllSites,
      // [
      //   {
      //     name: plotData.AnalyteName,
      //     data: plotData.data.map(pt => [
      //       moment.utc(pt.SampleDate).valueOf(),
      //       pt.Result,
      //     ]),
      //   },
      //   {
      //     name: "Threshold",
      //     data: [
      //       [moment.utc(plotData.data[0].SampleDate).valueOf(), 16],
      //       [
      //         moment
      //           .utc(plotData.data[plotData.data.length - 1].SampleDate)
      //           .valueOf(),
      //         16,
      //       ],
      //     ],
      //   },
      // ],
    }

    const handleAnalyteChange = e => {
      e.preventDefault()
      return setAnalyte(e.target.textContent)
    }

    panes = [
      {
        menuItem: "Within",
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
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Between",
        render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane>,
      },
    ]
  } else {
    panes = null
  }

  return (
    <Layout>
      <Container>
        <Grid>
          <GridColumn width={6}>
            <h2>{siteData.name}</h2>
            <Image src={selectedImage} alt="image"></Image>
            <Divider hidden />
            <Image.Group size="tiny">
              <Image src={img1} onClick={() => setImage(img1)} />
              <Image src={img2} onClick={() => setImage(img2)} />
              <Image src={img3} onClick={() => setImage(img3)} />
              <Image src={img4} onClick={() => setImage(img4)} />
            </Image.Group>
            <Divider hidden />
            <p>
              {siteData.description} Please contact{" "}
              <a href="mailto:helen@thewatershedproject.org">Helen Fitanides</a>{" "}
              if you’d like to join us!
            </p>
            <div className={homeStyles.links}>
              <Link to={`/creek/${sitesData.creek_id}`}>
                Go back to {sitesData.creek_name}
              </Link>
            </div>
            <h3>Other Sites on {sitesData.creek_name}</h3>
            <ul>
              {sitesData.sites
                .filter(site => site.site_id !== pageContext.siteID)
                .map(site => {
                  return (
                    <Fragment key={site.site_id}>
                      <li className={homeStyles.li}>
                        <Link to={`site/${site.site_id}`}>{site.name}</Link>
                      </li>
                    </Fragment>
                  )
                })}
            </ul>
          </GridColumn>
          <GridColumn width={10}>
            {siteWQDataExists ? (
              <Tab
                menu={{ secondary: true, pointing: true }}
                panes={panes}
              ></Tab>
            ) : (
              <p>hi</p>
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
          data {
            Result
            SampleDate(formatString: "")
          }
        }
      }
    }
  }
`

// allFieldDataJson(filter: { StationCode: { eq: $siteID } }) {
//   edges {
//     node {
//       StationCode
//       AnalyteName
//       UnitDescription
//       UnitName
//       data {
//         Result
//         SampleDate(formatString: "")
//       }
//     }
//   }
// }
