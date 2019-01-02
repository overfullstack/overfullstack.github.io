import 'gist-syntax-themes/stylesheets/idle-fingers.css'
import React from 'react'
import { Link } from 'gatsby'
import moment from 'moment'
import Disqus from '../Disqus/Disqus'
import './style.scss'
import Links from '../Links'
import Bio from '../Bio'
import { formatReadingTime, getCurrentPath } from '../utils'

class PostTemplateDetails extends React.Component {
  render() {
    const { subtitle, author } = this.props.data.site.siteMetadata
    const { previous, next } = this.props.pageContext
    const post = this.props.data.markdownRemark
    const tags = post.fields.tagSlugs
    const { location } = this.props
    const applauseButton = <div className="applause"><applause-button multiclap="true" /></div>
    const homeBlock = (
      <div>
        <Link className="post-single__home-button" to="/">
          All Articles
        </Link>
        {applauseButton}
      </div>
    )

    const tagsBlock = (
      <div className="post-single__tags">
        <ul className="post-single__tags-list">
          {tags
            && tags.map((tag, i) => (
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
        <Disqus
          postNode={post}
          siteMetadata={this.props.data.site.siteMetadata}
        />
      </div>
    )

    return (
      <div>
        {homeBlock}
        <div className="post-single">
          <div className="post-single__inner">
            <h1 className="post-single__title">{post.frontmatter.title}</h1>
            <div style={{ textAlign: 'center', fontSize: 'larger' }}>
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
                {moment(post.frontmatter.date).format('D MMM YYYY')}
              </em>
            </div>
          </div>
          <div className="post-single__footer">
            {tagsBlock}
            <div className="mobile-footer-clap">{applauseButton}</div>
            <hr />
            <ul
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                listStyle: 'none',
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
            <div className="post-single__footer-text" style={{ marginBottom: '1.625rem' }}>
              <Bio
                author={author}
                subtitle={subtitle}
                path={getCurrentPath(location)}
              />
              <a
                href={`${author.resume}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>
                  My&nbsp; Résumé
                </strong>
              </a>
            </div>
            <div className="post-single__footer-text">
              <Links data={author} isFlat />
            </div>
            {commentsBlock}
          </div>
        </div>
      </div>
    )
  }
}

export default PostTemplateDetails
