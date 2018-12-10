import React from 'react'
import MediaQuery from 'react-responsive'
import get from 'lodash/get'
import { Link } from 'gatsby'
import Menu from '../Menu'
import Links from '../Links'
import profilePic from '../../assets/photo.jpg'
import './style.scss'

class Sidebar extends React.Component {
  render() {
    const { location } = this.props
    const {
      author,
      subtitle,
      copyright,
      menu,
    } = this.props.data.site.siteMetadata
    const isHomePage = get(location, 'pathname', '/') === '/'
    const imgDesktop = (<img
      src={profilePic}
      className="sidebar__author-photo"
      width="75"
      height="75"
      alt={author.name}
    />)
    const imgMobile = (<img
      src={profilePic}
      className="sidebar__author-photo img-mobile"
      width="75"
      height="75"
      alt={author.name}
    />)
    const authorBlock = (
      <div>
        <Link to="/">
          <MediaQuery minDeviceWidth={1224}>
            {imgDesktop}
          </MediaQuery>
          <MediaQuery maxDeviceWidth={1224}>
            {imgMobile}
          </MediaQuery>
        </Link>
        {isHomePage ? (
          <h1 className="sidebar__author-title">
            <Link className="sidebar__author-title-link" to="/">
              {author.name}
            </Link>
          </h1>
        ) : (
          <h2 className="sidebar__author-title">
            <Link className="sidebar__author-title-link" to="/">
              {author.name}
            </Link>
          </h2>
        )}
        <p className="sidebar__author-subtitle">{subtitle}</p>
      </div>
    )

    return (
      <div className="sidebar">
        <div className="sidebar__inner">
          <div className="sidebar__author">{authorBlock}</div>
          <div>
            <Menu data={menu} />
            <Links data={author} />
            <p className="sidebar__copyright">{copyright}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Sidebar
