import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Container } from "semantic-ui-react"
import downloadStyles from "../styles/download.module.css"

const Download = () => {
  return (
    <Layout>
      <Container>
        <SEO title="Download" />
        <h1 className={downloadStyles.header}>Data Download</h1>
        <p className={downloadStyles.paragraph}>
          If you’d like to take a look at our data in its raw form, you can
          download it{" "}
          <a href="https://the-watershed-project-app.s3-us-west-2.amazonaws.com/the-watershed-project-water-quality-data.xlsx">
            here
          </a>
          .
        </p>
        <p className={downloadStyles.paragraph}>
          Please visit{" "}
          <a
            href="https://ceden.waterboards.ca.gov/AdvancedQueryTool"
            target="_blank"
            rel="noopener noreferrer"
          >
            CEDEN
          </a>
          {" "}to download their data.
        </p>
      </Container>
    </Layout>
  )
}

export default Download
