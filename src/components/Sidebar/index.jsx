import React from 'react';
import Menu from '../Menu';
import Links from '../Links';
import './style.scss';
import Emoji from '../Emoji/Emoji';
import Bio from '../Bio';
import { getCurrentPath } from '../utils';
import sun from '../../assets/theme/sun.png';
import moon from '../../assets/theme/moon.png';
import Toggle from '../Toggle/Toggle';

class Sidebar extends React.Component {
  state = {
    theme: null,
  }

  componentDidMount() {
    this.setState({ theme: window.__theme });
    window.__onThemeChange = () => {
      this.setState({ theme: window.__theme });
    };
  }

  render() {
    const { location } = this.props;
    const {
      author,
      subtitle,
      copyright,
      declaration,
      menu,
    } = this.props.data.site.siteMetadata;
    const themeToggle = this.state.theme !== null ? (
      <Toggle
        icons={{
          checked: (
            <img
              src={moon}
              alt="dark"
              role="presentation"
              style={{ pointerEvents: 'none' }}
            />
          ),
          unchecked: (
            <img
              src={sun}
              alt="light"
              role="presentation"
              style={{ pointerEvents: 'none' }}
            />
          ),
        }}
        checked={this.state.theme === 'dark'}
        onChange={e => window.__setPreferredTheme(
          e.target.checked ? 'dark' : 'light',
        )
        }
      />
    ) : (
      <div style={{ height: '24px' }} />
    );

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
            <Menu data={menu} />
            <Links data={author} />
            {themeToggle}
          </div>

          <div>
            <p className="sidebar__copyright" style={{ marginTop: '0' }}>
              {declaration}
              &nbsp;
              <Emoji symbol="⚛️" />
            </p>
            <p className="sidebar__copyright">{copyright}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
