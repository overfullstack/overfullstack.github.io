import "../../assets/fontello/css/fontello.css"
import "./style.scss"

import React from "react"

export const Links = (props) => {
  const author = props.data
  const links = {
    twitter: author.twitter,
    github: author.github,
    linkedin: author.linkedin,
    youtube: author.youtube,
    email: author.email,
    stackoverflow: author.stackoverflow,
  }

  return props.isFlat ? (
    <div className="links">
      <ul className="links__list" style={{ justifyContent: `space-between` }}>
        <li className="links__list-item">
          <a
            href={`${links.youtube}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="icon-youtube-play" />
          </a>
        </li>
        <li className="links__list-item">
          <a href={`${links.github}`} target="_blank" rel="noopener noreferrer">
            <i className="icon-github" />
          </a>
        </li>
        <li className="links__list-item">
          <a
            href={`${links.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="icon-linkedin" />
          </a>
        </li>
        <li className="links__list-item">
          <a href={`mailto:${links.email}`}>
            <i className="icon-mail" />
          </a>
        </li>
        <li className="links__list-item">
          <a
            href={`${links.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="icon-twitter" />
          </a>
        </li>
        <li className="links__list-item">
          <a
            href={links.stackoverflow}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="icon-stackoverflow" />
          </a>
        </li>
      </ul>
    </div>
  ) : (
    <div className="links">
      <ul className="links__list">
        <li className="links__list-item">
          <a
            href={`${links.youtube}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="icon-youtube-play" />
          </a>
        </li>
        <li className="links__list-item">
          <a href={`${links.github}`} target="_blank" rel="noopener noreferrer">
            <i className="icon-github" />
          </a>
        </li>
        <li className="links__list-item">
          <a
            href={`${links.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="icon-linkedin" />
          </a>
        </li>
      </ul>
      <ul className="links__list">
        <li className="links__list-item">
          <a href={`mailto:${links.email}`}>
            <i className="icon-mail" />
          </a>
        </li>
        <li className="links__list-item">
          <a
            href={`${links.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="icon-twitter" />
          </a>
        </li>
      </ul>
      <ul className="links__list">
        <li className="links__list-item">
          <a
            href={links.stackoverflow}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="icon-stackoverflow" />
          </a>
        </li>
      </ul>
    </div>
  )
}

export default Links
