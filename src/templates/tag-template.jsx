import { graphql } from "gatsby"
import React from "react"
import { Helmet } from "react-helmet"

import Layout from "../components/Layout"
import Sidebar from "../components/Sidebar"
import TagTemplateDetails from "../components/TagTemplateDetails"

const TagTemplate = (props) => {
  const { blogTitle } = props.data.site.siteMetadata
  const { tag } = props.pageContext

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
          <Helmet title={`All Posts tagged as "${tag}" | ${blogTitle}`} />
          <Sidebar {...props} />
          <TagTemplateDetails {...props} />
        </div>
      </Layout>
    </div>
  )
}

export default TagTemplate

export const pageQuery = graphql`
  query TagPage($tag: String) {
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
          tags: { in: [$tag] }
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
