import { graphql } from "gatsby"
import React from "react"

import Layout from "../components/Layout"
import Sidebar from "../components/Sidebar"

const NotFoundRoute = (props) => (
  <Layout>
    <div>
      <Sidebar {...props} />
      <div className="content">
        <div className="content__inner">
          <div className="page">
            <h1 className="page__title" style={{ color: `var(--textNormal)` }}>
              NOT FOUND
            </h1>
            <div className="page__body" style={{ color: `var(--textNormal)` }}>
              <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
)

export default NotFoundRoute

export const pageQuery = graphql`
  query NotFoundQuery {
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
  }
`
