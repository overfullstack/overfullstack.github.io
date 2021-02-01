import React from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import Sidebar from "../components/Sidebar"
import TagTemplateDetails from "../components/TagTemplateDetails"

class TagTemplate extends React.Component {
  render() {
    const { blogTitle } = this.props.data.site.siteMetadata
    const { tag } = this.props.pageContext

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
            <Sidebar {...this.props} />
            <TagTemplateDetails {...this.props} />
          </div>
        </Layout>
      </div>
    )
  }
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
