import React, { Fragment, useState } from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import img1 from '../images/Monitoring-Walnut-Creek-crop-1012x1024.jpg'
import img2 from '../images/20180502_105406.jpg'
import img3 from '../images/20180816_111841.jpg'
import img4 from '../images/20180824_121105.jpg'

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

export default ({ data, pageContext }) => {
  const defaultAnalyte = "Temperature"
  const [analyte, setAnalyte] = useState(defaultAnalyte)
  const [selectedImage, setImage] = useState(img1)

  const sitesData = data.allCreekSiteJson.edges[0].node
  const [siteData] = sitesData.sites.filter(
    site => site.site_id === pageContext.siteID
  )

  const sitesWQData = data.allFieldDataJson.edges
  const plotData = sitesWQData.filter(
    edge => edge.node.AnalyteName === analyte
  )[0].node

  const analyteOptions = sitesWQData.map(edge => ({
    key: edge.node.AnalyteName,
    text: edge.node.AnalyteName,
    value: edge.node.AnalyteName,
  }))

  const plotOptions = {
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
        text: `${plotData.AnalyteName} (${plotData.UnitName})`,
      },
      min: 0,
    },
    series: [
      {
        name: "",
        data: plotData.data.map(pt => [
          moment.utc(pt.SampleDate).valueOf(),
          pt.Result,
        ]),
      },
    ],
  }

  const handleAnalyteChange = e => {
    e.preventDefault()
    return setAnalyte(e.target.textContent)
  }

  const panes = [
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
              defaultValue={defaultAnalyte}
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

  // siteData.images ['1.jpg', '2.jpg', '3.jpg']
  // state defautls to siteData.images[0]
  // group 1, 2, 3 and on click update state
  return (
    <Layout>
      <Container>
        <Grid>
          <GridColumn width={6}>
            <h2>{siteData.name}</h2>
            <Image src={selectedImage} alt="image"></Image>
            <Divider hidden />
            <Image.Group size="tiny">
              <Image src={img1} onClick={()=>(setImage(img1))}/>
              <Image src={img2} onClick={()=>(setImage(img2))}/>
              <Image src={img3} onClick={()=>(setImage(img3))}/>
              <Image src={img4} onClick={()=>(setImage(img4))}/>
            </Image.Group>
            <Divider hidden />
            <p>{siteData.description}</p>
            <Link to={`/creek/${sitesData.creek_id}`}>
              Go back to {sitesData.creek_name}
            </Link>
            <h3>Other Sites on {sitesData.creek_name}</h3>
            <ul>
              {sitesData.sites
                .filter(site => site.site_id !== pageContext.siteID)
                .map(site => {
                  return (
                    <Fragment key={site.site_id}>
                      <li>
                        <Link to={`site/${site.site_id}`}>{site.name}</Link>
                      </li>
                    </Fragment>
                  )
                })}
            </ul>
          </GridColumn>
          <GridColumn width={10}>
            <Tab menu={{ secondary: true, pointing: true }} panes={panes}></Tab>
          </GridColumn>
        </Grid>
      </Container>
    </Layout>
  )
}

// Possibly need to refactor this query to contain more Creek data
export const query = graphql`
  query($siteID: String!) {
    allCreekSiteJson(
      filter: { sites: { elemMatch: { site_id: { eq: $siteID } } } }
    ) {
      edges {
        node {
          creek_name
          creek_id
          sites {
            description
            name
            site_id
          }
        }
      }
    }
    allFieldDataJson(filter: { StationCode: { eq: $siteID } }) {
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
