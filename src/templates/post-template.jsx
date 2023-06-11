import "katex/dist/katex.min.css"

import { graphql } from "gatsby"
import React from "react"
import { Helmet } from "react-helmet"

import Layout from "../components/Layout"
import PostTemplateDetails from "../components/PostTemplateDetails"
import SEO from "../components/SEO"

const PostTemplate = (props) => {
  const { subtitle } = props.data.site.siteMetadata
  const post = props.data.markdownRemark
  const {
    title: postTitle,
    description: postDescription,
    cover,
  } = post.frontmatter
  const description = postDescription !== null ? postDescription : subtitle

  const actualPostTitle = `${postTitle}`
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
        <SEO
          title={actualPostTitle}
          description={description}
          cover={cover ? cover.childImageSharp.original.src : ``}
          slug={post.fields.slug}
        />
        <div>
          <Helmet>
            <title>{actualPostTitle}</title>
            <meta name="description" content={description} />
          </Helmet>
          <PostTemplateDetails {...props} />
        </div>
      </Layout>
    </div>
  )
}

export default PostTemplate

export const pageQuery = graphql`
  query PostBySlug($slug: String!) {
    site {
      siteMetadata {
        blogTitle
        subtitle
        copyright
        declaration
        author {
          name
          twitter
          github
          linkedin
          youtube
          email
          stackoverflow
          aboutme
          resume
        }
        disqusShortname
        url
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      timeToRead
      fields {
        tagSlugs
        slug
      }
      frontmatter {
        title
        tags
        date
        description
        cover {
          childImageSharp {
            original {
              src
            }
          }
        }
      }
    }
  }
`
