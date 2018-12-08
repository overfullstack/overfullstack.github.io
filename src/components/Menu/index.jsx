import React from 'react'
import MediaQuery from 'react-responsive'
import { Link } from 'gatsby'
import './style.scss'

class Menu extends React.Component {
  render() {
    const menu = this.props.data

    const menuItems = <>{menu.map(item => (
      <li className="menu__list-item" key={item.path}>
        <Link
          to={item.path}
          className="menu__list-item-link"
          activeClassName="menu__list-item-link menu__list-item-link--active"
        >
          {item.label}
        </Link>
      </li>
    ))}</>
    const menuBlock = (
      <div>
        <MediaQuery minDeviceWidth={1224}>
          <ul className="menu__list">
            {menuItems}
          </ul>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={1224}>
          <ul className="menu__list menu-mobile">
            {menuItems}
          </ul>
        </MediaQuery>
      </div>
    )

    return <nav className="menu">{menuBlock}</nav>
  }
}

export default Menu
