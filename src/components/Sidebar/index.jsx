import React from 'react'
import Menu from '../Menu'
import Links from '../Links'
import './style.scss'
import Emoji from '../Emoji/Emoji'
import Bio from '../Bio'
import { getCurrentPath } from '../utils'

class Sidebar extends React.Component {
  render() {
    const { location } = this.props
    const {
      author,
      subtitle,
      copyright,
      menu,
    } = this.props.data.site.siteMetadata
    return (
      <div className="sidebar">
        <div className="sidebar__inner">
          <div className="sidebar__author">
            <Bio
              author={author}
              subtitle={subtitle}
              path={getCurrentPath(location)}
            />
          </div>
          <div>
            <Menu data={menu} />
            <Links data={author} />
            <p className="sidebar__copyright" style={{ marginTop: 0 }}>
              This Blog is built with React.js&nbsp;
              <Emoji symbol="⚛️" />
            </p>
            <p className="sidebar__copyright">{copyright}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Sidebar
