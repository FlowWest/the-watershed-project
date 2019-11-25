/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
// import { useStaticQuery, graphql } from "gatsby"
import 'semantic-ui-css/semantic.min.css'
import 'mapbox-gl/dist/mapbox-gl.css';

import SiteHeader from "./siteHeader"
import Footer from "./footer"
import layoutStyles from "../styles/layout.module.css"
// import "./layout.css"

const Layout = ({ children }) => {
  // const data = useStaticQuery(graphql`
  //   query SiteTitleQuery {
  //     site {
  //       siteMetadata {
  //         title
  //       }
  //     }
  //   }
  // `)

  return (
    <div>
      <SiteHeader />
      <div className={layoutStyles.children}>
        {children}
      </div>
      <Footer />
    </div>

  )
}


export default Layout
