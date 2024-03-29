import { graphql } from "gatsby"
import React from "react"
import { Helmet } from "react-helmet"

import Layout from "../components/Layout"
import PageTemplateDetails from "../components/PageTemplateDetails"
import SEO from "../components/SEO"

const PageTemplate = (props) => {
  const { subtitle } = props.data.site.siteMetadata
  const page = props.data.mdx
  const {
    title: pageTitle,
    description: pageDescription,
    cover,
  } = page.frontmatter
  const description = pageDescription !== null ? pageDescription : subtitle

  const actualPageTitle = `${pageTitle}`
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
          title={actualPageTitle}
          description={description}
          cover={cover ? cover.absolutePath : ``}
          slug={page.fields.slug}
        />
        <div>
          <Helmet>
            <title>{`${pageTitle}`}</title>
            <meta name="description" content={description} />
          </Helmet>
          <PageTemplateDetails {...props} />
        </div>
      </Layout>
    </div>
  )
}

export default PageTemplate

export const pageQuery = graphql`
  query PageBySlug($slug: String!) {
    site {
      siteMetadata {
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
    mdx(fields: { slug: { eq: $slug } }) {
      id
      fields {
        slug
      }
      frontmatter {
        title
        date
        description
        cover {
          absolutePath
        }
      }
    }
  }
`
