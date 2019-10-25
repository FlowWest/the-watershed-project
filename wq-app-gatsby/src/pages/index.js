import React, { Fragment } from "react"
import { Link } from "gatsby"
import { Grid, GridColumn } from "semantic-ui-react"
import ScrollModal from "../components/scrollModal"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { useStaticQuery, graphql } from "gatsby"

const IndexPage = () => {
  const wqCategoriesData = useStaticQuery(graphql`
  query {
    allTestJson {
      edges {
        node {
          category
          description
          wqFeatures {
            name
            description
          }
        }
      }
    }
  }
  `)



  return (
    <Layout>
      <SEO title="Home" />
      <Grid>
        {wqCategoriesData.allTestJson.edges.map( (edge, index) => {
          return (
            <Fragment key={index}>
              <GridColumn width={4}>
                <ScrollModal 
                  category={edge.node.category} 
                  description={edge.node.description} 
                  wqFeatures={edge.node.wqFeatures}
                />
              </GridColumn>
            </Fragment>
          )
        })}
        <GridColumn width={8}>
          <h2>Welcome</h2>
          <p>
            The Watershed Project works with community groups and volunteers to
            monitor the health of creeks in Contra Costa County. This site
            explores the data we’ve collected, as well as additional data
            collected by other groups. To get involved in our creek monitoring
            program, please contact{" "}
            <a href="mailto:helen@thewatershedproject.org">Helen Fitanides</a>.
          </p>
        </GridColumn>
      </Grid>
    </Layout>
  )
}

export default IndexPage
