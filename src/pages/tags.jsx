import { graphql, Link } from "gatsby"
import kebabCase from "lodash/kebabCase"
import React from "react"
import { Helmet } from "react-helmet"

import Layout from "../components/Layout"
import Sidebar from "../components/Sidebar"

const TagsRoute = (props) => {
  const { blogTitle } = props.data.site.siteMetadata
  const tags = props.data.allMarkdownRemark.group

  return (
    <Layout>
      <div>
        <Helmet title={`All Tags - ${blogTitle}`} />
        <Sidebar {...props} />
        <div className="content">
          <div className="content__inner">
            <div className="page">
              <h1 className="page__title">Tags</h1>
              <div className="page__body">
                <div className="tags">
                  <ul className="tags__list">
                    {tags.map((tag) => (
                      <li key={tag.fieldValue} className="tags__list-item">
                        <Link
                          to={`/tags/${kebabCase(tag.fieldValue)}/`}
                          className="tags__list-item-link"
                        >
                          {tag.fieldValue} ({tag.totalCount})
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default TagsRoute

export const pageQuery = graphql`
  query TagsQuery {
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
      limit: 2000
      filter: { frontmatter: { layout: { eq: "post" }, draft: { ne: true } } }
    ) {
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
      }
    }
  }
`
