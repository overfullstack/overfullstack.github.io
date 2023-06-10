import { graphql, StaticQuery } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { Helmet } from "react-helmet"

const query = graphql`
  query GetSiteMetadata {
    site {
      siteMetadata {
        blogTitle
        subtitle
        siteUrl
        author {
          name
        }
        social {
          twitter
        }
      }
    }
  }
`

const SEO = ({ meta, cover, title, description, slug }) => (
  <StaticQuery
    query={query}
    render={(data) => {
      const { siteMetadata } = data.site
      const metaDescription = description || siteMetadata.description
      const metaImage = cover ? `${siteMetadata.siteUrl}/${cover}` : null
      const url = `${siteMetadata.siteUrl}${slug}`
      return (
        <Helmet
          htmlAttributes={{ lang: `en` }}
          {...(title
            ? {
                titleTemplate: `%s | ${siteMetadata.blogTitle} | ${siteMetadata.author.name}`,
                title,
              }
            : {
                title: `${siteMetadata.blogTitle} | ${siteMetadata.author.name}`,
              })}
          meta={[
            {
              name: `description`,
              content: metaDescription,
            },
            {
              property: `og:url`,
              content: url,
            },
            {
              property: `og:title`,
              content: title || siteMetadata.title,
            },
            {
              property: `og:description`,
              content: metaDescription,
            },
            {
              name: `twitter:card`,
              content: `summary`,
            },
            {
              name: `twitter:creator`,
              content: siteMetadata.social.twitter,
            },
            {
              name: `twitter:title`,
              content: title || siteMetadata.title,
            },
            {
              name: `twitter:description`,
              content: metaDescription,
            },
          ]
            .concat(
              metaImage
                ? [
                    {
                      property: `og:image`,
                      content: metaImage,
                    },
                    {
                      name: `twitter:image`,
                      content: metaImage,
                    },
                  ]
                : []
            )
            .concat(meta)}
        />
      )
    }}
  />
)

SEO.defaultProps = {
  meta: [],
  slug: ``,
}

SEO.propTypes = {
  description: PropTypes.string.isRequired,
  cover: PropTypes.string.isRequired,
  meta: PropTypes.array,
  slug: PropTypes.string,
  title: PropTypes.string,
}

export default SEO
