import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"

export default ({ data }) => {
  const creekData = data.allCreekSiteJson.edges[0].node
  return (
    <Layout>
      <div>
        <h1>{creekData.creek_name}</h1>
        <p>{creekData.creek_description}</p>
        <ul>
          {creekData.sites.map((site, index) => {
            return(
              <li key={index}>
                <Link to={`site/${site.site_id}`}>{site.name}</Link>
              </li>
            )
          })}
        </ul>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($creekID: String!) {
    allCreekSiteJson(filter: {creek_id: {eq: $creekID}}) {
      edges {
        node {
          creek_name
          creek_description
          creek_id
          sites {
            site_id
            name
            descripiton
          }
        }
      }
    }
  }
`

