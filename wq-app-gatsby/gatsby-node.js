exports.createPages = async function({ actions, graphql }) {
  const creekData = await graphql(`
    query {
      allCreekSiteJson {
        edges {
          node {
            creek_id
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
          creek_name
          creek_id
          name
          description
        }
      }
    }
  }
  `);

  creekData.data.allCreekSiteJson.edges.forEach(edge => {
    const creekID = edge.node.creek_id
    actions.createPage({
      path: `creek/${creekID}`,
      component: require.resolve(`./src/templates/creek.js`),
      context: { creekID: creekID },
    })
  })

  siteData.data.allSitesJson.edges.forEach(edge => {
    const siteID = edge.node.site_id;
    const { name, description } = edge.node
    actions.createPage({
      path: `site/${siteID}`,
      component: require.resolve(`./src/templates/site.js`),
      context: { siteID, name, description }
    })
  })
}
