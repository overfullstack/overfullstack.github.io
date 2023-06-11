import { graphql } from "gatsby"
import React from "react"
import { Helmet } from "react-helmet"

import CategoryTemplateDetails from "../components/CategoryTemplateDetails"
import Layout from "../components/Layout"
import Sidebar from "../components/Sidebar"

const CategoryTemplate = (props) => {
  const { blogTitle } = props.data.site.siteMetadata
  const { category } = props.pageContext

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
          <Sidebar {...props} />
          <CategoryTemplateDetails {...props} />
        </div>
      </Layout>
    </div>
  )
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
          youtube
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
      sort: { frontmatter: { date: DESC } }
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
