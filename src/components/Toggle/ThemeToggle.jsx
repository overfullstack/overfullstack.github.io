import React from 'react';
import moon from '../../assets/theme/moon.png';
import sun from '../../assets/theme/sun.png';
import Toggle from './Toggle';

class ThemeToggle extends React.Component {
  state = {
    theme: null,
  };

  componentDidMount() {
    this.setState({ theme: window.__theme });
    window.__onThemeChange = () => {
      this.setState({ theme: window.__theme });
    };
  }

  render() {
    return this.state.theme !== null ? (
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
        onChange={
          (e) => window.__setPreferredTheme(
            e.target.checked ? 'dark' : 'light',
          )
        }
      />
    ) : (
      <div style={{ height: '24px' }}/>
    );
  }
}

export default ThemeToggle;
