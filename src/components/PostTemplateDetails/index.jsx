import "gist-syntax-themes/stylesheets/idle-fingers.css"
import "./style.scss"

import { Link } from "gatsby"
import firebase from "gatsby-plugin-firebase"
import moment from "moment"
import React, { useEffect, useState } from "react"
import styled from "styled-components"

import Disqus from "../Disqus/Disqus"
import { Links } from "../Links"
import Signup from "../Signup/Signup"
import ThemeToggle from "../Toggle/ThemeToggle"
import { formatReadingTime } from "../utils"

export const PostTemplateDetails = ({ data, pageContext }) => {
  const { author } = data.site.siteMetadata
  const { previous, next } = pageContext
  const post = data.markdownRemark
  const tags = post.fields.tagSlugs

  const slug = post.fields.slug.substr(post.fields.slug.lastIndexOf(`/`) + 1)
  const [claps, setClaps] = useState(0)
  const [newClaps, setNewClaps] = useState(0)

  useEffect(() => {
    firebase
      .firestore()
      .collection(`claps`)
      .doc(slug)
      .get()
      .then((res) => {
        if (!res.data()) {
          console.log(`No matching document`)
        } else {
          setClaps(res.data().claps)
        }
      })
      .catch((err) => console.log(err))
  }, [])

  const clapHandler = (e) => {
    e.preventDefault()
    setClaps(claps + 1)
    setNewClaps(newClaps + 1)
    firebase
      .firestore()
      .collection(`claps`)
      .doc(slug)
      .set({ claps: claps + 1, lastClap: new Date() })
      .catch((err) => console.log(err))
  }

  const clapsBtn = (
    <Claps newClaps={newClaps} className="claps">
      <button onClick={clapHandler}>👏🏼</button> {claps} claps
    </Claps>
  )

  const homeBlock = (
    <div>
      <Link className="post-single__home-button" to="/">
        All Articles
      </Link>
      <div className="post-single__theme-toggle">
        <ThemeToggle />
      </div>
      {clapsBtn}
    </div>
  )

  const tagsBlock = (
    <div className="post-single__tags">
      <ul className="post-single__tags-list">
        {tags &&
          tags.map((tag, i) => (
            <li className="post-single__tags-list-item" key={tag}>
              <Link to={tag} className="post-single__tags-list-item-link">
                {post.frontmatter.tags[i]}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  )

  const commentsBlock = (
    <div>
      <Disqus postNode={post} siteMetadata={data.site.siteMetadata} />
    </div>
  )

  return (
    <div>
      {homeBlock}
      <div className="post-single">
        <div className="post-single__inner">
          <h1
            className="post-single__title"
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `var(--textTitle)`,
            }}
          >
            {post.frontmatter.title}
          </h1>
          <div
            style={{
              textAlign: `center`,
              fontSize: `larger`,
            }}
          >
            {`${formatReadingTime(post.timeToRead)}`}
          </div>
          <div
            className="post-single__body"
            /* eslint-disable-next-line react/no-danger */
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
          <div className="post-single__date">
            <em>
              Published&nbsp;
              {moment(post.frontmatter.date).format(`D MMM YYYY`)}
            </em>
          </div>
        </div>
        <div className="post-single__footer">
          {tagsBlock}
          <div className="mobile-footer-clap">{clapsBtn}</div>
          <hr />
          <ul
            style={{
              display: `flex`,
              flexWrap: `wrap`,
              justifyContent: `space-between`,
              listStyle: `none`,
              padding: 0,
            }}
          >
            <li>
              {previous && (
                <Link to={previous.fields.slug} rel="prev">
                  ←&nbsp;
                  {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title}
                  &nbsp;→
                </Link>
              )}
            </li>
          </ul>
          <div
            className="post-single__footer-text"
            style={{ marginBottom: `1.625rem` }}
          />
          <div className="post-single__footer-text">
            <Links data={author} isFlat />
            <div style={{ marginBottom: `1.625rem` }}>
              <Signup />
            </div>
          </div>
          {commentsBlock}
        </div>
      </div>
    </div>
  )
}

export default PostTemplateDetails

const Claps = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 0.8em;
  button {
    outline: 0;
    background: #e0dbd3;
    width: 58px;
    height: 58px;
    border-radius: 50%;
    border: 1px solid lightgrey;
    font-size: 2em;
    margin-right: 8px;
    cursor: pointer;
  }
  &::before {
    content: "${(props) => `+` + props.newClaps}";
    background: #e0dbd3;
    opacity: 0;
    color: #282c35;
    padding: 8px 12px;
    border-radius: 3px;
    z-index: 1;
    top: 3px;
    left: 6px;
    transition: opacity 0.2s 1s, top 0.2s 1s;
  }
  &:active::before {
    opacity: 1;
    top: -12px;
    transition: opacity 0.2s, top 0.2s;
  }
`
