import { graphql, Link } from "gatsby"
import kebabCase from "lodash/kebabCase"
import React from "react"
import { Helmet } from "react-helmet"

import Layout from "../components/Layout"
import Sidebar from "../components/Sidebar"

const CategoriesRoute = (props) => {
  const { blogTitle } = props.data.site.siteMetadata
  const categories = props.data.allMarkdownRemark.group

  return (
    <Layout>
      <div>
        <Helmet title={`All Categories - ${blogTitle}`} />
        <Sidebar {...props} />
        <div className="content">
          <div className="content__inner">
            <div className="page">
              <h1 className="page__title">Categories</h1>
              <div className="page__body">
                <div className="categories">
                  <ul className="categories__list">
                    {categories.map((category) => (
                      <li
                        key={category.value}
                        className="categories__list-item"
                      >
                        <Link
                          to={`/categories/${kebabCase(category.value)}/`}
                          className="categories__list-item-link"
                        >
                          {category.value} ({category.totalCount})
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

export default CategoriesRoute

export const pageQuery = graphql`
  query CategoryesQuery {
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
      group(field: { frontmatter: { category: SELECT } }) {
        fieldValue
        totalCount
      }
    }
  }
`
