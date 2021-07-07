import "./style.scss"

import { Link } from "gatsby"
import React from "react"

export const Menu = (props) => {
  const menu = props.data

  const menuBlock = (
    <ul className="menu__list">
      {menu.map((item) => (
        <li className="menu__list-item" key={item.path}>
          <Link
            to={item.path}
            className="menu__list-item-link"
            activeClassName="menu__list-item-link menu__list-item-link--active"
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `var(--textLink)`,
            }}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  )

  return <nav className="menu">{menuBlock}</nav>
}

export default Menu
