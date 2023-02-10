/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ actions }) => {
  const { createPage } = actions
  createPage({
    path: "/using-dsg",
    component: require.resolve("./src/templates/using-dsg.js"),
    context: {},
    defer: true,
  })
}

exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    ContentfulPageJson: {
      programs: {
        type: ['ProgramJson'],
        resolve: async (source, args, context, info) => {
          const { entries } = await context.nodeModel.findAll({
            query: {
              filter: {
                uuid: { in: source.uuidList },
              },
            },
            type: 'ProgramJson',
          });
          return entries;
        },
      },
    },
    ProgramJson: {
      contentfulPage: {
        type: 'ContentfulPageJson',
        resolve: async (source, args, context, info) => {
          const node = await context.nodeModel.findOne({
            query: {
              filter: {
                uuidList: { eq: source.uuid },
              },
            },
            type: 'ContentfulPageJson',
          });
          return node;
        },
      },
    },
  };

  createResolvers(resolvers);
}
