import React from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import Sidebar from "../components/Sidebar"
import CategoryTemplateDetails from "../components/CategoryTemplateDetails"

class CategoryTemplate extends React.Component {
  render() {
    const { blogTitle } = this.props.data.site.siteMetadata
    const { category } = this.props.pageContext

    return (
      <div
        style={{
          color: `var(--textNormal)`,
          background: `var(--bg)`,
          transition: `color 0.2s ease-out, background 0.2s ease-out`,
          minHeight: `100vh`,
        }}
      >
        <Layout>
          <div>
            <Helmet title={`${category} | ${blogTitle}`} />
            <Sidebar {...this.props} />
            <CategoryTemplateDetails {...this.props} />
          </div>
        </Layout>
      </div>
    )
  }
}

export default CategoryTemplate

export const pageQuery = graphql`
  query CategoryPage($category: String) {
    site {
      siteMetadata {
        blogTitle
        subtitle
        copyright
        declaration
        menu {
          label
          path
        }
        author {
          name
          email
          telegram
          twitter
          github
          linkedin
          stackoverflow
          aboutme
        }
      }
    }
    allMarkdownRemark(
      limit: 1000
      filter: {
        frontmatter: {
          category: { eq: $category }
          layout: { eq: "post" }
          draft: { ne: true }
        }
      }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          fields {
            slug
            categorySlug
          }
          timeToRead
          frontmatter {
            title
            date
            category
            description
          }
        }
      }
    }
  }
`
