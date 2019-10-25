/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
exports.createPages = async function({ actions, graphql }) {
  const { data } = await graphql(`
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

  data.allCreekSiteJson.edges.forEach(edge => {
    const creekID = edge.node.creek_id
    actions.createPage({
      path: `creek/${creekID}`,
      component: require.resolve(`./src/templates/creek.js`),
      context: { creekID: creekID },
    })
  })
}
