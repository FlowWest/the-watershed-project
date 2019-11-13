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
        <p>
          If you’d like to take a look at our data in its raw form, you can
          download it{" "}
          <a href="https://the-watershed-project.s3-us-west-2.amazonaws.com/the-watershed-project-water-quality-data.xlsx">
            here
          </a>
          .
        </p>
      </Container>
    </Layout>
  )
}

export default Download
