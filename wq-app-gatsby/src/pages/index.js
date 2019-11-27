import React, { Fragment } from "react"
import {
  Grid,
  GridColumn,
  Container,
  Divider,
  Message,
} from "semantic-ui-react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { useStaticQuery, graphql, Link } from "gatsby"
import homeStyles from "../styles/home.module.css"
import WQFeature from "../components/wqFeature"
import Mapbox from "../components/homeMap"

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query {
      allWqCategoriesFeaturesJson {
        edges {
          node {
            category
            description
            features {
              feature_description
              name
            }
          }
        }
      }
      allCreekSiteJson {
        edges {
          node {
            creek_name
            creek_id
          }
        }
      }
      allCreekSiteJson {
        edges {
          node {
            creek_name
            creek_id
            sites {
              description
              name
              site_id
              lat
              long
            }
          }
        }
      }
      allTwpCedenSitesCsv {
        edges {
          node {
            lat
            long
            name
            site_id
            source
          }
        }
      }
    }
  `)

  const pts = [].concat(
    ...data.allTwpCedenSitesCsv.edges.map(edge => edge.node)
  )

  return (
    <Layout>
      <SEO title="Home" />
      <Container>
        <Grid>
          <GridColumn width={16}>
            <h2 className={homeStyles.welcomeHeader}>Welcome</h2>
            <p className={homeStyles.welcomeText}>
              The Watershed Project works with community groups and volunteers
              to monitor the health of creeks in Contra Costa County. This site
              explores the data we’ve collected, as well as additional data
              collected by other groups. To get involved in our creek monitoring
              program, please contact{" "}
              <a href="mailto:helen@thewatershedproject.org">Helen Fitanides</a>
              .
            </p>
            <Divider />
          </GridColumn>
          <GridColumn width={16}>
            <h2 className={homeStyles.learnHeader}>
              Learn About Water Quality Features
            </h2>
          </GridColumn>
          <Grid centered>
            {data.allWqCategoriesFeaturesJson.edges
              .filter(
                edge =>
                  (edge.node.category !== "Restoration Sites") &
                  (edge.node.category !== "Observations")
              )
              .map((edge, index) => {
                return (
                  <Fragment key={index}>
                    <GridColumn width={5}>
                      <WQFeature
                        category={edge.node.category}
                        description={edge.node.description}
                        features={edge.node.features}
                      />
                    </GridColumn>
                  </Fragment>
                )
              })}
          </Grid>
          <GridColumn width={16}>
            <Divider />
            <h2 className={homeStyles.learnHeader}>
              Contra Costa County Creeks
            </h2>
            <p className={homeStyles.welcomeText}>
              Contra Costa County has over 20 major creeks, as identified by the
              <a
                href="http://cocowaterweb.org/wp-content/uploads/Watershed-Atlas.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                Contra Costa County Watershed Atlas
              </a>
              . Spread out through natural and urban spaces, these waterways
              exist in several forms: natural, concrete, or underground. An
              estimated 35% of the land that drains to these creeks is made up
              of impervious surfaces such as roads and houses, which contributes
              to runoff pollution during storms, as the rain is not able to
              filter through the soil.
            </p>
          </GridColumn>
          <GridColumn width={4}>
            <Message>
              <h3 className={homeStyles.creekHeader}>
                Explore Creeks We Monitor
              </h3>
              <ul>
                {data.allCreekSiteJson.edges.map((edge, index) => {
                  return (
                    <li key={index}>
                      <Link
                        to={`/creek/${edge.node.creek_id}`}
                        className={homeStyles.creekName}
                      >
                        {edge.node.creek_name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </Message>
          </GridColumn>
          <GridColumn width={12}>
            <Mapbox
              pts={pts}
              lat={37.929787}
              long={-122.076019}
              zoom={9}
              height={"100%"}
            />
            <p className={homeStyles.note}>
              Note: Shaded regions are watersheds that The Watershed Project (TWP)
              currently monitors, click to navigate to a creek overview page.
              <br></br>
              CEDEN (California Environmental Data Exchange Network) is a state
              database housing water quality data from multiple agencies and
              groups.
            </p>
          </GridColumn>
        </Grid>
      </Container>
    </Layout>
  )
}

export default IndexPage
