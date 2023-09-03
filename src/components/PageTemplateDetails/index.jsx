import "./style.scss"

import React from "react"

import { Sidebar } from "../Sidebar"

export const PageTemplateDetails = (props) => {
  const page = props.data.mdx

  return (
    <div>
      <Sidebar {...props} />
      <div className="content">
        <div className="content__inner">
          <div className="page">
            <h1 className="page__title">{page.frontmatter.title}</h1>
            <div className="page__body">{props.children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageTemplateDetails
