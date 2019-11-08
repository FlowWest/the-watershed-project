import React, { Fragment } from "react"
import { Grid, GridColumn, Container, Divider } from "semantic-ui-react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { useStaticQuery, graphql, Link } from "gatsby"
import homeStyles from "../styles/home.module.css"
import WQFeature from "../components/wqFeature"

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
    }
  `)

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
              Learn All About Water Quality Features
            </h2>
          </GridColumn>
          {data.allWqCategoriesFeaturesJson.edges.map((edge, index) => {
            return (
              <Fragment key={index}>
                <GridColumn width={4}>
                  <WQFeature
                    category={edge.node.category}
                    description={edge.node.description}
                    features={edge.node.features}
                  />
                </GridColumn>
              </Fragment>
            )
          })}
          <GridColumn width={16}>
          <Divider />
            <h2 className={homeStyles.learnHeader}>
              Explore Creeks We Monitor
            </h2>
          </GridColumn>
          <GridColumn width={8}>
            <ul>
              {data.allCreekSiteJson.edges.map((edge, index) => {
                return (
                  <li key={index}>
                    <Link to={`/creek/${edge.node.creek_id}`}>
                      {edge.node.creek_name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </GridColumn>
          <GridColumn width={8}>
            <p>place holder</p>
          </GridColumn>
        </Grid>
      </Container>
    </Layout>
  )
}

export default IndexPage
