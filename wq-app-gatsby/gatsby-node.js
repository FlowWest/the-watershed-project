exports.createPages = async function({ actions, graphql }) {
  const creekData = await graphql(`
    query {
      allCreekSiteJson {
        edges {
          node {
            creek_id
            creek_name
          }
        }
      }
    }
  `)

  const siteData = await graphql(`
    query {
      allSitesJson {
        edges {
          node {
            site_id
            creek_id
            name
            description
          }
        }
      }
    }
  `)

  const cedenSiteData = await graphql(`
    query {
      allExternalCedenJson {
        edges {
          node {
            StationCode
            StationName
          }
        }
      }
    }
  `)

  creekData.data.allCreekSiteJson.edges.forEach(edge => {
    const creekID = edge.node.creek_id
    const creekName = edge.node.creek_name
    actions.createPage({
      path: `creek/${creekID}`,
      component: require.resolve(`./src/templates/creek.js`),
      context: { creekID,creekName },
    })
  })

  siteData.data.allSitesJson.edges.forEach(edge => {
    const siteID = edge.node.site_id
    const creekID = edge.node.creek_id
    const { name, description } = edge.node
    actions.createPage({
      path: `site/${siteID}`,
      component: require.resolve(`./src/templates/site.js`),
      context: { siteID, creekID, name, description },
    })
  })

  cedenSiteData.data.allExternalCedenJson.edges.forEach(edge => {
    const stationCode = edge.node.StationCode
    const stationName = edge.node.StationName
    actions.createPage({
      path: `ceden-site/${stationCode}`,
      component: require.resolve(`./src/templates/ceden-site.js`),
      context: { stationCode, stationName }
    })
  })
}
