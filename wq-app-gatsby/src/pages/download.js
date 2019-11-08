import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Container } from "semantic-ui-react"

const Download = () => {
  return (
    <Layout>
      <Container>
        <SEO title="Download" />
        <h1>Download</h1>
        <a href="https://the-watershed-project.s3-us-west-2.amazonaws.com/the-watershed-project-water-quality-data.xlsx">Download Water Quality Data</a>
      </Container>
    </Layout>
  )
}

export default Download
