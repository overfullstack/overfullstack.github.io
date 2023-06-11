import "./style.scss"

import { Link } from "gatsby"
import moment from "moment"
import React from "react"

const Post = (props) => {
  const { title, date, category, description } = props.data.node.frontmatter
  const { slug, categorySlug } = props.data.node.fields

  return (
    <div className="post">
      <div className="post__meta">
        <time
          className="post__meta-time"
          dateTime={moment(date).format(`MMMM D, YYYY`)}
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `var(--textNormal)`,
          }}
        >
          {moment(date).format(`MMMM YYYY`)}
        </time>
        <span className="post__meta-divider" />
        <span className="post__meta-category" key={categorySlug}>
          <Link to={categorySlug} className="post__meta-category-link">
            {category}
          </Link>
        </span>
      </div>
      <h2 className="post__title">
        <Link
          className="post__title-link"
          to={slug}
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `var(--textLink)`,
          }}
        >
          {title}
        </Link>
      </h2>
      <p className="post__description">{description}</p>
    </div>
  )
}

export default Post
