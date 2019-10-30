import React, { Fragment } from "react"
// import { Link } from "gatsby"
import { Grid, GridColumn, Container } from "semantic-ui-react"
import ScrollModal from "../components/scrollModal"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { useStaticQuery, graphql } from "gatsby"
import homeStyles from '../styles/home.module.css';
import WQFeature from '../components/wqFeature'

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
    }
  `)

  return (
    <Layout>
      <SEO title="Home" />
      <Container>
        <Grid>
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
          <GridColumn width={8}>
            <h2 className={homeStyles.welcomeHeader}>Welcome</h2>
            <p className={homeStyles.welcomeText} >
              The Watershed Project works with community groups and volunteers to
              monitor the health of creeks in Contra Costa County. This site
              explores the data we’ve collected, as well as additional data
              collected by other groups. To get involved in our creek monitoring
              program, please contact{" "}
              <a href="mailto:helen@thewatershedproject.org">Helen Fitanides</a>.
            </p>
          </GridColumn>
        </Grid>
      </Container>
    </Layout>
  )
}

export default IndexPage
