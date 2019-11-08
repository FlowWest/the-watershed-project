import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Container } from "semantic-ui-react"

const About = () => {
  return (
    <Layout>
      <SEO title="About" />
      <Container>
        <h1>About</h1>
        <p>
          <a href="http://thewatershedproject.org/">The Watershed Project</a>
        </p>
      </Container>
    </Layout>
  )
}

export default About
