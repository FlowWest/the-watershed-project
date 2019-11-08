import React from "react"
import { Container } from "semantic-ui-react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import styles from "../styles/404.module.css"
import { Link } from "gatsby"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <Container>
      <h1 className={styles.header}>NOT FOUND</h1>
      <p className={styles.paragraph}>
        You just hit a route that doesn&#39;t exist... the sadness.
      </p>
      <p className={styles.paragraph}>
        <Link to="/">Go home</Link>
      </p>
    </Container>
  </Layout>
)

export default NotFoundPage
