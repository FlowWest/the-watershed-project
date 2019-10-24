import React from "react"
import { Link } from "gatsby"
import { Grid, GridColumn } from "semantic-ui-react"
import ScrollModal from "../components/scrollModal"
import Layout from "../components/layout"
import SEO from "../components/seo"

const wqCategories = [
  "Vitals",
  "Nutrients",
  "Heavy metals",
  "Insecticides",
  "Other Toxins",
  "Creek Bugs",
  "Observations",
  "Restoration Sites",
]

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Grid>
      {wqCategories.map(wqCategory => {
        return (
          <div>
            <GridColumn width={4}>
              <ScrollModal title={wqCategory} />
            </GridColumn>
          </div>
        )
      })}
      <GridColumn width={8}>
        <h2>Welcome</h2>
        <p>
          The Watershed Project works with community groups and volunteers to
          monitor the health of creeks in Contra Costa County. This site
          explores the data we’ve collected, as well as additional data
          collected by other groups. To get involved in our creek monitoring
          program, please contact <a href="mailto:helen@thewatershedproject.org">Helen Fitanides</a>.
        </p>
      </GridColumn>
    </Grid>
  </Layout>
)

export default IndexPage
