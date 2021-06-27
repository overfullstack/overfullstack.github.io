import React from 'react';
import Menu from '../Menu';
import Links from '../Links';
import './style.scss';
import Emoji from '../Emoji/Emoji';
import Bio from '../Bio';
import { getCurrentPath } from '../utils';
import ThemeToggle from '../Toggle/ThemeToggle';

class Sidebar extends React.Component {
  render() {
    const { location } = this.props;
    const {
      author,
      subtitle,
      copyright,
      declaration,
      menu,
    } = this.props.data.site.siteMetadata;

    return (
      <div className="sidebar">
        <div className="sidebar__inner">
          <Bio
            className="sidebar__author"
            author={author}
            subtitle={subtitle}
            path={getCurrentPath(location)}
          />

          <div className="sidebar__inner-middle">
            <Menu data={menu}/>
            <Links data={author}/>
            <ThemeToggle/>
          </div>

          <div>
            <p className="sidebar__copyright" style={{ marginTop: `0` }}>
              {declaration}
              &nbsp;
              <Emoji symbol="⚛️"/>
            </p>
            <p className="sidebar__copyright">{copyright}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
