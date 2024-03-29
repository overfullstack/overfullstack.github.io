const _ = require(`lodash`)
const createPageAsync = require(`bluebird`)
const path = require(`path`)
const slash = require(`slash`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new createPageAsync((resolve, reject) => {
    const pageTemplate = path.resolve(`./src/templates/page-template.jsx`)
    const postTemplate = path.resolve(`./src/templates/post-template.jsx`)
    const tagTemplate = path.resolve(`./src/templates/tag-template.jsx`)
    const categoryTemplate = path.resolve(
      `./src/templates/category-template.jsx`
    )

    graphql(`
      {
        allMdx(
          sort: { frontmatter: { date: DESC } }
          limit: 1000
          filter: { frontmatter: { draft: { ne: true } } }
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                tags
                layout
                category
              }
              internal {
                contentFilePath
              }
            }
          }
        }
      }
    `).then((result) => {
      if (result.errors) {
        console.log(result.errors)
        reject(result.errors)
      }

      const edges = result.data.allMdx.edges
      _.each(edges, (edge, index) => {
        if (_.get(edge, `node.frontmatter.layout`) === `page`) {
          createPage({
            path: edge.node.fields.slug,
            component: `${slash(pageTemplate)}?__contentFilePath=${
              edge.node.internal.contentFilePath
            }`,
            context: { slug: edge.node.fields.slug },
          })
        } else if (_.get(edge, `node.frontmatter.layout`) === `post`) {
          const previous =
            index === edges.length - 1 ? null : edges[index + 1].node
          // index === 2 instead of 0 to skip about me and contact me
          const next = index === 2 ? null : edges[index - 1].node
          createPage({
            path: edge.node.fields.slug,
            component: `${slash(postTemplate)}?__contentFilePath=${
              edge.node.internal.contentFilePath
            }`,
            context: {
              slug: edge.node.fields.slug,
              previous,
              next,
            },
          })

          let tags = []
          if (_.get(edge, `node.frontmatter.tags`)) {
            tags = tags.concat(edge.node.frontmatter.tags)
          }

          tags = _.uniq(tags)
          _.each(tags, (tag) => {
            const tagPath = `/tags/${_.kebabCase(tag)}/`
            createPage({
              path: tagPath,
              component: `${slash(tagTemplate)}?__contentFilePath=${
                edge.node.internal.contentFilePath
              }`,
              context: { tag },
            })
          })

          let categories = []
          if (_.get(edge, `node.frontmatter.category`)) {
            categories = categories.concat(edge.node.frontmatter.category)
          }

          categories = _.uniq(categories)
          _.each(categories, (category) => {
            const categoryPath = `/categories/${_.kebabCase(category)}/`
            createPage({
              path: categoryPath,
              component: `${slash(categoryTemplate)}?__contentFilePath=${
                edge.node.internal.contentFilePath
              }`,
              context: { category },
            })
          })
        }
      })

      resolve()
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `File`) {
    const parsedFilePath = path.parse(node.absolutePath)
    const pageOrPostName = parsedFilePath.dir.split(`---`)[1]
    const slug = `/${pageOrPostName}/`
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  } else if (node.internal.type === `Mdx` && typeof node.slug === `undefined`) {
    const fileNode = getNode(node.parent)
    let slug = ``
    if (fileNode.fields !== undefined) {
      slug = fileNode.fields.slug
    }
    if (typeof node.frontmatter.path !== `undefined`) {
      slug = node.frontmatter.path
    }
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })

    if (node.frontmatter.tags) {
      const tagSlugs = node.frontmatter.tags.map(
        (tag) => `/tags/${_.kebabCase(tag)}/`
      )
      createNodeField({
        node,
        name: `tagSlugs`,
        value: tagSlugs,
      })
    }

    if (typeof node.frontmatter.category !== `undefined`) {
      const categorySlug = `/categories/${_.kebabCase(
        node.frontmatter.category
      )}/`
      createNodeField({
        node,
        name: `categorySlug`,
        value: categorySlug,
      })
    }
  }
}
